"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const freeFeatures = [
  "Unlimited tests",
  "AI-powered question parsing",
  "Up to 100 students per test",
  "Live leaderboard for every test",
  "Student analytics dashboard",
  "Shareable test links",
  "Google OAuth for students",
  "Score distribution charts",
  "Mobile-first responsive design",
  "No watermarks or branding",
];

const futureFeatures = [
  "Unlimited students per test",
  "Student email list access",
  "CSV export of results",
  "Custom branding on test pages",
  "Email campaigns to students",
  "Priority support",
  "Advanced analytics & insights",
  "Bulk test creation via API",
];

export function PricingContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-20">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Pricing
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Free. Seriously.
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          TestLink is free for all educators. We believe every teacher
          should have access to modern test infrastructure — regardless of
          budget.
        </motion.p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-24">
        {/* Free */}
        <motion.div
          className="bg-surface border-2 border-primary/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="absolute -top-3 left-6 text-[10px] font-semibold uppercase tracking-widest text-bg bg-primary px-3 py-1 rounded-full">
            Current Plan
          </span>

          <h3 className="text-xl font-bold text-text mb-1 mt-2">Free</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black font-mono text-text">$0</span>
            <span className="text-sm text-text-muted">/forever</span>
          </div>
          <p className="text-sm text-text-secondary mb-6">
            Everything you need to get started.
          </p>

          <Link
            href="/login"
            className="block w-full text-center gradient-primary text-white font-semibold text-sm py-3 rounded-xl mb-6 shadow-[0_0_20px_rgba(230,57,70,0.2)]"
          >
            Get Started Free
          </Link>

          <ul className="space-y-2.5">
            {freeFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-text-secondary"
              >
                <svg
                  className="w-4 h-4 text-success mt-0.5 shrink-0"
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
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Pro (coming soon) */}
        <motion.div
          className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 relative opacity-70"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="absolute -top-3 left-6 text-[10px] font-semibold uppercase tracking-widest text-text-muted bg-surface-2 border border-border px-3 py-1 rounded-full">
            Coming Soon
          </span>

          <h3 className="text-xl font-bold text-text mb-1 mt-2">Pro</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black font-mono text-text-secondary">TBD</span>
          </div>
          <p className="text-sm text-text-secondary mb-6">
            For educators who need more power.
          </p>

          <div className="block w-full text-center bg-surface-2 text-text-muted font-semibold text-sm py-3 rounded-xl mb-6 cursor-not-allowed">
            Coming Soon
          </div>

          <ul className="space-y-2.5">
            {futureFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-text-muted"
              >
                <svg
                  className="w-4 h-4 text-text-muted mt-0.5 shrink-0"
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
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* FAQ-style section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Common questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Is it really free?",
              a: "Yes. Unlimited tests, AI parsing, live leaderboards — all free. We're building our user base first. Paid features (like student email access) will come later.",
            },
            {
              q: "What's the catch?",
              a: "No catch. Free plan is limited to 100 students per test. For most educators starting out, that's more than enough. Pro plan will remove this limit.",
            },
            {
              q: "Will you start charging for existing features?",
              a: "No. Everything in the Free plan today will remain free forever. Pro plan adds new features on top — it never takes away from Free.",
            },
            {
              q: "Do students need to pay anything?",
              a: "Never. Students click a link, sign in with Google, and take the test. Completely free, no downloads, no subscriptions.",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-text mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
