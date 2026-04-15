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
    <span
      className={cn(
        "text-xs font-bold font-mono px-2.5 py-1 rounded-full border",
        color
      )}
    >
      {score}/{total} ({pct}%)
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function EducatorStudentView({ student, stats, testHistory }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors mb-8"
      >
        ← Back to Dashboard
      </Link>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-5 mb-8"
      >
        <Avatar
          name={student.username}
          imageUrl={student.avatarUrl ?? undefined}
          size="lg"
        />
        <div>
          <h1 className="text-xl font-bold text-text">{student.username}</h1>
          <p className="text-xs text-text-muted mt-1">Student profile</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="grid grid-cols-3 gap-3 mb-10"
      >
        {[
          { label: "Tests on Your Platform", value: stats.totalTests },
          { label: "Avg Score", value: `${stats.avgScore}%` },
          {
            label: "Best Rank",
            value: stats.bestRank > 0 ? `#${stats.bestRank}` : "—",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-2xl p-4 text-center"
          >
            <p className="text-2xl font-bold font-mono text-text">
              {card.value}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1.5">
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
          <h2 className="text-base font-semibold text-text">
            Tests on Your Platform
          </h2>
          <span className="text-xs text-text-muted">
            {stats.totalTests} test{stats.totalTests !== 1 ? "s" : ""}
          </span>
        </div>

        {testHistory.length === 0 ? (
          <div className="text-center py-16 text-sm text-text-muted">
            This student hasn&apos;t attempted any of your tests yet.
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
                    "group block bg-surface border rounded-2xl p-5 hover:bg-surface-2/30 transition-all",
                    t.isHighlighted
                      ? "border-primary/50 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors truncate">
                        {t.testTitle}
                      </p>
                      {t.testSubject && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {t.testSubject}
                        </p>
                      )}
                    </div>
                    <ScorePill score={t.score} total={t.totalMarks} />
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                    <span>
                      <span className="text-text-secondary font-semibold">
                        #{t.rank}
                      </span>{" "}
                      / {t.totalParticipants}
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <span className="text-success font-mono">
                      ✓ {t.correctCount}
                    </span>
                    <span className="text-error font-mono">
                      ✗ {t.wrongCount}
                    </span>
                    <span className="font-mono">— {t.unanswered}</span>
                    <span className="w-px h-3 bg-border" />
                    <span className="font-mono">
                      {formatTimeSec(t.timeTakenSec)}
                    </span>
                    <span className="w-px h-3 bg-border" />
                    <span>{formatDate(t.submittedAt)}</span>
                    <span className="ml-auto text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      View Q&A →
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
