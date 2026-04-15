"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { RankBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EducatorQuestionStats } from "@/components/review/EducatorQuestionStats";
import type { EducatorQuestionStat } from "@/components/review/EducatorQuestionStats";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestInfo = {
  id: string;
  title: string;
  slug: string;
  subject: string | null;
  questionCount: number;
  totalMarks: number;
  createdAt: string;
};

type Stats = {
  totalAttempts: number;
  avgScore: number;
  avgTimeSec: number;
  completionRate: number;
};

type StudentRow = {
  submissionId: string;
  studentId: string;
  username: string;
  avatarUrl: string | null;
  rank: number;
  score: number;
  timeTakenSec: number;
  correctCount: number;
  wrongCount: number;
  unanswered: number;
  submittedAt: string;
};

type ScoreBucket = {
  range: string;
  count: number;
  percentage: number;
};

type Props = {
  test: TestInfo;
  stats: Stats;
  studentList: StudentRow[];
  scoreDistribution: ScoreBucket[];
  questionStats: EducatorQuestionStat[];
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

// ─── Main component ───────────────────────────────────────────────────────────

export function AnalyticsView({
  test,
  stats,
  studentList,
  scoreDistribution,
  questionStats,
}: Props) {
  const statCards = [
    { label: "Total Attempts", value: stats.totalAttempts.toLocaleString() },
    {
      label: "Avg Score",
      value: `${stats.avgScore}/${test.totalMarks}`,
    },
    { label: "Avg Time", value: formatTimeSec(stats.avgTimeSec) },
    { label: "Completion Rate", value: `${stats.completionRate}%` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Back nav */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors mb-8"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">{test.title}</h1>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>Created {formatDate(test.createdAt)}</span>
          <span>{test.questionCount} questions</span>
          {test.subject && <span>{test.subject}</span>}
          <button
            className="text-primary hover:text-primary-light transition-colors"
            onClick={() =>
              navigator.clipboard.writeText(`testlink.in/t/${test.slug}`)
            }
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-2xl font-bold font-mono text-text mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
          </Card>
        ))}
      </motion.div>

      {/* Score Distribution */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-base font-semibold text-text mb-4">
          Score Distribution
        </h2>
        <Card>
          {stats.totalAttempts === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">
              No submissions yet
            </p>
          ) : (
            <div className="space-y-3">
              {scoreDistribution.map((bucket) => (
                <div key={bucket.range} className="flex items-center gap-4">
                  <span className="text-xs text-text-muted font-mono w-16 shrink-0">
                    {bucket.range}
                  </span>
                  <div className="flex-1 h-5 bg-bg rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${bucket.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary font-mono w-16 text-right">
                    {bucket.count} ({bucket.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Student List */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text">
            Students Who Took This Test
          </h2>
          <span className="text-xs text-text-muted">
            {stats.totalAttempts.toLocaleString()} students
          </span>
        </div>

        <Card className="p-0 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[60px_1fr_80px_80px_80px] px-5 py-3 border-b border-border text-xs text-text-muted uppercase tracking-wider">
            <span>Rank</span>
            <span>Student</span>
            <span className="text-right">Score</span>
            <span className="text-right">Time</span>
            <span className="text-right">R/W/—</span>
          </div>

          {studentList.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-text-muted">
              No submissions yet
            </div>
          ) : (
            studentList.map((student) => (
              <Link
                key={student.submissionId}
                href={`/dashboard/students/${student.studentId}?test=${test.id}`}
                className="grid grid-cols-[60px_1fr_80px_80px_80px] items-center px-5 py-3 border-b border-border/50 last:border-0 hover:bg-surface-2/50 transition-colors group"
              >
                <RankBadge rank={student.rank} />

                <div className="flex items-center gap-3">
                  <Avatar
                    name={student.username}
                    imageUrl={student.avatarUrl ?? undefined}
                    size="sm"
                  />
                  <span className="text-sm text-text group-hover:text-primary transition-colors">
                    {student.username}
                  </span>
                </div>

                <span className="text-sm font-mono text-text-secondary text-right">
                  {student.score}/{test.totalMarks}
                </span>
                <span className="text-xs font-mono text-text-muted text-right">
                  {formatTimeSec(student.timeTakenSec)}
                </span>
                <span className="text-xs font-mono text-right">
                  <span className="text-success">{student.correctCount}</span>
                  <span className="text-text-muted">/</span>
                  <span className="text-error">{student.wrongCount}</span>
                  <span className="text-text-muted">/{student.unanswered}</span>
                </span>
              </Link>
            ))
          )}
        </Card>
      </motion.div>

      {/* Question Analytics — Educator view (no explanations) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <EducatorQuestionStats questions={questionStats} />
      </motion.div>
    </div>
  );
}
