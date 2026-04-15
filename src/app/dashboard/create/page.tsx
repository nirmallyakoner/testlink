"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { EditTestView } from "@/components/test-editor/EditTestView";
import type { EditorQuestion } from "@/components/test-editor/EditTestView";
import { useRouter } from "next/navigation";

type Step = "paste" | "editor";

export default function CreateTestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("paste");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // After successful parse + draft save
  const [testId, setTestId] = useState<string | null>(null);
  const [testSlug, setTestSlug] = useState<string>("");
  const [questions, setQuestions] = useState<EditorQuestion[]>([]);

  // ── Auth helper ──────────────────────────────────────────────────────────────
  async function authHeader() {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    };
  }

  // ── Parse → save draft ────────────────────────────────────────────────────────
  const handleParse = async (useDemo = false) => {
    setIsLoading(true);
    setParseError(null);

    try {
      const headers = await authHeader();

      // 1. Parse questions
      let parsedQuestions: EditorQuestion[];

      if (useDemo) {
        parsedQuestions = DEMO_QUESTIONS.map((q, i) => ({
          ...q,
          id: `demo-${i}`,
          order_index: i + 1,
        }));
      } else {
        const parseRes = await fetch("/api/parse-questions", {
          method: "POST",
          headers,
          body: JSON.stringify({ raw_text: rawText }),
        });
        const parseData = await parseRes.json();
        if (!parseRes.ok) {
          setParseError(parseData.error ?? "Failed to parse questions.");
          setIsLoading(false);
          return;
        }
        parsedQuestions = (parseData.questions ?? []).map(
          (q: Omit<EditorQuestion, "id" | "order_index">, i: number) => ({
            ...q,
            id: `temp-${i}`,
            order_index: i + 1,
          })
        );
      }

      if (parsedQuestions.length === 0) {
        setParseError("No questions found. Please check your format.");
        setIsLoading(false);
        return;
      }

      // 2. Save as draft immediately (so it's not lost if the tab is closed)
      const saveRes = await fetch("/api/tests", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: "Untitled Draft",
          publish: false,
          questions: parsedQuestions.map((q) => ({
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c ?? null,
            option_d: q.option_d ?? null,
            correct: q.correct ?? null,
            marks: q.marks ?? 1,
            explanation: q.explanation ?? null,
          })),
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        setParseError(saveData.error ?? "Failed to save draft.");
        setIsLoading(false);
        return;
      }

      // 3. Fetch real question IDs from the server
      const qRes = await fetch(`/api/tests/${saveData.test_id}/questions`, {
        headers,
      });
      const qData = await qRes.json();
      const realQuestions: EditorQuestion[] = qData.questions ?? [];

      setTestId(saveData.test_id);
      setTestSlug(saveData.slug);
      setQuestions(realQuestions);
      setIsLoading(false);
      setStep("editor");
    } catch {
      setParseError("Network error — please check your connection.");
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-text mb-2">Create a New Test</h1>
            <p className="text-sm text-text-secondary mb-8">
              Paste your questions in any format. We&apos;ll parse them and save a draft
              so you never lose your work.
            </p>

            <div className="mb-4">
              <textarea
                className="w-full h-72 bg-surface-2 border border-border rounded-xl px-5 py-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none font-mono leading-relaxed"
                placeholder={`Paste your questions here — any format works.\n\n1. Question text?\nA) Option 1  B) Option 2  C) Option 3 ✅  D) Option 4\n\n2. Another question?\na. opt1  b. opt2  c. opt3  d. opt4\nAns: b`}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            {parseError && (
              <p className="mb-4 text-sm text-error bg-error/10 border border-error/20 rounded-lg px-4 py-3">
                {parseError}
              </p>
            )}

            <details className="mb-6">
              <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                Supported formats
              </summary>
              <div className="mt-2 p-4 bg-surface border border-border rounded-lg text-xs text-text-muted font-mono leading-relaxed">
                <p className="mb-1 text-text-secondary font-sans font-medium">
                  All of these work:
                </p>
                <p>1. Question? A) opt1 B) opt2 ✅ C) opt3 D) opt4</p>
                <p>Q1) Question? a-opt1 b.opt2 c opt3 d opt4 Ans: b</p>
                <p>1. Question? (1) opt1 (2) opt2 (3) opt3 ✓ (4) opt4</p>
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
                  Parsing & saving draft…
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

        {/* STEP 2: EDITOR */}
        {step === "editor" && testId && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text mb-1">Review & Edit</h1>
                <p className="text-sm text-text-secondary">
                  Draft saved ✓ — set a title, check the answers, then publish.
                </p>
              </div>
              <button
                className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                onClick={() => {
                  setStep("paste");
                  setRawText("");
                  setQuestions([]);
                  setTestId(null);
                }}
              >
                ← Re-paste
              </button>
            </div>

            <EditTestView
              testId={testId}
              initialTitle="Untitled Draft"
              initialQuestions={questions}
              isPublished={false}
              submissionCount={0}
              mode="create"
              initialSlug={testSlug}
              onDraftSaved={() => router.push("/dashboard")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Demo questions ─────────────────────────────────────────────────────────────

const DEMO_QUESTIONS = [
  {
    question_text: "What is the normal range of hemoglobin in adult males?",
    option_a: "11-13 g/dL",
    option_b: "13-17 g/dL",
    option_c: "17-20 g/dL",
    option_d: "8-11 g/dL",
    correct: "b" as const,
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Which of the following is NOT a function of the liver?",
    option_a: "Bile production",
    option_b: "Glycogen storage",
    option_c: "Insulin secretion",
    option_d: "Detoxification",
    correct: "c" as const,
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Normal respiratory rate in adults is:",
    option_a: "8-12 breaths/min",
    option_b: "12-20 breaths/min",
    option_c: "20-30 breaths/min",
    option_d: "30-40 breaths/min",
    correct: "b" as const,
    marks: 1,
    explanation: null,
  },
  {
    question_text: "Which cranial nerve is responsible for the sense of smell?",
    option_a: "Olfactory nerve (CN I)",
    option_b: "Optic nerve (CN II)",
    option_c: "Trigeminal nerve (CN V)",
    option_d: "Facial nerve (CN VII)",
    correct: "a" as const,
    marks: 1,
    explanation: null,
  },
  {
    question_text: "The normal blood pH range is:",
    option_a: "7.25-7.30",
    option_b: "7.35-7.45",
    option_c: "7.45-7.55",
    option_d: "7.55-7.65",
    correct: null,
    marks: 1,
    explanation: null,
    flagged: true,
  },
];
