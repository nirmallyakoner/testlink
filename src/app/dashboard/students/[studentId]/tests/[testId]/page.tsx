import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StudentQuestionReview } from "@/components/review/StudentQuestionReview";
import type { ReviewQuestion } from "@/components/review/StudentQuestionReview";

// NOTE: The educator sees chosen answers + correct/wrong status,
// but the StudentQuestionReview component's "Why is this wrong?" button
// is ONLY mounted when explanation is non-null.  Here we deliberately
// pass explanation: null for all questions so the educator never sees it.

type PageProps = {
  params: Promise<{ studentId: string; testId: string }>;
};

export default async function EducatorStudentTestReviewPage({
  params,
}: PageProps) {
  const { studentId, testId } = await params;
  const supabase = await createClient();

  // Must be an educator who owns this test
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: educator } = await supabase
    .from("educators")
    .select("id")
    .eq("id", user.id)
    .single();
  if (!educator) redirect("/not-educator");

  // Verify test belongs to educator
  const { data: test } = await supabase
    .from("tests")
    .select("id, title, subject, total_marks, question_count")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();
  if (!test) notFound();

  // Student public profile
  const { data: studentProfile } = await supabase
    .from("student_public_profiles")
    .select("id, username, avatar_url")
    .eq("id", studentId)
    .single();
  if (!studentProfile) notFound();

  // Submission for this student + test
  const { data: submission } = await supabase
    .from("submissions")
    .select(
      "id, score, total_marks, correct_count, wrong_count, unanswered, rank, time_taken_sec, submitted_at"
    )
    .eq("test_id", testId)
    .eq("student_id", studentId)
    .single();
  if (!submission) notFound();

  // Total participants
  const { count: totalParticipants } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  // Per-question answers — NO explanation passed (educator should not see it)
  const { data: rawAnswers } = await supabase
    .from("submission_answers")
    .select(
      `chosen_option, is_correct,
       questions (
         order_index, question_text,
         option_a, option_b, option_c, option_d,
         correct
       )`
    )
    .eq("submission_id", submission.id);

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
      };
      return {
        order_index: q.order_index,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct: q.correct.trim(),
        explanation: null, // deliberately withheld from educator view
        chosen_option: a.chosen_option ? a.chosen_option.trim() : null,
        is_correct: a.is_correct,
      };
    })
    .sort((a, b) => a.order_index - b.order_index);

  function formatTimeSec(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Back nav */}
        <Link
          href={`/dashboard/students/${studentId}?test=${testId}`}
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors mb-8"
        >
          ← Back to {studentProfile.username}&apos;s Profile
        </Link>

        {/* Test + student header */}
        <div className="mb-8">
          <p className="text-xs text-text-muted mb-1">
            {studentProfile.username}
            {test.subject && ` · ${test.subject}`}
          </p>
          <h1 className="text-xl font-bold text-text mb-4">{test.title}</h1>

          {/* Summary pills */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Score",
                value: `${submission.score}/${submission.total_marks}`,
              },
              {
                label: "Rank",
                value: `#${submission.rank ?? "?"} / ${totalParticipants ?? "?"}`,
              },
              {
                label: "Time",
                value: formatTimeSec(submission.time_taken_sec ?? 0),
              },
              {
                label: "Correct",
                value: `${submission.correct_count} / ${test.question_count}`,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-surface border border-border rounded-xl p-3 text-center"
              >
                <p className="text-sm font-bold font-mono text-text">
                  {card.value}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted uppercase tracking-widest font-semibold">
            Per-Question Breakdown
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Q-Review — no explanations (null passed above) */}
        {reviewQuestions.length > 0 ? (
          <StudentQuestionReview questions={reviewQuestions} />
        ) : (
          <p className="text-sm text-text-muted text-center py-10">
            Answer data not available for this submission.
          </p>
        )}
      </div>
    </div>
  );
}
