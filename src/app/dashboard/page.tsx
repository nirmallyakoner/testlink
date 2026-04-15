import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { TestList } from "./TestList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch ALL tests (drafts + published) — no is_published filter
  const { data: tests } = await supabase
    .from("tests")
    .select(
      "id, title, slug, subject, question_count, total_marks, created_at, is_published"
    )
    .eq("educator_id", user!.id)
    .order("created_at", { ascending: false });

  // Fetch submission counts
  const testsWithCounts = await Promise.all(
    (tests ?? []).map(async (test) => {
      const { count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("test_id", test.id);
      return { ...test, attempts: count ?? 0 };
    })
  );

  const liveCount = testsWithCounts.filter((t) => t.is_published).length;
  const draftCount = testsWithCounts.filter((t) => !t.is_published).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Your Tests</h1>
          <p className="text-sm text-text-secondary mt-1">
            {liveCount} live{draftCount > 0 && <span className="text-warning"> · {draftCount} draft{draftCount !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button size="md">+ Create Test</Button>
        </Link>
      </div>

      {/* Empty state */}
      {testsWithCounts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-black text-primary font-display">
              T
            </span>
          </div>
          <h2 className="text-lg font-semibold text-text mb-2">
            No tests yet
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Create your first test and share it with your students.
          </p>
          <Link href="/dashboard/create">
            <Button>Create First Test</Button>
          </Link>
        </div>
      ) : (
        <TestList tests={testsWithCounts} />
      )}
    </div>
  );
}
