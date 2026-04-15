import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/tests/[slug]
 *
 * Public endpoint — no auth required.
 * Returns test metadata + questions for a published test.
 *
 * IMPORTANT: The `correct` field is intentionally EXCLUDED from the questions
 * returned here. Correct answers are only read server-side in the
 * submit-test Edge Function using the service role key.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Fetch test metadata (RLS allows published tests for everyone)
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select(
      "id, title, subject, description, slug, time_limit_mins, question_count, total_marks, educator_id, created_at"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (testError || !test) {
    return NextResponse.json(
      { error: "Test not found or not published" },
      { status: 404 }
    );
  }

  // Fetch questions — deliberately omit `correct` and `explanation`
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select(
      "id, order_index, question_text, option_a, option_b, option_c, option_d, marks"
    )
    .eq("test_id", test.id)
    .order("order_index", { ascending: true });

  if (questionsError) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }

  // Fetch educator public info
  const { data: educator } = await supabase
    .from("educators")
    .select("name, avatar_url")
    .eq("id", test.educator_id)
    .single();

  return NextResponse.json({
    test: {
      id: test.id,
      title: test.title,
      subject: test.subject,
      description: test.description,
      slug: test.slug,
      time_limit_mins: test.time_limit_mins,
      question_count: test.question_count,
      total_marks: test.total_marks,
      created_at: test.created_at,
    },
    educator: educator
      ? { name: educator.name, avatar_url: educator.avatar_url }
      : null,
    questions: questions ?? [],
  });
}
