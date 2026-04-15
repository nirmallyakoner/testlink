"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Step = "paste" | "preview" | "published";

type ParsedQuestion = {
  id?: string ; // temp client-side id from mock; API questions won't have this
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct: "a" | "b" | "c" | "d" | null;
  marks: number;
  explanation: string | null;
  flagged?: boolean;
};

// Demo questions shown when educator hits "Skip"
const DEMO_QUESTIONS: ParsedQuestion[] = [
  {
    question_text: "What is the normal range of hemoglobin in adult males?",
    option_a: "11-13 g/dL",
    option_b: "13-17 g/dL",
    option_c: "17-20 g/dL",
    option_d: "8-11 g/dL",
    correct: "b",
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Which of the following is NOT a function of the liver?",
    option_a: "Bile production",
    option_b: "Glycogen storage",
    option_c: "Insulin secretion",
    option_d: "Detoxification",
    correct: "c",
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Normal respiratory rate in adults is:",
    option_a: "8-12 breaths/min",
    option_b: "12-20 breaths/min",
    option_c: "20-30 breaths/min",
    option_d: "30-40 breaths/min",
    correct: "b",
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Which cranial nerve is responsible for the sense of smell?",
    option_a: "Olfactory nerve (CN I)",
    option_b: "Optic nerve (CN II)",
    option_c: "Trigeminal nerve (CN V)",
    option_d: "Facial nerve (CN VII)",
    correct: "a",
    marks: 1,
    explanation: null,
  },
  {
    question_text: "The normal blood pH range is:",
    option_a: "7.25-7.30",
    option_b: "7.35-7.45",
    option_c: "7.45-7.55",
    option_d: "7.55-7.65",
    correct: null, // Needs answer — flagged for educator to fix
    marks: 1,
    explanation: null,
    flagged: true,
  },
];

export default function CreateTestPage() {
  const [step, setStep] = useState<Step>("paste");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Parse: call /api/parse-questions with the educator's raw text ────────────
  const handleParse = async (useDemo = false) => {
    setIsLoading(true);
    setParseError(null);
    setParseWarnings([]);

    if (useDemo) {
      setTimeout(() => {
        setQuestions(DEMO_QUESTIONS);
        setTitle("NORCET Mock Test - Demo");
        setIsLoading(false);
        setStep("preview");
      }, 800);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/parse-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ raw_text: rawText }),
      });

      const data = await response.json();

      if (!response.ok) {
        setParseError(data.error || "Failed to parse questions.");
        setIsLoading(false);
        return;
      }

      setQuestions(data.questions ?? []);
      setParseWarnings(data.parse_warnings ?? []);
      setIsLoading(false);
      setStep("preview");
    } catch {
      setParseError("Network error — please check your connection.");
      setIsLoading(false);
    }
  };

  // ── Publish: call /api/tests to save test + questions ────────────────────────
  const handlePublish = async () => {
    if (!title.trim() || questions.some((q) => !q.correct)) return;
    setIsPublishing(true);
    setPublishError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          title,
          questions: questions.map((q) => ({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c ?? null,
            option_d: q.option_d ?? null,
            correct: q.correct,
            marks: q.marks ?? 1,
            explanation: q.explanation ?? null,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPublishError(data.error || "Failed to publish test.");
        setIsPublishing(false);
        return;
      }

      setPublishedSlug(data.slug);
      setStep("published");
      setIsPublishing(false);
    } catch {
      setPublishError("Network error — please check your connection.");
      setIsPublishing(false);
    }
  };

  const handleSelectAnswer = (
    index: number,
    answer: "a" | "b" | "c" | "d"
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, correct: answer, flagged: false } : q
      )
    );
  };

  const handleCopyLink = () => {
    if (!publishedSlug) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/t/${publishedSlug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allAnswered = questions.length > 0 && questions.every((q) => q.correct !== null);
  const shareUrl = publishedSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/t/${publishedSlug}`
    : "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <AnimatePresence mode="wait">
        {/* STEP 1: PASTE */}
        {step === "paste" && (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-text mb-2">
              Create a New Test
            </h1>
            <p className="text-sm text-text-secondary mb-8">
              Paste your questions below in any format. Our AI will structure
              them into a clean test.
            </p>

            <div className="mb-4">
              <textarea
                className="w-full h-72 bg-surface-2 border border-border rounded-xl px-5 py-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none font-mono leading-relaxed"
                placeholder={`Paste your questions here — any format works.\n\nExample:\n1) What is the normal hemoglobin range in males?\na) 11-13 g/dL  b) 13-17 g/dL  c) 17-20 g/dL  d) 8-11 g/dL\nAnswer: b\n\n2) Which organ produces insulin?\na) Liver  b) Pancreas  c) Kidney  d) Heart\nans: b`}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            {parseError && (
              <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {parseError}
              </p>
            )}

            {/* Format hint */}
            <details className="mb-6">
              <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                Supported formats
              </summary>
              <div className="mt-2 p-4 bg-surface border border-border rounded-lg text-xs text-text-muted font-mono leading-relaxed">
                <p className="mb-2 text-text-secondary font-sans font-medium">
                  Any of these formats work:
                </p>
                <p>Q: Question text? A) opt1 B) opt2 C) opt3 D) opt4 ANS: B</p>
                <p>1) question a-opt1 b.opt2 c opt3 d opt4 ans b</p>
                <p>3. Question text: a. opt1 b. opt2 c. opt3 d. opt4 Ans: a</p>
              </div>
            </details>

            <Button
              size="lg"
              className="w-full"
              disabled={rawText.trim().length < 20 || isLoading}
              onClick={() => handleParse(false)}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Parsing with AI...
                </span>
              ) : (
                "Parse Questions"
              )}
            </Button>

            <button
              className="w-full mt-3 text-xs text-text-muted hover:text-text-secondary transition-colors py-2 cursor-pointer"
              onClick={() => handleParse(true)}
            >
              Skip — load demo questions
            </button>
          </motion.div>
        )}

        {/* STEP 2: PREVIEW */}
        {step === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text mb-1">
                  Review Questions
                </h1>
                <p className="text-sm text-text-secondary">
                  {questions.length} questions found
                  {!allAnswered && (
                    <span className="text-warning ml-2">
                      — {questions.filter((q) => !q.correct).length} need
                      correct answers
                    </span>
                  )}
                </p>
              </div>
              <button
                className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                onClick={() => setStep("paste")}
              >
                Re-paste
              </button>
            </div>

            {parseWarnings.length > 0 && (
              <div className="mb-4 p-3 bg-warning/8 border border-warning/20 rounded-lg">
                <p className="text-xs font-semibold text-warning mb-1">
                  Parse warnings:
                </p>
                {parseWarnings.map((w, i) => (
                  <p key={i} className="text-xs text-warning/80">
                    · {w}
                  </p>
                ))}
              </div>
            )}

            {/* Title input */}
            <div className="mb-6">
              <Input
                label="Test Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., NORCET Mock Test - October"
              />
            </div>

            {/* Question list */}
            <div className="space-y-4 mb-8">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-text-muted bg-surface-2 px-2 py-1 rounded shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-text leading-relaxed">
                      {q.question_text}
                    </p>
                    {q.flagged && !q.correct && (
                      <span className="shrink-0 text-[10px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                        Needs answer
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                    {(["a", "b", "c", "d"] as const).map((opt) => {
                      const key = `option_${opt}` as keyof ParsedQuestion;
                      const optionText = q[key] as string | null;
                      if (!optionText) return null;
                      const isCorrect = q.correct === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(i, opt)}
                          className={`text-left text-sm px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                            isCorrect
                              ? "border-success/40 bg-success/8 text-success"
                              : "border-border bg-surface-2 text-text-secondary hover:border-border-hover"
                          }`}
                        >
                          <span className="font-semibold uppercase mr-2 text-xs">
                            {opt}.
                          </span>
                          {optionText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {publishError && (
              <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {publishError}
              </p>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={!allAnswered || !title.trim() || isPublishing}
              onClick={handlePublish}
            >
              {isPublishing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                "Publish Test"
              )}
            </Button>
          </motion.div>
        )}

        {/* STEP 3: PUBLISHED */}
        {step === "published" && (
          <motion.div
            key="published"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            {/* Success indicator */}
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-7 h-7 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-text mb-2">Test is Live</h1>
            <p className="text-sm text-text-secondary mb-8">
              Share this link with your students. They will sign in with Google
              and start the test instantly.
            </p>

            {/* Link display */}
            <div className="bg-surface border border-border rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm font-mono text-text mb-3 break-all">
                {shareUrl}
              </p>
              <Button size="sm" className="w-full" onClick={handleCopyLink}>
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/t/${publishedSlug}`}
                target="_blank"
                className="text-sm font-medium text-text-secondary hover:text-text border border-border hover:border-border-hover px-5 py-2.5 rounded-lg transition-all"
              >
                Preview Test
              </a>
              <button
                className="text-sm font-medium text-text-secondary hover:text-text px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setStep("paste");
                  setRawText("");
                  setQuestions([]);
                  setTitle("");
                  setPublishedSlug(null);
                }}
              >
                Create Another Test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
