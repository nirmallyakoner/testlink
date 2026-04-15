"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentInfo = {
  name: string;
  username: string;
  avatarUrl: string | null;
  joinedAt: string;
};

type Stats = {
  totalTests: number;
  avgScore: number;
  bestRank: number;
  totalCorrect: number;
};

type TestHistoryItem = {
  submissionId: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unanswered: number;
  rank: number;
  timeTakenSec: number;
  submittedAt: string;
  totalParticipants: number;
  testTitle: string;
  testSlug: string;
  testSubject: string | null;
  questionCount: number;
  educatorName: string;
};

type Props = {
  student: StudentInfo;
  stats: Stats;
  testHistory: TestHistoryItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeSec(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ScorePill({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const color =
    pct >= 70
      ? "text-success bg-success/10 border-success/20"
      : pct >= 40
      ? "text-warning bg-warning/10 border-warning/20"
      : "text-error bg-error/10 border-error/20";

  return (
    <span
      className={cn(
        "text-xs font-bold font-mono px-2.5 py-1 rounded-full border",
        color
      )}
    >
      {score}/{total}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold font-mono text-text">{value}</p>
      {sub && (
        <p className="text-xs text-text-muted font-mono mt-0.5">{sub}</p>
      )}
      <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1.5">
        {label}
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StudentProfileView({ student, stats, testHistory }: Props) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* ── Profile Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-5 mb-8"
        >
          <Avatar
            name={student.name}
            imageUrl={student.avatarUrl ?? undefined}
            size="lg"
          />
          <div>
            <h1 className="text-xl font-bold text-text">{student.username}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{student.name}</p>
            <p className="text-xs text-text-muted mt-1">
              Member since {formatDate(student.joinedAt)}
            </p>
          </div>
        </motion.div>

        {/* ── Stats Row ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          <StatCard label="Tests Taken" value={stats.totalTests} />
          <StatCard label="Avg Score" value={`${stats.avgScore}%`} />
          <StatCard
            label="Best Rank"
            value={stats.bestRank > 0 ? `#${stats.bestRank}` : "—"}
          />
          <StatCard label="Total Correct" value={stats.totalCorrect} />
        </motion.div>

        {/* ── Test History ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Test History</h2>
            <span className="text-xs text-text-muted">
              {stats.totalTests} test{stats.totalTests !== 1 ? "s" : ""}
            </span>
          </div>

          {testHistory.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-sm text-text-secondary mb-2">No tests yet</p>
              <p className="text-xs text-text-muted">
                Attempt a test and your results will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {testHistory.map((test, i) => (
                <motion.div
                  key={test.submissionId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                >
                  <Link
                    href={`/profile/tests/${test.submissionId}`}
                    className="group block bg-surface border border-border rounded-2xl p-5 hover:border-primary/40 hover:bg-surface-2/30 transition-all"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors truncate">
                          {test.testTitle}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          by {test.educatorName}
                          {test.testSubject && ` · ${test.testSubject}`}
                        </p>
                      </div>
                      <ScorePill score={test.score} total={test.totalMarks} />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <span className="text-text-secondary font-semibold">
                          #{test.rank}
                        </span>
                        <span>/ {test.totalParticipants}</span>
                      </span>
                      <span className="w-px h-3 bg-border" />
                      <span className="text-success font-mono">
                        ✓ {test.correctCount}
                      </span>
                      <span className="text-error font-mono">
                        ✗ {test.wrongCount}
                      </span>
                      <span className="font-mono">
                        — {test.unanswered}
                      </span>
                      <span className="w-px h-3 bg-border" />
                      <span className="font-mono">
                        {formatTimeSec(test.timeTakenSec)}
                      </span>
                      <span className="w-px h-3 bg-border" />
                      <span>{formatDate(test.submittedAt)}</span>
                      <span className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Review →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

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
