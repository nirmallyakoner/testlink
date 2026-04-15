"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EditorQuestion = {
  id: string;
  order_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct: "a" | "b" | "c" | "d" | null;
  marks: number;
  explanation: string | null;
};

type Props = {
  testId: string;
  initialTitle: string;
  initialSubject?: string | null;
  initialTimeLimitMins?: number | null;
  initialQuestions: EditorQuestion[];
  isPublished: boolean;
  submissionCount: number;
  mode: "create" | "edit";
  /** If mode=create, where to go on "Save Draft" */
  onDraftSaved?: () => void;
  /** If mode=create, slug for success screen */
  initialSlug?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function OptionLabel({ opt }: { opt: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-surface text-text-muted shrink-0">
      {opt.toUpperCase()}
    </span>
  );
}

// ─── Inline Question Editor ───────────────────────────────────────────────────

function QuestionEditor({
  q,
  locked,
  onSave,
  onClose,
}: {
  q: EditorQuestion;
  locked: boolean;
  onSave: (patch: Partial<EditorQuestion>) => Promise<string | null>;
  onClose: () => void;
}) {
  const [text, setText] = useState(q.question_text);
  const [optA, setOptA] = useState(q.option_a);
  const [optB, setOptB] = useState(q.option_b);
  const [optC, setOptC] = useState(q.option_c ?? "");
  const [optD, setOptD] = useState(q.option_d ?? "");
  const [correct, setCorrect] = useState<"a" | "b" | "c" | "d" | null>(q.correct);
  const [marks, setMarks] = useState(q.marks);
  const [explanation, setExplanation] = useState(q.explanation ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setErr(null);
    const error = await onSave({
      question_text: text,
      option_a: optA,
      option_b: optB,
      option_c: optC.trim() || null,
      option_d: optD.trim() || null,
      correct,
      marks,
      explanation: explanation.trim() || null,
    });
    setSaving(false);
    if (error) setErr(error);
    else onClose();
  }

  const opts = [
    { key: "a" as const, value: optA, set: setOptA, label: "Option A" },
    { key: "b" as const, value: optB, set: setOptB, label: "Option B" },
    { key: "c" as const, value: optC, set: setOptC, label: "Option C (optional)" },
    { key: "d" as const, value: optD, set: setOptD, label: "Option D (optional)" },
  ];

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      {/* Question text */}
      <div>
        <label className="text-xs text-text-muted mb-1 block">Question</label>
        <textarea
          className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 resize-none"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opts.map(({ key, value, set, label }) => {
          const isCorrect = correct === key;
          return (
            <div key={key}>
              <label className="text-xs text-text-muted mb-1 block">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className={cn(
                    "flex-1 bg-surface-2 border rounded-lg px-3 py-2 text-sm text-text focus:outline-none transition-colors",
                    isCorrect
                      ? "border-success/40 focus:border-success/60"
                      : "border-border focus:border-primary/50"
                  )}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                />
                <button
                  title={locked && key !== q.correct ? "Locked — submissions exist" : `Mark ${key.toUpperCase()} as correct`}
                  disabled={locked && key !== q.correct}
                  onClick={() => setCorrect(key)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isCorrect
                      ? "border-success bg-success/15 text-success"
                      : locked
                      ? "border-border/40 text-text-muted/40 cursor-not-allowed"
                      : "border-border text-text-muted hover:border-primary/50 cursor-pointer"
                  )}
                >
                  {key.toUpperCase()}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {locked && (
        <p className="text-xs text-warning bg-warning/8 border border-warning/20 rounded-lg px-3 py-2">
          🔒 Correct answer is locked — students have already submitted.
        </p>
      )}

      {/* Marks + explanation */}
      <div className="flex items-end gap-4">
        <div className="w-24">
          <label className="text-xs text-text-muted mb-1 block">Marks</label>
          <input
            type="number"
            min={1}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-muted mb-1 block">Explanation (optional, student-facing)</label>
          <input
            type="text"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
            placeholder="Why is this the correct answer?"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>
      </div>

      {err && <p className="text-xs text-error">{err}</p>}

      <div className="flex gap-3">
        <Button size="sm" onClick={handleSave} disabled={saving || !text.trim() || !optA.trim() || !optB.trim()}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <button onClick={onClose} className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Add From Text Modal ──────────────────────────────────────────────────────

function AddFromTextModal({
  onAdd,
  onClose,
}: {
  onAdd: (questions: EditorQuestion[]) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleParse() {
    setLoading(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/parse-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ raw_text: text }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Parse failed"); setLoading(false); return; }
      // Map to EditorQuestion shape with temp ids
      const qs: EditorQuestion[] = (data.questions ?? []).map((q: Omit<EditorQuestion, "id" | "order_index">, i: number) => ({
        ...q,
        id: `temp-${Date.now()}-${i}`,
        order_index: 9999 + i,
      }));
      onAdd(qs);
      onClose();
    } catch {
      setErr("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <motion.div
        className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h3 className="text-base font-bold text-text mb-1">Add Questions from Text</h3>
        <p className="text-xs text-text-muted mb-4">Paste questions in any format — AI or regex will parse them.</p>
        <textarea
          className="w-full h-48 bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text font-mono focus:outline-none focus:border-primary/50 resize-none mb-4"
          placeholder={"1. Question?\nA) opt1  B) opt2  C) opt3 ✅  D) opt4"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {err && <p className="text-xs text-error mb-3">{err}</p>}
        <div className="flex gap-3">
          <Button size="sm" disabled={text.trim().length < 10 || loading} onClick={handleParse}>
            {loading ? "Parsing…" : "Parse & Add"}
          </Button>
          <button onClick={onClose} className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EditTestView({
  testId,
  initialTitle,
  initialSubject,
  initialTimeLimitMins,
  initialQuestions,
  isPublished,
  submissionCount,
  mode,
  onDraftSaved,
  initialSlug,
}: Props) {
  const router = useRouter();
  const isLocked = isPublished && submissionCount > 0;

  const [title, setTitle] = useState(initialTitle === "Untitled Draft" ? "" : initialTitle);
  const [questions, setQuestions] = useState<EditorQuestion[]>(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddManual, setShowAddManual] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishErr, setPublishErr] = useState<string | null>(null);
  const [published, setPublished] = useState(isPublished);
  const [publishedSlug, setPublishedSlug] = useState(initialSlug ?? "");
  const [step, setStep] = useState<"editing" | "done">("editing");
  const [savingTitle, setSavingTitle] = useState(false);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  const allAnswered = questions.length > 0 && questions.every((q) => q.correct !== null);
  const flaggedCount = questions.filter((q) => !q.correct).length;

  // ── Auth helper ──────────────────────────────────────────────────────────────
  async function authHeader() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json" };
  }

  // ── Save title ────────────────────────────────────────────────────────────────
  async function saveTitle() {
    if (!title.trim()) return;
    setSavingTitle(true);
    const headers = await authHeader();
    await fetch(`/api/tests/${testId}/meta`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ title: title.trim() }),
    });
    setSavingTitle(false);
  }

  // ── Save question ─────────────────────────────────────────────────────────────
  const handleSaveQuestion = useCallback(
    async (id: string, patch: Partial<EditorQuestion>): Promise<string | null> => {
      const headers = await authHeader();
      const res = await fetch(`/api/questions/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) return data.error ?? "Failed to save";
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Delete question ───────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeleteErr(null);
    const headers = await authHeader();
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) { setDeleteErr(data.error ?? "Failed to delete"); return; }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  // ── Add questions from parse ──────────────────────────────────────────────────
  async function handleAddParsed(newQs: EditorQuestion[]) {
    const headers = await authHeader();
    const res = await fetch(`/api/tests/${testId}/questions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ questions: newQs }),
    });
    const data = await res.json();
    if (!res.ok) { setPublishErr(data.error ?? "Failed to add"); return; }
    // Replace temp ids with real ids from server
    const serverQs: EditorQuestion[] = data.questions ?? [];
    setQuestions((prev) => [...prev, ...serverQs]);
  }

  // ── Add manual blank question ─────────────────────────────────────────────────
  async function handleAddManual() {
    const headers = await authHeader();
    const res = await fetch(`/api/tests/${testId}/questions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        questions: [{
          question_text: "New question",
          option_a: "Option A",
          option_b: "Option B",
          option_c: null,
          option_d: null,
          correct: null,
          marks: 1,
          explanation: null,
        }],
      }),
    });
    const data = await res.json();
    if (!res.ok) return;
    const inserted: EditorQuestion[] = data.questions ?? [];
    setQuestions((prev) => [...prev, ...inserted]);
    if (inserted[0]) setExpandedId(inserted[0].id);
  }

  // ── Publish ───────────────────────────────────────────────────────────────────
  async function handlePublish() {
    if (!title.trim()) { setPublishErr("Please enter a test title."); return; }
    if (!allAnswered) { setPublishErr(`${flaggedCount} question(s) still need a correct answer.`); return; }
    setPublishLoading(true);
    setPublishErr(null);

    // Save title first
    await saveTitle();

    const headers = await authHeader();
    const res = await fetch(`/api/tests/${testId}/publish`, { method: "POST", headers });
    const data = await res.json();
    if (!res.ok) { setPublishErr(data.error ?? "Failed to publish"); setPublishLoading(false); return; }

    setPublished(true);
    setPublishLoading(false);
    // Fetch slug
    const testRes = await fetch(`/api/tests/${testId}/questions`, { headers });
    // We don't have slug in questions API — use router push instead
    if (mode === "create") {
      setStep("done");
    } else {
      router.refresh();
    }
  }

  // ── Save draft ────────────────────────────────────────────────────────────────
  async function handleSaveDraft() {
    if (title.trim()) await saveTitle();
    if (onDraftSaved) onDraftSaved();
    else router.push("/dashboard");
  }

  // ─────────────────────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Test is Live 🎉</h1>
        <p className="text-sm text-text-secondary mb-8">
          Share this link with your students. They sign in with Google and start instantly.
        </p>
        <div className="bg-surface border border-border rounded-xl p-4 mb-6 max-w-md mx-auto">
          <p className="text-sm font-mono text-text mb-3 break-all">
            {typeof window !== "undefined" ? `${window.location.origin}/t/${publishedSlug}` : ""}
          </p>
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/t/${publishedSlug}`);
            }}
          >
            Copy Link
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`/t/${publishedSlug}`}
            target="_blank"
            className="text-sm font-medium text-text-secondary hover:text-text border border-border px-5 py-2.5 rounded-lg transition-all"
          >
            Preview Test
          </a>
          <button
            className="text-sm text-text-muted hover:text-text transition-colors cursor-pointer px-5 py-2.5"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* ── Lock banner ────────────────────────────────────────────────────── */}
      {isLocked && (
        <div className="mb-6 p-4 bg-warning/8 border border-warning/20 rounded-xl">
          <p className="text-sm text-warning font-medium">
            🔒 {submissionCount} student{submissionCount !== 1 ? "s" : ""} have submitted — correct answers and deletions are locked.
          </p>
          <p className="text-xs text-warning/70 mt-1">
            You can still edit question text and option wording (cosmetic fixes only).
          </p>
        </div>
      )}

      {/* ── Meta ───────────────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Input
          label="Test Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          placeholder="e.g., NORCET Mock Test - October"
        />
      </div>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-text">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
          {flaggedCount > 0 && (
            <p className="text-xs text-warning">
              {flaggedCount} need correct {flaggedCount === 1 ? "answer" : "answers"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
          >
            + From Text
          </button>
          <button
            onClick={handleAddManual}
            className="text-xs text-text-secondary bg-surface-2 hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            + Manual
          </button>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {(deleteErr || publishErr) && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
          {deleteErr || publishErr}
        </div>
      )}

      {/* ── Question list ───────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-8">
        <AnimatePresence initial={false}>
          {questions.map((q, i) => {
            const isExpanded = expandedId === q.id;
            const needsAnswer = !q.correct;

            return (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "bg-surface border rounded-xl p-4 transition-colors",
                  needsAnswer ? "border-warning/30" : "border-border",
                  isExpanded && "ring-1 ring-primary/20 border-primary/30"
                )}
              >
                {/* Summary row */}
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-text-muted bg-surface-2 px-2 py-1 rounded shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text leading-relaxed">
                      {q.question_text}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {(["a", "b", "c", "d"] as const).map((opt) => {
                        const text = q[`option_${opt}`];
                        if (!text) return null;
                        const isCorrect = q.correct === opt;
                        return (
                          <span
                            key={opt}
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-mono",
                              isCorrect
                                ? "bg-success/10 text-success border-success/25"
                                : "bg-surface-2 text-text-muted border-border"
                            )}
                          >
                            {opt.toUpperCase()}. {text}
                          </span>
                        );
                      })}
                      {needsAnswer && (
                        <span className="text-[10px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                          Needs answer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={isLocked}
                      title={isLocked ? "Locked — students have answered" : "Delete"}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors text-sm",
                        isLocked
                          ? "text-text-muted/30 cursor-not-allowed"
                          : "text-text-muted hover:text-error hover:bg-error/10 cursor-pointer"
                      )}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Inline editor */}
                {isExpanded && (
                  <QuestionEditor
                    q={q}
                    locked={isLocked}
                    onSave={(patch) => handleSaveQuestion(q.id, patch)}
                    onClose={() => setExpandedId(null)}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Action bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!published ? (
          <>
            <Button
              size="lg"
              className="flex-1"
              disabled={!allAnswered || !title.trim() || publishLoading}
              onClick={handlePublish}
            >
              {publishLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing…
                </span>
              ) : (
                "Publish Test"
              )}
            </Button>
            <button
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none text-sm text-text-secondary border border-border hover:border-border-hover px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Save Draft & Exit
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full">
              ● Live
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-text-secondary hover:text-text transition-colors cursor-pointer"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* ── Add from text modal ─────────────────────────────────────────────── */}
      {showAddModal && (
        <AddFromTextModal
          onAdd={handleAddParsed}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
