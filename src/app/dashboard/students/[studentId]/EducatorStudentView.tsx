"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudentInfo = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

type Stats = {
  totalTests: number;
  avgScore: number;
  bestRank: number;
};

type TestHistoryItem = {
  submissionId: string;
  testId: string;
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
  testSubject: string | null;
  questionCount: number;
  isHighlighted: boolean;
};

type Props = {
  student: StudentInfo;
  stats: Stats;
  testHistory: TestHistoryItem[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeSec(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
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
    <span className={cn("text-sm font-bold font-mono px-3 py-1.5 rounded-xl border shrink-0", color)}>
      {score}/{total} <span className="text-[10px] font-semibold">({pct}%)</span>
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function EducatorStudentView({ student, stats, testHistory }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">

      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors mb-6"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4 mb-8"
      >
        <Avatar
          name={student.username}
          imageUrl={student.avatarUrl ?? undefined}
          size="lg"
        />
        <div>
          <h1 className="text-xl font-bold text-text">{student.username}</h1>
          <p className="text-xs text-text-muted mt-1">Student</p>
        </div>
      </motion.div>

      {/* Stats — 3 cols on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { emoji: "📝", label: "Your Tests", value: stats.totalTests },
          { emoji: "📊", label: "Avg Score", value: `${stats.avgScore}%` },
          { emoji: "🏆", label: "Best Rank", value: stats.bestRank > 0 ? `#${stats.bestRank}` : "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center"
          >
            <span className="text-xl sm:text-2xl mb-1 block">{card.emoji}</span>
            <p className="text-lg sm:text-2xl font-bold font-mono text-text leading-none">
              {card.value}
            </p>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mt-1.5 leading-tight">
              {card.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Test History */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text">Tests on Your Platform</h2>
          <span className="text-xs text-text-muted bg-surface-2 border border-border rounded-full px-2.5 py-1">
            {stats.totalTests}
          </span>
        </div>

        {testHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm text-text-secondary">No tests attempted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testHistory.map((t, i) => (
              <motion.div
                key={t.submissionId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: 0.2 + i * 0.05 }}
              >
                <Link
                  href={`/dashboard/students/${student.id}/tests/${t.testId}`}
                  className={cn(
                    "group block bg-surface border rounded-2xl p-4 hover:bg-surface-2/30 transition-all",
                    t.isHighlighted
                      ? "border-primary/50 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors line-clamp-2">
                        {t.testTitle}
                      </p>
                      {t.testSubject && (
                        <p className="text-xs text-text-muted mt-0.5">{t.testSubject}</p>
                      )}
                    </div>
                    <ScorePill score={t.score} total={t.totalMarks} />
                  </div>

                  {/* Stats — 2-col grid on mobile */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      🏆 <span className="text-text-secondary font-semibold">#{t.rank}</span>
                      <span>/ {t.totalParticipants}</span>
                    </span>
                    <span className="font-mono">
                      <span className="text-success">✓{t.correctCount} </span>
                      <span className="text-error">✗{t.wrongCount} </span>
                      <span>—{t.unanswered}</span>
                    </span>
                    <span className="font-mono">⏱ {formatTimeSec(t.timeTakenSec)}</span>
                    <span>{formatDate(t.submittedAt)}</span>
                  </div>

                  {/* CTA */}
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-text-muted">{t.questionCount} questions</span>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      View Q&A
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
    </div>
  );
}
