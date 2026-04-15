import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const QuestionInput = z.object({
  question_text: z.string().min(5),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().nullable().optional(),
  option_d: z.string().nullable().optional(),
  correct: z.enum(["a", "b", "c", "d"]).nullable().optional(),
  marks: z.number().int().positive().default(1),
  explanation: z.string().nullable().optional(),
});

// GET /api/tests/[id]/questions
export async function GET(_req: NextRequest, { params }: Params) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: test } = await supabase
    .from("tests")
    .select("id")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: questions } = await supabase
    .from("questions")
    .select("id, order_index, question_text, option_a, option_b, option_c, option_d, correct, marks, explanation")
    .eq("test_id", testId)
    .order("order_index", { ascending: true });

  return NextResponse.json({ questions: questions ?? [] });
}

// POST /api/tests/[id]/questions — add one or more questions to an existing test
export async function POST(request: NextRequest, { params }: Params) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership + get current state
  const { data: test } = await supabase
    .from("tests")
    .select("id, is_published, question_count, total_marks")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let newQuestions: z.infer<typeof QuestionInput>[];
  try {
    const body = await request.json();
    newQuestions = z.array(QuestionInput).min(1).parse(body.questions);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // If published with submissions, block adding questions that have no correct
  const { count: submissionCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  if ((submissionCount ?? 0) > 0) {
    const missingCorrect = newQuestions.filter((q) => !q.correct).length;
    if (missingCorrect > 0) {
      return NextResponse.json(
        {
          error: `Cannot add questions without a correct answer to a test with existing submissions.`,
        },
        { status: 422 }
      );
    }
  }

  // Get current max order_index
  const { data: maxRow } = await supabase
    .from("questions")
    .select("order_index")
    .eq("test_id", testId)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const startIndex = (maxRow?.order_index ?? 0) + 1;

  const rows = newQuestions.map((q, i) => ({
    test_id: testId,
    order_index: startIndex + i,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c ?? null,
    option_d: q.option_d ?? null,
    correct: q.correct ?? null,
    marks: q.marks ?? 1,
    explanation: q.explanation ?? null,
  }));

  const { data: inserted, error } = await supabase
    .from("questions")
    .insert(rows)
    .select("id, order_index, question_text, option_a, option_b, option_c, option_d, correct, marks, explanation");

  if (error) return NextResponse.json({ error: "Failed to insert questions" }, { status: 500 });

  // Update test counts
  const addedMarks = newQuestions.reduce((s, q) => s + (q.marks ?? 1), 0);
  await supabase
    .from("tests")
    .update({
      question_count: (test.question_count ?? 0) + newQuestions.length,
      total_marks: (test.total_marks ?? 0) + addedMarks,
    })
    .eq("id", testId);

  return NextResponse.json({ questions: inserted ?? [], total_added: newQuestions.length }, { status: 201 });
}
