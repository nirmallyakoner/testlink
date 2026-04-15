"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Test = {
  id: string;
  title: string;
  slug: string;
  subject: string | null;
  question_count: number;
  total_marks: number;
  created_at: string;
  is_published: boolean;
  attempts: number;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/t/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-all cursor-pointer min-h-[36px]",
        copied
          ? "text-success bg-success/10 border-success/30"
          : "text-text-secondary bg-surface-2 hover:bg-surface-hover border-border hover:border-border-hover"
      )}
      onClick={handleCopy}
    >
      {copied ? "✓ Copied!" : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </>
      )}
    </button>
  );
}

export function TestList({ tests }: { tests: Test[] }) {
  return (
    <motion.div
      className="space-y-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tests.map((test) => (
        <motion.div key={test.id} variants={item}>
          <Card hover className="p-4 sm:p-5">
            {/* Top section: title + badge + attempts */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-semibold text-text truncate max-w-[200px] sm:max-w-none">
                    {test.title}
                  </h3>
                  {test.is_published ? (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      ● Live
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
                      ◐ Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
                  {test.subject && <span className="text-text-secondary">{test.subject}</span>}
                  {test.subject && <span className="w-px h-3 bg-border" />}
                  <span>{test.question_count} questions</span>
                  <span className="w-px h-3 bg-border" />
                  <span>{formatDate(test.created_at)}</span>
                </div>
              </div>

              {/* Attempt count — only live tests */}
              {test.is_published && (
                <div className="text-center shrink-0 bg-surface-2 rounded-xl px-3 py-2 border border-border">
                  <p className="text-lg font-bold font-mono text-text leading-none">
                    {test.attempts.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-text-muted uppercase tracking-wider mt-0.5">
                    Attempts
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons — always visible, prominent */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Edit — primary action for both states */}
              <Link
                href={`/dashboard/tests/${test.id}/edit`}
                className="flex items-center gap-1.5 text-xs font-semibold text-text bg-surface-2 hover:bg-surface-hover border border-border hover:border-border-hover px-3 py-2 rounded-xl transition-colors min-h-[36px]"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>

              {/* Live-only actions */}
              {test.is_published && (
                <>
                  <CopyLinkButton slug={test.slug} />

                  <Link
                    href={`/t/${test.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-2 hover:bg-surface-hover border border-border hover:border-border-hover px-3 py-2 rounded-xl transition-colors min-h-[36px]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Preview
                  </Link>

                  <Link
                    href={`/dashboard/tests/${test.id}/analytics`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/30 px-3 py-2 rounded-xl transition-colors min-h-[36px] ml-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                </>
              )}

              {/* Draft: only publish shortcut */}
              {!test.is_published && (
                <Link
                  href={`/dashboard/tests/${test.id}/edit`}
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 px-3 py-2 rounded-xl transition-colors min-h-[36px]"
                >
                  Publish →
                </Link>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
