import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: test } = await supabase
    .from("tests")
    .select("id, is_published, question_count")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (test.is_published)
    return NextResponse.json({ error: "Test is already published" }, { status: 409 });

  // All questions must have a correct answer
  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id, correct, marks")
    .eq("test_id", testId);

  if (qErr) return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  if (!questions || questions.length === 0)
    return NextResponse.json({ error: "Test has no questions" }, { status: 422 });

  const missing = questions.filter((q) => !q.correct).length;
  if (missing > 0) {
    return NextResponse.json(
      { error: `${missing} question(s) still need a correct answer.` },
      { status: 422 }
    );
  }

  const total_marks = questions.reduce((sum, q) => sum + (q.marks ?? 1), 0);

  const { error } = await supabase
    .from("tests")
    .update({
      is_published: true,
      question_count: questions.length,
      total_marks,
    })
    .eq("id", testId);

  if (error) return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  return NextResponse.json({ success: true, question_count: questions.length, total_marks });
}
