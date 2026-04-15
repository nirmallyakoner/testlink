"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

type TestInfo = {
  id: string;
  title: string;
  slug: string;
  subject: string | null;
  description: string | null;
  time_limit_mins: number | null;
  question_count: number;
  total_marks: number;
  educator_name: string;
};

type TestQuestion = {
  id: string;
  order_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  marks: number;
};

type TestState = "landing" | "testing" | "submitting";

type Props = {
  test: TestInfo;
  questions: TestQuestion[];
  isLoggedIn: boolean;
  alreadySubmitted: boolean;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function TestEngine({
  test,
  questions,
  isLoggedIn,
  alreadySubmitted,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<TestState>("landing");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Timer
  const startTimeRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    test.time_limit_mins ? test.time_limit_mins * 60 : null
  );

  useEffect(() => {
    if (state !== "testing") return;
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      setElapsedSeconds(elapsed);

      if (test.time_limit_mins) {
        const remaining = test.time_limit_mins * 60 - elapsed;
        if (remaining <= 0) {
          clearInterval(interval);
          setTimeRemaining(0);
          handleAutoSubmit(elapsed);
        } else {
          setTimeRemaining(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // ── Student sign-in (Google OAuth) ──────────────────────────────────────────
  async function handleStudentSignIn() {
    setOauthLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=student&slug=${test.slug}`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      setOauthLoading(false);
    }
    // On success, browser redirects
  }

  // ── Answer selection ─────────────────────────────────────────────────────────
  function handleSelectOption(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  // ── Submission ───────────────────────────────────────────────────────────────
  async function submitTest(timeTaken?: number) {
    if (state === "submitting") return;
    setState("submitting");
    setShowConfirm(false);
    setSubmitError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSubmitError("Session expired. Please refresh and try again.");
        setState("testing");
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "submit-test",
        {
          body: {
            test_slug: test.slug,
            answers,
            time_taken_sec: timeTaken ?? elapsedSeconds,
          },
        }
      );

      if (error) {
        // functions.invoke wraps non-2xx responses in a FunctionsHttpError
        // Check if it's a 409 (already submitted)
        if (error.message?.includes("Already submitted") || data?.error === "Already submitted") {
          router.push(`/t/${test.slug}/result`);
          return;
        }
        const errMessage =
          (typeof data === "object" && data?.error) ||
          error.message ||
          "Submission failed. Please try again.";
        setSubmitError(errMessage);
        setState("testing");
        return;
      }

      router.push(`/t/${test.slug}/result`);
    } catch {
      setSubmitError("Network error — please check your connection.");
      setState("testing");
    }
  }

  function handleAutoSubmit(elapsed: number) {
    submitTest(elapsed);
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-bg">
      <AnimatePresence mode="wait">

        {/* ── LANDING ────────────────────────────────────────────────────────── */}
        {state === "landing" && (
          <motion.div
            key="landing"
            className="min-h-screen flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-sm text-center">
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-4">
                <Logo className="w-12 h-12 mx-auto mb-5 drop-shadow-lg" />

                <p className="text-xs text-text-muted mb-1">
                  Test by {test.educator_name}
                </p>
                <h1 className="text-xl font-bold text-text mb-1">
                  {test.title}
                </h1>
                {test.subject && (
                  <p className="text-sm text-text-secondary mb-4">
                    {test.subject}
                  </p>
                )}

                <div className="flex items-center justify-center gap-6 mb-8 text-sm text-text-muted">
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-text">
                      {test.question_count}
                    </p>
                    <p className="text-xs">Questions</p>
                  </div>
                  {test.time_limit_mins && (
                    <>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <p className="text-lg font-bold font-mono text-text">
                          {test.time_limit_mins}
                        </p>
                        <p className="text-xs">Minutes</p>
                      </div>
                    </>
                  )}
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono text-text">
                      {test.total_marks}
                    </p>
                    <p className="text-xs">Marks</p>
                  </div>
                </div>

                {/* Already submitted */}
                {alreadySubmitted ? (
                  <div className="space-y-3">
                    <p className="text-sm text-success bg-success/10 border border-success/20 rounded-lg px-4 py-2">
                      You already submitted this test.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() =>
                        router.push(`/t/${test.slug}/result`)
                      }
                    >
                      View Your Result
                    </Button>
                  </div>
                ) : isLoggedIn ? (
                  /* Already signed in — go straight to test */
                  <Button
                    className="w-full"
                    onClick={() => setState("testing")}
                  >
                    Start Test
                  </Button>
                ) : (
                  /* Not signed in — Google sign-in */
                  <button
                    onClick={handleStudentSignIn}
                    disabled={oauthLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {oauthLoading ? (
                      <svg
                        className="w-5 h-5 animate-spin text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    {oauthLoading
                      ? "Redirecting to Google..."
                      : "Sign in with Google to Start"}
                  </button>
                )}
              </div>
              <p className="text-xs text-text-muted">Powered by TestLink</p>
              {/* Profile link — visible when student is already signed in */}
              {isLoggedIn && (
                <div className="mt-3">
                  <a
                    href="/profile"
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
                  >
                    <span>👤</span> View My Profile
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TESTING ────────────────────────────────────────────────────────── */}
        {(state === "testing" || state === "submitting") && (
          <motion.div
            key="testing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top bar */}
            <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-xl border-b border-border">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text truncate">
                    {test.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {answeredCount}/{totalQuestions} answered
                  </p>
                </div>

                {/* Timer */}
                {timeRemaining !== null ? (
                  <div
                    className={cn(
                      "flex items-center gap-2 border rounded-lg px-3 py-1.5",
                      timeRemaining < 120
                        ? "bg-error/10 border-error/20"
                        : "bg-surface border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full animate-live",
                        timeRemaining < 120 ? "bg-error" : "bg-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-mono font-bold",
                        timeRemaining < 120 ? "text-error" : "text-text"
                      )}
                    >
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-live" />
                    <span className="text-sm font-mono font-bold text-text">
                      {formatTime(elapsedSeconds)}
                    </span>
                  </div>
                )}
              </div>

              {/* Question nav pills */}
              <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-3">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {questions.map((q, i) => (
                    <a
                      key={q.id}
                      href={`#q-${q.id}`}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center text-xs font-mono font-semibold rounded-lg shrink-0 transition-colors",
                        answers[q.id]
                          ? "bg-success/15 text-success border border-success/30"
                          : "bg-surface-2 text-text-muted border border-border hover:border-border-hover"
                      )}
                    >
                      {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-32">
              {submitError && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
                  {submitError}
                </div>
              )}

              {questions.map((q, i) => (
                <div
                  key={q.id}
                  id={`q-${q.id}`}
                  className="bg-surface border border-border rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-xs font-mono font-bold text-text-muted bg-surface-2 px-2.5 py-1 rounded shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm sm:text-base text-text leading-relaxed">
                      {q.question_text}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {(["a", "b", "c", "d"] as const).map((opt) => {
                      const key = `option_${opt}` as keyof TestQuestion;
                      const text = q[key] as string | null;
                      if (!text) return null;
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(q.id, opt)}
                          disabled={state === "submitting"}
                          className={cn(
                            "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all cursor-pointer disabled:cursor-not-allowed min-h-[52px] flex items-center gap-3",
                            isSelected
                              ? "border-primary/60 bg-primary/10 text-text"
                              : "border-border bg-surface-2 text-text-secondary hover:border-border-hover hover:bg-surface-hover"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 uppercase",
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-bg text-text-muted"
                            )}
                          >
                            {opt}
                          </span>
                          <span className="flex-1 leading-snug">{text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky submit bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-bg/90 backdrop-blur-xl border-t border-border safe-area-bottom">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text">
                    {answeredCount}/{totalQuestions}
                  </p>
                  <p className="text-xs text-text-muted">Answered</p>
                </div>
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={state === "submitting"}
                  size="lg"
                  className="min-w-[140px]"
                >
                  {state === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Test"
                  )}
                </Button>
              </div>
            </div>

            {/* Confirmation modal */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
                <motion.div
                  className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <h3 className="text-lg font-bold text-text mb-2">
                    Submit your test?
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    You have answered {answeredCount} out of {totalQuestions}{" "}
                    questions.
                    {answeredCount < totalQuestions && (
                      <span className="text-warning">
                        {" "}
                        {totalQuestions - answeredCount} questions are
                        unanswered.
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setShowConfirm(false)}
                    >
                      Go Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => submitTest()}
                    >
                      Submit
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
