"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const painPoints = [
  {
    problem: "You have 200 MCQs in a Word doc but no way to share them as a test.",
    solution: "Paste them in. AI structures them. You get a link in 60 seconds.",
  },
  {
    problem: "Google Forms doesn't show students a leaderboard or their rank.",
    solution: "TestLink shows real-time rankings. Students share their rank with friends — free marketing for you.",
  },
  {
    problem: "You don't know who actually took your test.",
    solution: "Every student signs in with Google. You see their name, score, rank, and time taken.",
  },
  {
    problem: "Your students use cheap Android phones on slow data.",
    solution: "TestLink loads in under 2 seconds on 3G. No app download. Pure browser.",
  },
];

const whyNotGoogleForms = [
  { form: "No leaderboard", testlink: "Real-time ranked leaderboard" },
  { form: "No timer", testlink: "Built-in countdown timer" },
  { form: "Manual question formatting", testlink: "AI parses any format" },
  { form: "No student competition", testlink: "Rank reveal drives engagement" },
  { form: "Basic analytics", testlink: "Score distribution, time tracking" },
  { form: "No one-click sharing", testlink: "Auto-copied link, works on WhatsApp" },
];

const useCases = [
  {
    title: "YouTube Educators",
    description: "Link a test in your video description. Students who watch your lecture take the test and see how they rank. Drives engagement and return views.",
  },
  {
    title: "Telegram / WhatsApp Groups",
    description: "Drop a test link in your group. Students compete against each other. The group buzzes with rank comparisons — organic engagement you can't buy.",
  },
  {
    title: "Coaching Institutes",
    description: "Weekly mock tests for your batch. Track who's improving, who's falling behind. All from a simple link — no IT department needed.",
  },
  {
    title: "Private Tutors",
    description: "Send a practice test after every class. See which topics your student struggles with. Personalize your next session based on real data.",
  },
];

export function ForEducatorsContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          For Educators
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          You teach. We handle
          <br />
          <span className="gradient-text">the test infrastructure.</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          TestLink was built by talking to Indian educators. Every feature
          solves a real problem — not an imagined one.
        </motion.p>
      </div>

      {/* Pain → Solution */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Problems we solve
        </h2>
        <div className="space-y-4 sm:space-y-5">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-sm sm:text-base text-text-muted mb-3 line-through decoration-text-muted/30">
                {point.problem}
              </p>
              <p className="text-sm sm:text-base text-text font-medium">
                {point.solution}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why not Google Forms */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-text mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          TestLink vs Google Forms
        </motion.h2>

        <motion.div
          className="bg-surface border border-border rounded-xl sm:rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-border">
            <div className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-text-muted">
              Google Forms
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-primary border-l border-border">
              TestLink
            </div>
          </div>

          {/* Rows */}
          {whyNotGoogleForms.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b border-border/50 last:border-0"
            >
              <div className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-text-muted">
                {row.form}
              </div>
              <div className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-text border-l border-border/50">
                {row.testlink}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Use cases */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-text mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Who uses TestLink?
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              className="bg-surface border border-border rounded-xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-base font-semibold text-text mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {useCase.description}
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
          Your students are already on their phones.
          <br />
          <span className="text-text-secondary">Give them a test link.</span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          Free. No setup. No downloads. Works on every phone.
        </p>
        <Link
          href="/login"
          className="inline-block gradient-primary text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_50px_rgba(230,57,70,0.45)] transition-all duration-300"
        >
          Create Your First Test
        </Link>
      </motion.div>
    </div>
  );
}
