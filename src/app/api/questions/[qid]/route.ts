import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

type Params = { params: Promise<{ qid: string }> };

const UpdateInput = z.object({
  question_text: z.string().min(5).optional(),
  option_a: z.string().min(1).optional(),
  option_b: z.string().min(1).optional(),
  option_c: z.string().nullable().optional(),
  option_d: z.string().nullable().optional(),
  correct: z.enum(["a", "b", "c", "d"]).nullable().optional(),
  marks: z.number().int().positive().optional(),
  explanation: z.string().nullable().optional(),
});

// Helper: get question + test ownership in one go
async function getQuestionWithTest(supabase: Awaited<ReturnType<typeof createClient>>, qid: string, userId: string) {
  const { data } = await supabase
    .from("questions")
    .select("id, correct, marks, test_id, tests!inner(id, educator_id, is_published, total_marks)")
    .eq("id", qid)
    .single();

  if (!data) return null;
  const test = data.tests as unknown as {
    id: string;
    educator_id: string;
    is_published: boolean;
    total_marks: number;
  };
  if (test.educator_id !== userId) return null;
  return { question: data, test };
}

// PUT /api/questions/[qid]
export async function PUT(request: NextRequest, { params }: Params) {
  const { qid } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getQuestionWithTest(supabase, qid, user.id);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { question, test } = result;

  let input: z.infer<typeof UpdateInput>;
  try {
    input = UpdateInput.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Lock check: if published test has submissions, can't change correct answer
  if (input.correct !== undefined && input.correct !== question.correct) {
    if (test.is_published) {
      const { count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("test_id", test.id);

      if ((count ?? 0) > 0) {
        return NextResponse.json(
          {
            error: `Correct answer is locked — ${count} student(s) have already submitted this test.`,
            locked: true,
            submission_count: count,
          },
          { status: 409 }
        );
      }
    }
  }

  const { data: updated, error } = await supabase
    .from("questions")
    .update({
      ...(input.question_text !== undefined ? { question_text: input.question_text } : {}),
      ...(input.option_a !== undefined ? { option_a: input.option_a } : {}),
      ...(input.option_b !== undefined ? { option_b: input.option_b } : {}),
      ...(input.option_c !== undefined ? { option_c: input.option_c } : {}),
      ...(input.option_d !== undefined ? { option_d: input.option_d } : {}),
      ...(input.correct !== undefined ? { correct: input.correct ?? undefined } : {}),
      ...(input.marks !== undefined ? { marks: input.marks } : {}),
      ...(input.explanation !== undefined ? { explanation: input.explanation } : {}),
    })
    .eq("id", qid)
    .select("id, order_index, question_text, option_a, option_b, option_c, option_d, correct, marks, explanation")
    .single();

  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

  // Recalculate total_marks if marks changed
  if (input.marks !== undefined && input.marks !== question.marks) {
    const delta = (input.marks ?? 1) - (question.marks ?? 1);
    await supabase
      .from("tests")
      .update({ total_marks: (test.total_marks ?? 0) + delta })
      .eq("id", test.id);
  }

  return NextResponse.json({ question: updated });
}

// DELETE /api/questions/[qid]
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { qid } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await getQuestionWithTest(supabase, qid, user.id);
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { question, test } = result;

  // Lock check: can't delete if this question has been answered
  const { count: answerCount } = await supabase
    .from("submission_answers")
    .select("*", { count: "exact", head: true })
    .eq("question_id", qid);

  if ((answerCount ?? 0) > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — ${answerCount} student(s) have answered this question.`,
        locked: true,
        answer_count: answerCount,
      },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("questions").delete().eq("id", qid);
  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

  // Update counts
  await supabase
    .from("tests")
    .update({
      question_count: Math.max(0, (await getCount(supabase, test.id))),
      total_marks: Math.max(0, (test.total_marks ?? 0) - (question.marks ?? 1)),
    })
    .eq("id", test.id);

  return NextResponse.json({ success: true });
}

async function getCount(supabase: Awaited<ReturnType<typeof createClient>>, testId: string) {
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);
  return count ?? 0;
}
