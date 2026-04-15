import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

// ── Zod schema for incoming test payload ─────────────────────────────────────
const QuestionInput = z.object({
  question_text: z.string().min(5),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().nullable().optional(),
  option_d: z.string().nullable().optional(),
  correct: z.enum(["a", "b", "c", "d"]),
  marks: z.number().int().positive().default(1),
  explanation: z.string().nullable().optional(),
});

const CreateTestInput = z.object({
  title: z.string().min(3).max(200),
  subject: z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  time_limit_mins: z.number().int().positive().nullable().optional(),
  questions: z
    .array(QuestionInput)
    .min(1, "At least 1 question is required")
    .max(200, "Maximum 200 questions per test"),
});

export async function POST(request: NextRequest) {
  // ── Auth: educator only ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: educator } = await supabase
    .from("educators")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!educator) {
    return NextResponse.json({ error: "Forbidden: educators only" }, { status: 403 });
  }

  // ── Parse + validate body ────────────────────────────────────────────────────
  let input: z.infer<typeof CreateTestInput>;
  try {
    const body = await request.json();
    input = CreateTestInput.parse(body);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid input", details: err instanceof z.ZodError ? err.issues : err },
      { status: 400 }
    );
  }

  // Ensure no unflagged questions (all must have a valid correct answer)
  const { title, subject, description, time_limit_mins, questions } = input;

  // ── Create test ──────────────────────────────────────────────────────────────
  const slug = generateSlug(title);
  const total_marks = questions.reduce((sum, q) => sum + (q.marks ?? 1), 0);

  const { data: test, error: testError } = await supabase
    .from("tests")
    .insert({
      educator_id: educator.id,
      title,
      subject: subject ?? null,
      description: description ?? null,
      slug,
      time_limit_mins: time_limit_mins ?? null,
      total_marks,
      question_count: questions.length,
      is_published: true, // published immediately on creation (V1 design)
    })
    .select("id, slug")
    .single();

  if (testError || !test) {
    console.error("[api/tests] insert test error:", testError);
    // Slug collision fallback — retry with a new slug
    if (testError?.code === "23505") {
      return NextResponse.json(
        { error: "Slug collision — please try creating the test again" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create test" }, { status: 500 });
  }

  // ── Bulk insert questions ────────────────────────────────────────────────────
  const questionRows = questions.map((q, index) => ({
    test_id: test.id,
    order_index: index + 1,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c ?? null,
    option_d: q.option_d ?? null,
    correct: q.correct,
    marks: q.marks ?? 1,
    explanation: q.explanation ?? null,
  }));

  const { error: questionsError } = await supabase
    .from("questions")
    .insert(questionRows);

  if (questionsError) {
    console.error("[api/tests] insert questions error:", questionsError);
    // Clean up the test row if questions failed
    await supabase.from("tests").delete().eq("id", test.id);
    return NextResponse.json({ error: "Failed to save questions" }, { status: 500 });
  }

  return NextResponse.json(
    {
      test_id: test.id,
      slug: test.slug,
      share_url: `/t/${test.slug}`,
      question_count: questions.length,
      total_marks,
    },
    { status: 201 }
  );
}
