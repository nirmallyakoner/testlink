"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Parsing",
    description:
      "Paste questions in any format. Our AI reads messy text, numbered lists, tabular data — and structures everything into clean MCQs automatically.",
    tag: "Smart",
  },
  {
    title: "Live Leaderboard",
    description:
      "Real-time rankings that update as students submit. Students see where they stand among hundreds of peers — driving competition and engagement.",
    tag: "Real-time",
  },
  {
    title: "Zero Friction Entry",
    description:
      "No app download. No account creation forms. Students click the link, sign in with Google, and start the test. Under 60 seconds from link to first question.",
    tag: "Instant",
  },
  {
    title: "Student Insights",
    description:
      "See who took your test, how they performed, score distributions, and average completion times. Understand your audience without surveys.",
    tag: "Analytics",
  },
  {
    title: "Draft & Edit Mode",
    description:
      "Review your AI-generated draft, add custom questions, or fix typos before publishing. Once published, your questions are securely locked in.",
    tag: "Control",
  },
  {
    title: "Time Limits",
    description:
      "Set strict countdown timers for your mock tests. Force auto-submit when the clock runs out to simulate true exam pressure.",
    tag: "Exam Simulation",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Features() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wider uppercase">
            Features
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Everything an educator needs.
            <br />
            <span className="text-text-secondary">Nothing they don&apos;t.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-border-hover transition-all duration-300"
            >
              <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/8 px-2.5 py-1 rounded-full mb-4">
                {feature.tag}
              </span>
              <h3 className="text-base font-semibold text-text mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
