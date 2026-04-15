"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Paste your questions",
    description:
      "Copy-paste your MCQs in any format. Our AI structures them into a clean test — no formatting rules, no templates.",
    details: "Supports any format: numbered, bulleted, tabular, even messy PDFs. Works with English, Hindi, and mixed languages.",
  },
  {
    number: "02",
    title: "Publish and share",
    description:
      "Review the parsed questions, set a title, and hit publish. Your test link is copied to clipboard instantly.",
    details: "Share via WhatsApp, Telegram, YouTube description, Instagram bio — anywhere a link works.",
  },
  {
    number: "03",
    title: "Students compete live",
    description:
      "Students sign in with Google, take the test, and see their rank on a live leaderboard. No app download needed.",
    details: "One tap to start. Works on any phone. Results in real-time. Students share their rank with friends.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wider uppercase">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            From questions to leaderboard
            <br />
            <span className="text-text-secondary">in three steps</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className="group relative bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:border-border-hover transition-all duration-300"
            >
              {/* Step number */}
              <div className="text-4xl sm:text-5xl font-black text-surface-2 group-hover:text-primary/10 transition-colors duration-300 mb-4 sm:mb-6 select-none">
                {step.number}
              </div>

              <h3 className="text-lg font-semibold text-text mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {step.description}
              </p>

              <p className="text-xs text-text-muted leading-relaxed">
                {step.details}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
