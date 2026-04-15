import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StudentQuestionReview } from "@/components/review/StudentQuestionReview";
import type { ReviewQuestion } from "@/components/review/StudentQuestionReview";

type PageProps = {
  params: Promise<{ submissionId: string }>;
};

export default async function StudentTestReviewPage({ params }: PageProps) {
  const { submissionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the submission (must belong to this student)
  const { data: submission } = await supabase
    .from("submissions")
    .select(
      `id, score, total_marks, correct_count, wrong_count, unanswered,
       rank, time_taken_sec, submitted_at, student_id,
       tests (
         id, title, slug, subject, question_count,
         educators ( name )
       )`
    )
    .eq("id", submissionId)
    .eq("student_id", user.id)
    .single();

  if (!submission) notFound();

  const test = submission.tests as {
    id: string;
    title: string;
    slug: string;
    subject: string | null;
    question_count: number;
    educators: { name: string } | null;
  } | null;

  // Total participants for this test
  const { count: totalParticipants } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", test?.id ?? "");

  // Fetch per-question answers
  const { data: rawAnswers } = await supabase
    .from("submission_answers")
    .select(
      `chosen_option, is_correct,
       questions (
         order_index, question_text,
         option_a, option_b, option_c, option_d,
         correct, explanation
       )`
    )
    .eq("submission_id", submissionId);

  const reviewQuestions: ReviewQuestion[] = (rawAnswers ?? [])
    .filter((a) => a.questions !== null)
    .map((a) => {
      const q = a.questions as {
        order_index: number;
        question_text: string;
        option_a: string;
        option_b: string;
        option_c: string | null;
        option_d: string | null;
        correct: string;
        explanation: string | null;
      };
      return {
        order_index: q.order_index,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct: q.correct.trim(),
        explanation: q.explanation,
        chosen_option: a.chosen_option ? a.chosen_option.trim() : null,
        is_correct: a.is_correct,
      };
    })
    .sort((a, b) => a.order_index - b.order_index);

  function formatTimeSec(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const scorePct =
    submission.total_marks > 0
      ? Math.round((submission.score / submission.total_marks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* Back nav */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors mb-8"
        >
          ← Back to Profile
        </Link>

        {/* Test header */}
        <div className="mb-8">
          <p className="text-xs text-text-muted mb-1">
            {test?.educators?.name ?? "Educator"}
            {test?.subject && ` · ${test.subject}`}
          </p>
          <h1 className="text-xl font-bold text-text mb-4">
            {test?.title ?? "Test"}
          </h1>

          {/* Score summary cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-base font-bold font-mono text-text">
                {submission.score}/{submission.total_marks}
              </p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                Score
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-base font-bold font-mono text-text">
                #{submission.rank}
                <span className="text-xs text-text-muted font-normal">
                  /{totalParticipants ?? "?"}
                </span>
              </p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                Rank
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-base font-bold font-mono text-text">
                {formatTimeSec(submission.time_taken_sec ?? 0)}
              </p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                Time
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-base font-bold font-mono text-text">
                {scorePct}%
              </p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                Accuracy
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted uppercase tracking-widest font-semibold">
            Answer Review
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Question review */}
        {reviewQuestions.length > 0 ? (
          <StudentQuestionReview questions={reviewQuestions} />
        ) : (
          <p className="text-sm text-text-muted text-center py-10">
            Answer details not available for this test.
          </p>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-xs text-text-muted">
            Powered by{" "}
            <Link href="/" className="text-text-secondary hover:text-text transition-colors">
              TestLink
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
