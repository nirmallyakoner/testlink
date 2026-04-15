import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResultView } from "./ResultView";
import type { ReviewQuestion } from "@/components/review/StudentQuestionReview";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ResultPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Must be signed in (proxy already checked, but be explicit)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/t/${slug}`);

  // Fetch the test
  const { data: test } = await supabase
    .from("tests")
    .select("id, title, total_marks, educator_id")
    .eq("slug", slug)
    .single();

  if (!test) redirect("/");

  // Fetch this student's submission
  const { data: submission } = await supabase
    .from("submissions")
    .select(
      "id, score, total_marks, correct_count, wrong_count, unanswered, rank, time_taken_sec, is_creator_submission"
    )
    .eq("test_id", test.id)
    .eq("student_id", user.id)
    .single();

  // No submission yet — redirect back to test
  if (!submission) redirect(`/t/${slug}`);

  // Fetch educator name
  const { data: educator } = await supabase
    .from("educators")
    .select("name")
    .eq("id", test.educator_id)
    .single();

  // Fetch top 10 submissions by rank, ordered
  const { data: topSubmissions } = await supabase
    .from("submissions")
    .select(
      "id, score, rank, time_taken_sec, student_id, is_creator_submission"
    )
    .eq("test_id", test.id)
    .order("rank", { ascending: true })
    .limit(10);

  // Total participant count
  const { count: totalStudents } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", test.id);

  // Collect all student IDs needed (top 10 + current user)
  const topStudentIds = (topSubmissions ?? []).map((s) => s.student_id);
  const allIds = [...new Set([...topStudentIds, user.id])];

  // Fetch public profiles (security_invoker=off so anyone can read username/avatar_url)
  const { data: profiles } = await supabase
    .from("student_public_profiles")
    .select("id, username, avatar_url")
    .in("id", allIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  );

  // Build leaderboard array
  const leaderboard = (topSubmissions ?? []).map((s) => ({
    rank: s.rank ?? 0,
    username: profileMap.get(s.student_id)?.username ?? "Student",
    avatar_url: profileMap.get(s.student_id)?.avatar_url ?? null,
    score: s.score,
    time_taken_sec: s.time_taken_sec ?? 0,
    isYou: s.student_id === user.id,
    is_creator: s.is_creator_submission,
  }));

  // If current user is not in top 10, append their entry
  const youInTop10 = leaderboard.some((e) => e.isYou);
  if (!youInTop10) {
    leaderboard.push({
      rank: submission.rank ?? 0,
      username: profileMap.get(user.id)?.username ?? "You",
      avatar_url: profileMap.get(user.id)?.avatar_url ?? null,
      score: submission.score,
      time_taken_sec: submission.time_taken_sec ?? 0,
      isYou: true,
      is_creator: submission.is_creator_submission,
    });
  }

  // ── Fetch per-question review data ─────────────────────────────────────────
  // submission_answers joined with questions (RLS allows this after submission)
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

  return (
    <ResultView
      result={{
        testTitle: test.title,
        educator: educator?.name ?? "Educator",
        score: submission.score,
        totalMarks: test.total_marks,
        rank: submission.rank ?? 0,
        totalStudents: totalStudents ?? 1,
        correctCount: submission.correct_count,
        wrongCount: submission.wrong_count,
        unanswered: submission.unanswered,
        timeTakenSec: submission.time_taken_sec ?? 0,
        isCreator: submission.is_creator_submission,
      }}
      leaderboard={leaderboard}
      reviewQuestions={reviewQuestions}
    />
  );
}
