"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "60s", label: "To create a test" },
  { value: "1", label: "Click to share" },
  { value: "0", label: "App downloads needed" },
  { value: "Free", label: "Forever for educators" },
];

const principles = [
  {
    title: "Educator-first, always",
    description:
      "Every feature is designed around the educator's workflow. We never build for enterprise buyers or IT admins. Our user is the teacher sitting at home with a Word doc full of MCQs and 10 minutes before the next YouTube live.",
  },
  {
    title: "Zero friction or nothing",
    description:
      "If a feature adds an extra click, we rethink it. If a student needs to download an app, we failed. TestLink should feel like sharing a YouTube link — paste, send, done.",
  },
  {
    title: "India-first infrastructure",
    description:
      "80% of our users open tests on mid-range Android phones over 4G. We optimize for Redmi, Moto, and Realme — not iPhone 15 Pro. Every page loads under 2 seconds on 3G.",
  },
  {
    title: "Data as a service",
    description:
      "Every student who takes a test gives us verified Google identity. This data — when the educator is ready to use it — becomes the platform's long-term moat. We store it responsibly, and we never sell it to third parties.",
  },
];

export function AboutContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About TestLink
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          India has 10 million educators.
          <br />
          <span className="gradient-text">Most have no test tools.</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          YouTube educators, Telegram channel owners, private tutors, small
          coaching institutes — they all have question banks. They all have
          students. But none of them have a fast, free way to create a
          shareable test link with a live leaderboard. TestLink changes that.
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-5 text-center"
          >
            <p className="text-2xl sm:text-3xl font-black font-mono text-text mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* The problem */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <motion.div
          className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-text mb-4">
            The problem we saw
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed">
            <p>
              A nursing educator with 15,000 YouTube subscribers has a PDF
              with 200 MCQs for the NORCET exam. Her students ask for a
              mock test every week. She types questions into Google Forms,
              manually formats each one, shares the link on WhatsApp, and
              then manually tallies scores in a spreadsheet.
            </p>
            <p>
              This takes her 2 hours per test. She does it because she cares
              about her students. But it doesn't scale. She spends more time
              formatting tests than creating content.
            </p>
            <p>
              TestLink reduces those 2 hours to 60 seconds. Paste. Publish.
              Share. Done.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Principles */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          What we believe
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {principles.map((principle, i) => (
            <motion.div
              key={principle.title}
              className="bg-surface border border-border rounded-xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-base font-semibold text-text mb-2">
                {principle.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Join the educators who
          <br />
          <span className="text-text-secondary">choose speed over complexity.</span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          Start creating tests today. No signup forms. Just your Google account.
        </p>
        <Link
          href="/login"
          className="inline-block gradient-primary text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_50px_rgba(230,57,70,0.45)] transition-all duration-300"
        >
          Get Started Free
        </Link>
      </motion.div>
    </div>
  );
}
