"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

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
          <Card hover>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Left: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-text truncate">
                    {test.title}
                  </h3>
                  {test.is_published && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  {test.subject && <span>{test.subject}</span>}
                  <span>{test.question_count} questions</span>
                  <span>{formatDate(test.created_at)}</span>
                </div>
              </div>

              {/* Right: Stats + actions */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold font-mono text-text">
                    {test.attempts.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">
                    Attempts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="text-xs text-text-secondary hover:text-text bg-surface-2 hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/t/${test.slug}`
                      )
                    }
                  >
                    Copy Link
                  </button>
                  <Link
                    href={`/t/${test.slug}`}
                    target="_blank"
                    className="text-xs text-text-secondary hover:text-text bg-surface-2 hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/dashboard/tests/${test.id}/analytics`}
                    className="text-xs text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors font-medium"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
