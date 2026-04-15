"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { RankBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EducatorQuestionStats } from "@/components/review/EducatorQuestionStats";
import type { EducatorQuestionStat } from "@/components/review/EducatorQuestionStats";
import { useState } from "react";

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

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(`${window.location.origin}/t/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-all cursor-pointer min-h-[36px]",
        copied
          ? "text-success bg-success/10 border-success/30"
          : "text-text-secondary bg-surface-2 hover:bg-surface-hover border-border"
      )}
    >
      {copied ? "✓ Copied!" : "Copy Link"}
    </button>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function AnalyticsView({
  test,
  stats,
  studentList,
  scoreDistribution,
  questionStats,
}: Props) {
  const statCards = [
    { label: "Attempts", value: stats.totalAttempts.toLocaleString(), icon: "👥" },
    { label: "Avg Score", value: `${stats.avgScore}/${test.totalMarks}`, icon: "📊" },
    { label: "Avg Time", value: formatTimeSec(stats.avgTimeSec), icon: "⏱" },
    { label: "Done %", value: `${stats.completionRate}%`, icon: "✅" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">

      {/* Back nav */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors mb-6"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text mb-2 leading-tight">{test.title}</h1>
        <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
          <span>Created {formatDate(test.createdAt)}</span>
          <span className="w-px h-3 bg-border" />
          <span>{test.questionCount} questions</span>
          {test.subject && (
            <>
              <span className="w-px h-3 bg-border" />
              <span>{test.subject}</span>
            </>
          )}
        </div>
        <div className="mt-3">
          <CopyLinkButton slug={test.slug} />
        </div>
      </div>

      {/* Stats cards — 2×2 on mobile, 4 across on desktop */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4">
            <span className="text-2xl mb-1 block">{stat.icon}</span>
            <p className="text-xl sm:text-2xl font-bold font-mono text-text leading-none mb-1">
              {stat.value}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
          </Card>
        ))}
      </motion.div>

      {/* Score Distribution */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-sm font-semibold text-text mb-3">Score Distribution</h2>
        <Card className="p-4">
          {stats.totalAttempts === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No submissions yet</p>
          ) : (
            <div className="space-y-3">
              {scoreDistribution.map((bucket) => (
                <div key={bucket.range} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted font-mono w-14 sm:w-16 shrink-0">
                    {bucket.range}
                  </span>
                  <div className="flex-1 h-4 bg-bg rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${bucket.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary font-mono w-14 sm:w-20 text-right shrink-0">
                    {bucket.count} ({bucket.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Student List — scrollable table on mobile */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">
            Students
          </h2>
          <span className="text-xs text-text-muted">
            {stats.totalAttempts.toLocaleString()} submitted
          </span>
        </div>

        <Card className="p-0 overflow-hidden">
          {/* Horizontal scroll wrapper */}
          <div className="overflow-x-auto">
            {/* Max height + vertical scroll for long lists */}
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="sticky top-0 z-10 bg-surface border-b border-border">
                  <tr>
                    <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-4 py-3 font-semibold w-12">#</th>
                    <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-3 py-3 font-semibold">Student</th>
                    <th className="text-right text-[10px] text-text-muted uppercase tracking-wider px-3 py-3 font-semibold w-20">Score</th>
                    <th className="text-right text-[10px] text-text-muted uppercase tracking-wider px-3 py-3 font-semibold w-16">Time</th>
                    <th className="text-right text-[10px] text-text-muted uppercase tracking-wider px-4 py-3 font-semibold w-20">R/W/—</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">
                        No submissions yet
                      </td>
                    </tr>
                  ) : (
                    studentList.map((student) => (
                      <tr key={student.submissionId} className="group border-b border-border/40 last:border-0 hover:bg-surface-2/50 transition-colors">
                        <td className="px-4 py-3">
                          <RankBadge rank={student.rank} />
                        </td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/dashboard/students/${student.studentId}?test=${test.id}`}
                            className="flex items-center gap-2.5 group-hover:text-primary transition-colors"
                          >
                            <Avatar
                              name={student.username}
                              imageUrl={student.avatarUrl ?? undefined}
                              size="sm"
                            />
                            <span className="text-sm text-text font-medium">{student.username}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-sm font-mono text-text-secondary">
                            {student.score}/{test.totalMarks}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-text-muted">
                            {formatTimeSec(student.timeTakenSec)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs font-mono">
                            <span className="text-success">{student.correctCount}</span>
                            <span className="text-text-muted">/</span>
                            <span className="text-error">{student.wrongCount}</span>
                            <span className="text-text-muted">/{student.unanswered}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Question Analytics */}
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
