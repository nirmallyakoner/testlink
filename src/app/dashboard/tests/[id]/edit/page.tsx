import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { EditTestView } from "@/components/test-editor/EditTestView";
import type { EditorQuestion } from "@/components/test-editor/EditTestView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTestPage({ params }: PageProps) {
  const { id: testId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify ownership
  const { data: test } = await supabase
    .from("tests")
    .select("id, title, slug, subject, time_limit_mins, is_published, question_count, total_marks")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) notFound();

  // Submission count
  const { count: submissionCount } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  // Questions
  const { data: questions } = await supabase
    .from("questions")
    .select("id, order_index, question_text, option_a, option_b, option_c, option_d, correct, marks, explanation")
    .eq("test_id", testId)
    .order("order_index", { ascending: true });

  const editorQuestions: EditorQuestion[] = (questions ?? []).map((q) => ({
    id: q.id,
    order_index: q.order_index,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct: q.correct as "a" | "b" | "c" | "d" | null,
    marks: q.marks,
    explanation: q.explanation,
  }));

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="text-xs text-text-muted hover:text-text transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-xs text-text-secondary truncate max-w-[200px]">
          {test.title}
        </span>
        {test.is_published ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
            Live
          </span>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded-full">
            Draft
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-text mb-6">Edit Test</h1>

      <EditTestView
        testId={test.id}
        initialTitle={test.title}
        initialSubject={test.subject}
        initialTimeLimitMins={test.time_limit_mins}
        initialQuestions={editorQuestions}
        isPublished={test.is_published}
        submissionCount={submissionCount ?? 0}
        mode="edit"
      />
    </div>
  );
}
