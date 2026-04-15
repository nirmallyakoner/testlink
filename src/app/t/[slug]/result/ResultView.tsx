"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { RankBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { StudentQuestionReview } from "@/components/review/StudentQuestionReview";
import type { ReviewQuestion } from "@/components/review/StudentQuestionReview";

type ResultData = {
  testTitle: string;
  educator: string;
  score: number;
  totalMarks: number;
  rank: number;
  totalStudents: number;
  correctCount: number;
  wrongCount: number;
  unanswered: number;
  timeTakenSec: number;
  isCreator: boolean;
};

type LeaderboardEntry = {
  rank: number;
  username: string;
  avatar_url: string | null;
  score: number;
  time_taken_sec: number;
  isYou: boolean;
  is_creator: boolean;
};

type Props = {
  result: ResultData;
  leaderboard: LeaderboardEntry[];
  reviewQuestions: ReviewQuestion[];
};

function formatTimeSec(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function AnimatedCounter({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 100 }}
    >
      {value}
    </motion.span>
  );
}

function ScoreBar({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const color = pct >= 70 ? "from-success to-success/70" : pct >= 40 ? "from-warning to-warning/70" : "from-error to-error/70";
  return (
    <div className="w-full h-2 bg-bg rounded-full overflow-hidden mt-3">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay: 0.6 }}
      />
    </div>
  );
}

export function ResultView({ result, leaderboard, reviewQuestions }: Props) {
  const pct = result.totalMarks > 0 ? Math.round((result.score / result.totalMarks) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Top actions */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-text-muted">
            {result.educator}
          </span>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface border border-border px-3 py-2 rounded-xl transition-colors min-h-[36px]"
          >
            <span>👤</span> My Profile
          </Link>
        </div>

        {/* Test info */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-semibold text-text">{result.testTitle}</p>
          {result.isCreator && (
            <span className="mt-2 inline-block text-[10px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Creator Result
            </span>
          )}
        </motion.div>

        {/* Rank */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          <p className="text-xs text-text-secondary uppercase tracking-widest mb-2">You ranked</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-7xl sm:text-8xl font-black font-mono gradient-text leading-none">
              #<AnimatedCounter value={result.rank} />
            </span>
          </div>
          <p className="text-sm text-text-muted mt-2">
            out of {result.totalStudents.toLocaleString()} student{result.totalStudents !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Score summary — 3-col */}
        <motion.div
          className="grid grid-cols-3 gap-2 sm:gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-base sm:text-lg font-bold font-mono text-text">
              {result.score}/{result.totalMarks}
            </p>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mt-1">Score</p>
            <p className="text-xs font-semibold mt-1" style={{ color: pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--error)" }}>
              {pct}%
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-base sm:text-lg font-bold font-mono text-text">
              {formatTimeSec(result.timeTakenSec)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mt-1">Time</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-success text-sm font-bold font-mono">{result.correctCount}</span>
              <span className="text-text-muted text-xs">/</span>
              <span className="text-error text-sm font-bold font-mono">{result.wrongCount}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mt-1">R / W</p>
          </div>
        </motion.div>

        {/* Score bar */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <ScoreBar score={result.score} total={result.totalMarks} />
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Leaderboard</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-live" />
              Live
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* Scrollable max-height for long leaderboards */}
            <div className="max-h-[360px] overflow-y-auto">
              {leaderboard.map((student, i) => (
                <div key={`${student.rank}-${i}`}>
                  {i > 0 && leaderboard[i - 1].rank !== student.rank - 1 && (
                    <div className="flex items-center justify-center py-2 text-xs text-text-muted">
                      <span className="w-10 h-px bg-border" />
                      <span className="mx-3">···</span>
                      <span className="w-10 h-px bg-border" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 border-b border-border/40 last:border-0 transition-colors",
                      student.isYou && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                  >
                    <RankBadge rank={student.rank} />

                    <Avatar
                      name={student.username}
                      imageUrl={student.avatar_url ?? undefined}
                      size="sm"
                    />

                    <span
                      className={cn(
                        "flex-1 text-sm min-w-0 truncate",
                        student.isYou ? "text-text font-semibold" : "text-text-secondary"
                      )}
                    >
                      {student.username}
                      {student.isYou && (
                        <span className="ml-2 text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">You</span>
                      )}
                      {student.is_creator && !student.isYou && (
                        <span className="ml-2 text-[9px] font-bold text-text-muted bg-surface-2 px-1.5 py-0.5 rounded-full">Creator</span>
                      )}
                    </span>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono text-text-secondary">{student.score}/{result.totalMarks}</p>
                      <p className="text-[10px] text-text-muted font-mono">{formatTimeSec(student.time_taken_sec)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Review Answers */}
        {reviewQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted uppercase tracking-widest font-semibold">
                Your Answer Review
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <StudentQuestionReview questions={reviewQuestions} />
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 mb-4">
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
