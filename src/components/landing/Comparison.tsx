"use client";

import { motion } from "framer-motion";

const comparisons = [
  { feature: "Question entry", form: "Type each one manually", testlink: "Paste all at once, AI structures" },
  { feature: "Leaderboard", form: "Not available", testlink: "Real-time ranked leaderboard" },
  { feature: "Timer", form: "Not built-in", testlink: "Countdown timer on every test" },
  { feature: "Student rank", form: "Students never see rank", testlink: "Instant rank reveal after submit" },
  { feature: "Sharing", form: "Long Google form link", testlink: "Clean link, auto-copied" },
  { feature: "Analytics", form: "Basic response summary", testlink: "Scores, time, distribution charts" },
  { feature: "Setup time", form: "1-2 hours per 100 questions", testlink: "60 seconds" },
  { feature: "Mobile experience", form: "Generic form layout", testlink: "Designed for budget Android phones" },
];

export function Comparison() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wider uppercase">
            Comparison
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            TestLink vs Google Forms
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mt-3 max-w-xl mx-auto">
            Google Forms is great for surveys. But for competitive mock tests,
            your students deserve more.
          </p>
        </motion.div>

        <motion.div
          className="bg-surface border border-border rounded-xl sm:rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-3 border-b border-border">
            <div className="px-3 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
              Feature
            </div>
            <div className="px-3 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider border-l border-border">
              Google Forms
            </div>
            <div className="px-3 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-wider border-l border-border">
              TestLink
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-3 border-b border-border/50 last:border-0"
            >
              <div className="px-3 sm:px-5 py-3 text-xs sm:text-sm text-text font-medium">
                {row.feature}
              </div>
              <div className="px-3 sm:px-5 py-3 text-xs sm:text-sm text-text-muted border-l border-border/50">
                {row.form}
              </div>
              <div className="px-3 sm:px-5 py-3 text-xs sm:text-sm text-text border-l border-border/50">
                {row.testlink}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
