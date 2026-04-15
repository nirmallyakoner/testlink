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

export function ResultView({ result, leaderboard, reviewQuestions }: Props) {
  return (
    <div className="min-h-screen bg-bg relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Profile link — top-right */}
        <div className="flex justify-end mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text bg-surface border border-border px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>👤</span> My Profile
          </Link>
        </div>
        {/* Test info */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs text-text-muted mb-1">{result.educator}</p>
          <p className="text-sm text-text-secondary">{result.testTitle}</p>
          {result.isCreator && (
            <span className="mt-2 inline-block text-[10px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Creator Result
            </span>
          )}
        </motion.div>

        {/* Rank reveal */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          <p className="text-sm text-text-secondary mb-2">You ranked</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-7xl sm:text-8xl font-black font-mono gradient-text leading-none">
              #<AnimatedCounter value={result.rank} />
            </span>
          </div>
          <p className="text-sm text-text-muted mt-3">
            out of {result.totalStudents.toLocaleString()} student
            {result.totalStudents !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Score summary */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className="text-lg font-bold font-mono text-text">
              {result.score}/{result.totalMarks}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
              Score
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className="text-lg font-bold font-mono text-text">
              {formatTimeSec(result.timeTakenSec)}
            </p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
              Time
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-success text-sm font-mono font-bold">
                {result.correctCount}
              </span>
              <span className="text-error text-sm font-mono font-bold">
                {result.wrongCount}
              </span>
              <span className="text-text-muted text-sm font-mono font-bold">
                {result.unanswered}
              </span>
            </div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
              R / W / Skip
            </p>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">All Students</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-live" />
              Live
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {leaderboard.map((student, i) => (
              <div key={`${student.rank}-${i}`}>
                {/* Gap separator */}
                {i > 0 &&
                  (leaderboard[i - 1].rank !== student.rank - 1) && (
                    <div className="flex items-center justify-center py-2 text-xs text-text-muted">
                      <span className="w-12 h-px bg-border" />
                      <span className="mx-3">...</span>
                      <span className="w-12 h-px bg-border" />
                    </div>
                  )}
                <div
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 transition-colors",
                    student.isYou && "bg-primary/5 border-l-2 border-l-primary"
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
                      "flex-1 text-sm",
                      student.isYou
                        ? "text-text font-semibold"
                        : "text-text-secondary"
                    )}
                  >
                    {student.username}
                    {student.isYou && (
                      <span className="ml-2 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                    {student.is_creator && !student.isYou && (
                      <span className="ml-2 text-[10px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                        Creator
                      </span>
                    )}
                  </span>

                  <span className="text-sm font-mono text-text-secondary">
                    {student.score}/{result.totalMarks}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    {formatTimeSec(student.time_taken_sec)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Review Answers section */}
        {reviewQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-10"
          >
            {/* Divider */}
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
        <div className="text-center mt-12">
          <p className="text-xs text-text-muted">
            Powered by{" "}
            <Link
              href="/"
              className="text-text-secondary hover:text-text transition-colors"
            >
              TestLink
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
