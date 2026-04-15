import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EducatorStudentView } from "./EducatorStudentView";

type PageProps = {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ test?: string }>;
};

export default async function EducatorStudentPage({
  params,
  searchParams,
}: PageProps) {
  const { studentId } = await params;
  const { test: highlightTestId } = await searchParams;

  const supabase = await createClient();

  // Must be an educator
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

  // Student public profile
  const { data: studentProfile } = await supabase
    .from("student_public_profiles")
    .select("id, username, avatar_url")
    .eq("id", studentId)
    .single();

  if (!studentProfile) notFound();

  // All submissions this student has made on this educator's tests
  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      `id, score, total_marks, correct_count, wrong_count, unanswered,
       rank, time_taken_sec, submitted_at,
       tests (
         id, title, slug, subject, question_count, total_marks, educator_id
       )`
    )
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false });

  // Keep only tests that belong to this educator
  const educatorSubmissions = (submissions ?? []).filter((s) => {
    const test = s.tests as { educator_id: string } | null;
    return test?.educator_id === user.id;
  });

  // Total participant counts per test
  const testIds = educatorSubmissions
    .map((s) => (s.tests as { id: string } | null)?.id)
    .filter(Boolean) as string[];

  const participantCounts: Record<string, number> = {};
  if (testIds.length > 0) {
    const { data: counts } = await supabase
      .from("submissions")
      .select("test_id")
      .in("test_id", testIds);
    (counts ?? []).forEach((row) => {
      participantCounts[row.test_id] = (participantCounts[row.test_id] ?? 0) + 1;
    });
  }

  const testHistory = educatorSubmissions.map((s) => {
    const test = s.tests as {
      id: string;
      title: string;
      slug: string;
      subject: string | null;
      question_count: number;
      total_marks: number;
    } | null;

    return {
      submissionId: s.id,
      testId: test?.id ?? "",
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
      testSubject: test?.subject ?? null,
      questionCount: test?.question_count ?? 0,
      isHighlighted: test?.id === highlightTestId,
    };
  });

  // Summary
  const totalTests = testHistory.length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          testHistory.reduce(
            (sum, t) =>
              sum +
              (t.totalMarks > 0 ? (t.score / t.totalMarks) * 100 : 0),
            0
          ) / totalTests
        )
      : 0;
  const bestRank =
    totalTests > 0
      ? Math.min(...testHistory.map((t) => t.rank || 9999))
      : 0;

  return (
    <EducatorStudentView
      student={{
        id: studentProfile.id as string,
        username: studentProfile.username as string,
        avatarUrl: studentProfile.avatar_url,
      }}
      stats={{
        totalTests,
        avgScore,
        bestRank: bestRank === 9999 ? 0 : bestRank,
      }}
      testHistory={testHistory}
    />
  );
}
