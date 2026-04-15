import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentProfileView } from "./StudentProfileView";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Must be a student
  const { data: student } = await supabase
    .from("students")
    .select("id, name, username, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  if (!student) redirect("/");

  // All submissions for this student, joined with test info
  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      `id, score, total_marks, correct_count, wrong_count, unanswered,
       rank, time_taken_sec, submitted_at,
       tests (
         id, title, slug, subject, question_count, total_marks,
         educators ( name )
       )`
    )
    .eq("student_id", user.id)
    .order("submitted_at", { ascending: false });

  // Total participant counts per test (for "rank out of N")
  const testIds = (submissions ?? [])
    .map((s) => (s.tests as { id: string } | null)?.id)
    .filter(Boolean) as string[];

  const participantCounts: Record<string, number> = {};
  if (testIds.length > 0) {
    const { data: counts } = await supabase
      .from("submissions")
      .select("test_id")
      .in("test_id", testIds);

    (counts ?? []).forEach((row) => {
      participantCounts[row.test_id] =
        (participantCounts[row.test_id] ?? 0) + 1;
    });
  }

  // Build display list
  const testHistory = (submissions ?? []).map((s) => {
    const test = s.tests as {
      id: string;
      title: string;
      slug: string;
      subject: string | null;
      question_count: number;
      total_marks: number;
      educators: { name: string } | null;
    } | null;

    return {
      submissionId: s.id,
      score: s.score,
      totalMarks: s.total_marks,
      correctCount: s.correct_count,
      wrongCount: s.wrong_count,
      unanswered: s.unanswered,
      rank: s.rank ?? 0,
      timeTakenSec: s.time_taken_sec ?? 0,
      submittedAt: s.submitted_at,
      totalParticipants: test ? (participantCounts[test.id] ?? 1) : 1,
      testTitle: test?.title ?? "Unknown Test",
      testSlug: test?.slug ?? "",
      testSubject: test?.subject ?? null,
      questionCount: test?.question_count ?? 0,
      educatorName: test?.educators?.name ?? "Educator",
    };
  });

  // Summary stats
  const totalTests = testHistory.length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          testHistory.reduce((sum, t) => {
            const pct = t.totalMarks > 0 ? (t.score / t.totalMarks) * 100 : 0;
            return sum + pct;
          }, 0) / totalTests
        )
      : 0;
  const bestRank =
    totalTests > 0 ? Math.min(...testHistory.map((t) => t.rank || 9999)) : 0;
  const totalCorrect = testHistory.reduce((sum, t) => sum + t.correctCount, 0);

  return (
    <StudentProfileView
      student={{
        name: student.name,
        username: student.username,
        avatarUrl: student.avatar_url,
        joinedAt: student.created_at,
      }}
      stats={{
        totalTests,
        avgScore,
        bestRank: bestRank === 9999 ? 0 : bestRank,
        totalCorrect,
      }}
      testHistory={testHistory}
    />
  );
}
