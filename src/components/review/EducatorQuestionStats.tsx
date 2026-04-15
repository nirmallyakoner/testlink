"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EducatorQuestionStat = {
  order_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct: string; // 'a' | 'b' | 'c' | 'd'
  // Aggregate counts (no per-student explanation exposed)
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  total_attempts: number;
  // Per-option selection counts
  option_counts: Record<string, number>;
};

const LABELS: Record<string, string> = { a: "A", b: "B", c: "C", d: "D" };

// ─── Difficulty badge ────────────────────────────────────────────────────────

function DifficultyBadge({ pct }: { pct: number }) {
  if (pct >= 70)
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-success">
        Easy
      </span>
    );
  if (pct >= 40)
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning">
        Medium
      </span>
    );
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error/10 border border-error/20 text-error">
      Hard
    </span>
  );
}

// ─── Option bar ───────────────────────────────────────────────────────────────

function OptionBar({
  letter,
  text,
  count,
  total,
  isCorrect,
}: {
  letter: string;
  text: string;
  count: number;
  total: number;
  isCorrect: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold",
              isCorrect
                ? "bg-success text-white"
                : "bg-surface-2 text-text-muted"
            )}
          >
            {LABELS[letter]}
          </span>
          <span className="text-xs text-text-secondary truncate">{text}</span>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs font-mono font-semibold",
            isCorrect ? "text-success" : "text-text-muted"
          )}
        >
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isCorrect ? "bg-success" : "bg-border"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function EducatorQuestionCard({
  q,
  index,
}: {
  q: EducatorQuestionStat;
  index: number;
}) {
  const correctPct =
    q.total_attempts > 0
      ? Math.round((q.correct_count / q.total_attempts) * 100)
      : 0;
  const wrongPct =
    q.total_attempts > 0
      ? Math.round((q.wrong_count / q.total_attempts) * 100)
      : 0;
  const skippedPct =
    q.total_attempts > 0
      ? Math.round((q.skipped_count / q.total_attempts) * 100)
      : 0;

  const options: [string, string | null][] = [
    ["a", q.option_a],
    ["b", q.option_b],
    ["c", q.option_c],
    ["d", q.option_d],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-surface border border-border rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs font-bold text-text-muted">
            {q.order_index}
          </span>
          <p className="text-sm text-text font-medium leading-relaxed">
            {q.question_text}
          </p>
        </div>
        <DifficultyBadge pct={correctPct} />
      </div>

      {/* Mini stat row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-success/8 border border-success/15 rounded-xl py-2 px-3">
          <p className="text-lg font-bold font-mono text-success">{correctPct}%</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
            Got it right
          </p>
        </div>
        <div className="bg-error/8 border border-error/15 rounded-xl py-2 px-3">
          <p className="text-lg font-bold font-mono text-error">{wrongPct}%</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
            Got it wrong
          </p>
        </div>
        <div className="bg-surface-2 border border-border rounded-xl py-2 px-3">
          <p className="text-lg font-bold font-mono text-text-muted">
            {skippedPct}%
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
            Skipped
          </p>
        </div>
      </div>

      {/* Option distribution bars */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
          Answer distribution
        </p>
        {options.map(([letter, text]) => {
          if (!text) return null;
          return (
            <OptionBar
              key={letter}
              letter={letter}
              text={text}
              count={q.option_counts[letter] ?? 0}
              total={q.total_attempts}
              isCorrect={letter === q.correct}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EducatorQuestionStats({
  questions,
}: {
  questions: EducatorQuestionStat[];
}) {
  if (questions.length === 0) {
    return (
      <p className="text-sm text-text-muted text-center py-10">
        No attempts yet — question stats will appear once students submit.
      </p>
    );
  }

  // Sort: hardest first (lowest correct %)
  const sorted = [...questions].sort((a, b) => {
    const aPct = a.total_attempts > 0 ? a.correct_count / a.total_attempts : 1;
    const bPct = b.total_attempts > 0 ? b.correct_count / b.total_attempts : 1;
    return aPct - bPct;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-text">Question Analysis</h2>
        <span className="text-xs text-text-muted">Sorted by difficulty · hardest first</span>
      </div>
      <div className="space-y-4">
        {sorted.map((q, i) => (
          <EducatorQuestionCard key={q.order_index} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}
