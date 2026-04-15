import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { AnalyticsView } from "./AnalyticsView";
import type { EducatorQuestionStat } from "@/components/review/EducatorQuestionStats";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalyticsPage({ params }: PageProps) {
  const { id: testId } = await params;
  const supabase = await createClient();

  // Must be logged-in educator
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify educator owns this test
  const { data: test } = await supabase
    .from("tests")
    .select("id, title, slug, subject, question_count, total_marks, created_at, is_published")
    .eq("id", testId)
    .eq("educator_id", user.id)
    .single();

  if (!test) notFound();

  // ── Overview stats ─────────────────────────────────────────────────────────
  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      "id, score, total_marks, correct_count, wrong_count, unanswered, rank, time_taken_sec, submitted_at, student_id"
    )
    .eq("test_id", testId)
    .order("rank", { ascending: true });

  const totalAttempts = submissions?.length ?? 0;

  const avgScore =
    totalAttempts > 0
      ? Number(
          (
            submissions!.reduce((sum, s) => sum + Number(s.score), 0) /
            totalAttempts
          ).toFixed(1)
        )
      : 0;

  const avgTimeSec =
    totalAttempts > 0
      ? Math.round(
          submissions!.reduce((sum, s) => sum + (s.time_taken_sec ?? 0), 0) /
            totalAttempts
        )
      : 0;

  const completionRate =
    totalAttempts > 0
      ? Math.round(
          (submissions!.filter((s) => s.unanswered === 0).length /
            totalAttempts) *
            100
        )
      : 0;

  // ── Student public profiles ────────────────────────────────────────────────
  const studentIds = [...new Set((submissions ?? []).map((s) => s.student_id))];

  const { data: profiles } = await supabase
    .from("student_public_profiles")
    .select("id, username, avatar_url")
    .in("id", studentIds.length > 0 ? studentIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  // Student list for the table
  const studentList = (submissions ?? []).map((s) => ({
    submissionId: s.id,
    studentId: s.student_id,
    username: profileMap.get(s.student_id)?.username ?? "Student",
    avatarUrl: profileMap.get(s.student_id)?.avatar_url ?? null,
    rank: s.rank ?? 0,
    score: s.score,
    timeTakenSec: s.time_taken_sec ?? 0,
    correctCount: s.correct_count,
    wrongCount: s.wrong_count,
    unanswered: s.unanswered,
    submittedAt: s.submitted_at,
  }));

  // ── Per-question aggregate stats ────────────────────────────────────────────
  const { data: questions } = await supabase
    .from("questions")
    .select(
      "id, order_index, question_text, option_a, option_b, option_c, option_d, correct"
    )
    .eq("test_id", testId)
    .order("order_index");

  // Fetch all submission_answers for this test's submissions
  const submissionIds = (submissions ?? []).map((s) => s.id);
  const { data: allAnswers } =
    submissionIds.length > 0
      ? await supabase
          .from("submission_answers")
          .select("question_id, chosen_option, is_correct")
          .in("submission_id", submissionIds)
      : { data: [] };

  // Aggregate per question
  const questionStats: EducatorQuestionStat[] = (questions ?? []).map((q) => {
    const answersForQ = (allAnswers ?? []).filter(
      (a) => a.question_id === q.id
    );
    const correctCount = answersForQ.filter((a) => a.is_correct).length;
    const skippedCount = answersForQ.filter(
      (a) => a.chosen_option === null
    ).length;
    const wrongCount = answersForQ.length - correctCount - skippedCount;

    const optionCounts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    answersForQ.forEach((a) => {
      const opt = a.chosen_option?.trim();
      if (opt && opt in optionCounts) {
        optionCounts[opt]++;
      }
    });

    return {
      order_index: q.order_index,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct: q.correct.trim(),
      correct_count: correctCount,
      wrong_count: wrongCount,
      skipped_count: skippedCount,
      total_attempts: answersForQ.length,
      option_counts: optionCounts,
    };
  });

  // Score distribution buckets
  const buckets = [
    { range: "0–20%", min: 0, max: 20, count: 0 },
    { range: "21–40%", min: 21, max: 40, count: 0 },
    { range: "41–60%", min: 41, max: 60, count: 0 },
    { range: "61–80%", min: 61, max: 80, count: 0 },
    { range: "81–100%", min: 81, max: 100, count: 0 },
  ];
  (submissions ?? []).forEach((s) => {
    const pct =
      s.total_marks > 0 ? (Number(s.score) / s.total_marks) * 100 : 0;
    const bucket = buckets.find((b) => pct >= b.min && pct <= b.max);
    if (bucket) bucket.count++;
  });
  const scoreDistribution = buckets.map((b) => ({
    range: b.range,
    count: b.count,
    percentage: totalAttempts > 0 ? Math.round((b.count / totalAttempts) * 100) : 0,
  }));

  return (
    <AnalyticsView
      test={{
        id: test.id,
        title: test.title,
        slug: test.slug,
        subject: test.subject,
        questionCount: test.question_count,
        totalMarks: test.total_marks,
        createdAt: test.created_at,
      }}
      stats={{
        totalAttempts,
        avgScore,
        avgTimeSec,
        completionRate,
      }}
      studentList={studentList}
      scoreDistribution={scoreDistribution}
      questionStats={questionStats}
    />
  );
}
