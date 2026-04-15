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
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
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

function ScoreBadge({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const color =
    pct >= 70
      ? "text-success bg-success/10 border-success/20"
      : pct >= 40
      ? "text-warning bg-warning/10 border-warning/20"
      : "text-error bg-error/10 border-error/20";

  return (
    <span className={cn("text-sm font-bold font-mono px-3 py-1.5 rounded-xl border shrink-0", color)}>
      {score}/{total}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, emoji }: { label: string; value: string | number; sub?: string; emoji: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 text-center">
      <span className="text-2xl mb-1 block">{emoji}</span>
      <p className="text-xl font-bold font-mono text-text leading-none">{value}</p>
      {sub && <p className="text-xs text-text-muted font-mono mt-0.5">{sub}</p>}
      <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1.5">{label}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StudentProfileView({ student, stats, testHistory }: Props) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* ── Profile Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <Avatar
            name={student.name}
            imageUrl={student.avatarUrl ?? undefined}
            size="lg"
          />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-text truncate">{student.username}</h1>
            <p className="text-sm text-text-secondary mt-0.5 truncate">{student.name}</p>
            <p className="text-xs text-text-muted mt-1">Since {formatDate(student.joinedAt)}</p>
          </div>
        </motion.div>

        {/* ── Stats Row — 2×2 grid ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <StatCard emoji="📝" label="Tests Taken" value={stats.totalTests} />
          <StatCard emoji="📊" label="Avg Score" value={`${stats.avgScore}%`} />
          <StatCard emoji="🏆" label="Best Rank" value={stats.bestRank > 0 ? `#${stats.bestRank}` : "—"} />
          <StatCard emoji="✅" label="Total Correct" value={stats.totalCorrect} />
        </motion.div>

        {/* ── Test History ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Test History</h2>
            <span className="text-xs text-text-muted bg-surface-2 border border-border rounded-full px-2.5 py-1">
              {stats.totalTests} {stats.totalTests !== 1 ? "tests" : "test"}
            </span>
          </div>

          {testHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-sm text-text-secondary mb-1">No tests yet</p>
              <p className="text-xs text-text-muted">Attempt a test and your results will appear here.</p>
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
                    className="group block bg-surface border border-border rounded-2xl p-4 hover:border-primary/40 hover:bg-surface-2/30 transition-all"
                  >
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                          {test.testTitle}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          by {test.educatorName}{test.testSubject && ` · ${test.testSubject}`}
                        </p>
                      </div>
                      <ScoreBadge score={test.score} total={test.totalMarks} />
                    </div>

                    {/* Stats — mobile: 2-row wrap */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-4 gap-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        🏆
                        <span className="text-text-secondary font-semibold">#{test.rank}</span>
                        <span>/ {test.totalParticipants}</span>
                      </span>
                      <span className="font-mono">
                        <span className="text-success">✓{test.correctCount} </span>
                        <span className="text-error">✗{test.wrongCount} </span>
                        <span>—{test.unanswered}</span>
                      </span>
                      <span className="font-mono">⏱ {formatTimeSec(test.timeTakenSec)}</span>
                      <span className="text-text-muted">{formatDate(test.submittedAt)}</span>
                    </div>

                    {/* Review CTA */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <span className="text-xs font-semibold text-primary flex items-center gap-1">
                        Review Answers
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
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
