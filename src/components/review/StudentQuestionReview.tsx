"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type ReviewQuestion = {
  order_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct: string; // 'a' | 'b' | 'c' | 'd'
  explanation: string | null;
  chosen_option: string | null; // null = skipped
  is_correct: boolean;
};

type FilterTab = "all" | "wrong" | "correct" | "skipped";

const LABELS: Record<string, string> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
};

function OptionPill({
  letter,
  text,
  isChosen,
  isCorrect,
  correctLetter,
  skipped,
}: {
  letter: string;
  text: string;
  isChosen: boolean;
  isCorrect: boolean;
  correctLetter: string;
  skipped: boolean;
}) {
  const isTheCorrect = letter === correctLetter;

  let variant: "correct" | "wrong" | "highlight" | "default" = "default";
  if (isChosen && isCorrect) variant = "correct";
  else if (isChosen && !isCorrect) variant = "wrong";
  else if (!isChosen && isTheCorrect && !skipped) variant = "highlight"; // show correct when student got it wrong

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 border text-sm transition-colors",
        variant === "correct" &&
          "bg-success/10 border-success/40 text-success",
        variant === "wrong" && "bg-error/10 border-error/40 text-error",
        variant === "highlight" &&
          "bg-success/5 border-success/25 text-success/80",
        variant === "default" &&
          "bg-surface border-border text-text-secondary"
      )}
    >
      <span
        className={cn(
          "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
          variant === "correct" && "bg-success text-white",
          variant === "wrong" && "bg-error text-white",
          variant === "highlight" && "bg-success/20 text-success",
          variant === "default" && "bg-surface-2 text-text-muted"
        )}
      >
        {LABELS[letter]}
      </span>
      <span className="flex-1 leading-relaxed">{text}</span>
      {variant === "correct" && (
        <span className="shrink-0 text-success text-base">✓</span>
      )}
      {variant === "wrong" && (
        <span className="shrink-0 text-error text-base">✗</span>
      )}
      {variant === "highlight" && (
        <span className="shrink-0 text-success/70 text-xs font-semibold">
          Correct
        </span>
      )}
    </div>
  );
}

function QuestionCard({
  q,
  index,
}: {
  q: ReviewQuestion;
  index: number;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const skipped = q.chosen_option === null;

  const statusColor = q.is_correct
    ? "text-success bg-success/10 border-success/20"
    : skipped
    ? "text-text-muted bg-surface border-border"
    : "text-error bg-error/10 border-error/20";

  const statusLabel = q.is_correct ? "Correct" : skipped ? "Skipped" : "Wrong";

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
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs font-bold text-text-muted">
            {q.order_index}
          </span>
          <p className="text-sm text-text leading-relaxed font-medium">
            {q.question_text}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
            statusColor
          )}
        >
          {statusLabel}
        </span>
      </div>

      {/* Options */}
      <div className="px-5 pb-4 space-y-2">
        {options.map(([letter, text]) => {
          if (!text) return null;
          return (
            <OptionPill
              key={letter}
              letter={letter}
              text={text}
              isChosen={q.chosen_option === letter}
              isCorrect={q.is_correct}
              correctLetter={q.correct}
              skipped={skipped}
            />
          );
        })}
      </div>

      {/* Explanation toggle (student-only feature) */}
      {q.explanation && !q.is_correct && (
        <div className="border-t border-border px-5 py-3">
          <button
            onClick={() => setShowExplanation((v) => !v)}
            className="flex items-center gap-2 text-xs text-primary hover:text-primary-light transition-colors font-medium"
          >
            <span className="w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center text-[10px]">
              {showExplanation ? "−" : "?"}
            </span>
            {showExplanation ? "Hide explanation" : "Why is this wrong?"}
          </button>
          <AnimatePresence>
            {showExplanation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 text-xs text-text-secondary leading-relaxed bg-primary/5 border border-primary/10 rounded-xl px-4 py-3"
              >
                {q.explanation}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "wrong", label: "Wrong" },
  { key: "correct", label: "Correct" },
  { key: "skipped", label: "Skipped" },
];

export function StudentQuestionReview({
  questions,
}: {
  questions: ReviewQuestion[];
}) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const counts = {
    all: questions.length,
    correct: questions.filter((q) => q.is_correct).length,
    wrong: questions.filter((q) => !q.is_correct && q.chosen_option !== null)
      .length,
    skipped: questions.filter((q) => q.chosen_option === null).length,
  };

  const filtered = questions.filter((q) => {
    if (filter === "correct") return q.is_correct;
    if (filter === "wrong") return !q.is_correct && q.chosen_option !== null;
    if (filter === "skipped") return q.chosen_option === null;
    return true;
  });

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-text">Review Answers</h2>
        <span className="text-xs text-text-muted">
          {counts.correct} correct · {counts.wrong} wrong · {counts.skipped} skipped
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-5 p-1 bg-surface border border-border rounded-xl w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === tab.key
                ? "bg-primary text-white shadow-sm"
                : "text-text-muted hover:text-text"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-1.5 text-[10px] font-bold",
                filter === tab.key ? "text-white/70" : "text-text-muted"
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Question cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-muted">
            No questions in this category
          </div>
        ) : (
          filtered.map((q, i) => (
            <QuestionCard key={q.order_index} q={q} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
