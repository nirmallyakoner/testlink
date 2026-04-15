"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const exams = [
  { name: "NORCET", full: "Nursing Officer Recruitment Common Eligibility Test", body: "AIIMS" },
  { name: "AIIMS BSc Nursing", full: "BSc Nursing Entrance Examination", body: "AIIMS" },
  { name: "Staff Nurse Recruitment", full: "State-level Staff Nurse Selection", body: "Various State PSCs" },
  { name: "RUHS", full: "Rajasthan University of Health Sciences Nursing", body: "RUHS" },
  { name: "JIPMER Nursing", full: "JIPMER BSc Nursing Entrance", body: "JIPMER" },
  { name: "PGIMER Nursing", full: "PGIMER BSc Nursing Entrance", body: "PGIMER" },
];

const painPoints = [
  {
    problem: "You spend 2 hours formatting 100 MCQs into Google Forms every week",
    solution: "Paste all 100 questions in any format. TestLink AI structures them in under 5 seconds.",
  },
  {
    problem: "Students take your mock test but never know how they rank among others",
    solution: "Every student sees their rank on a live leaderboard immediately after submitting. This drives competition and repeat engagement.",
  },
  {
    problem: "You have no way to track which students attended and how they performed",
    solution: "Full analytics dashboard: total attempts, average scores, score distribution, and a list of every student with their rank.",
  },
  {
    problem: "Your students are on WhatsApp and Telegram — not on any test platform",
    solution: "Share your test as a simple link on WhatsApp, Telegram, or YouTube. Students tap, sign in with Google, and start. No app download.",
  },
];

export function NursingExamsContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          For Nursing Educators
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create nursing mock tests
          <br />
          <span className="gradient-text">your students will actually take.</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          NORCET. AIIMS. Staff Nurse. Whatever nursing exam you teach for —
          paste your questions, get a test link, share it on WhatsApp. Students
          compete on a live leaderboard.
        </motion.p>
      </div>

      {/* Exams supported */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Works for every nursing exam
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {exams.map((exam, i) => (
            <motion.div
              key={exam.name}
              className="bg-surface border border-border rounded-xl p-5"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-base font-semibold text-text mb-1">{exam.name}</h3>
              <p className="text-xs text-text-muted mb-1">{exam.full}</p>
              <p className="text-xs text-text-muted">Conducted by: {exam.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pain points */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Sound familiar?
        </h2>
        <div className="space-y-4">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-xl p-5 sm:p-7"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-sm text-text-muted mb-3 line-through decoration-text-muted/30">
                {point.problem}
              </p>
              <p className="text-sm sm:text-base text-text font-medium">
                {point.solution}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works for nursing */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          How a nursing educator uses TestLink
        </h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Copy your question bank", desc: "Open your Word doc, PDF, or note. Select all your MCQs. Copy." },
            { step: "2", title: "Paste into TestLink", desc: "Paste into the text area. Any format works — numbered, bulleted, tabular. Even Hindi-English mixed text." },
            { step: "3", title: "AI structures everything", desc: "TestLink AI identifies each question, extracts options A through D, and detects the correct answer. Takes under 5 seconds." },
            { step: "4", title: "Review and publish", desc: "Check the parsed questions. Fix any flagged items. Set a title like 'NORCET Mock Test 1'. Hit publish." },
            { step: "5", title: "Share on WhatsApp", desc: "Your test link is auto-copied. Paste it in your WhatsApp group, Telegram channel, or YouTube description. Done." },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              className="flex gap-4 items-start"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-text mb-1">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
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
          Your nursing students deserve
          <br />
          <span className="text-text-secondary">better than Google Forms.</span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          Free. No setup. Works on every phone.
        </p>
        <Link
          href="/login"
          className="inline-block gradient-primary text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_50px_rgba(230,57,70,0.45)] transition-all duration-300"
        >
          Create Your First Nursing Test
        </Link>
      </motion.div>
    </div>
  );
}
