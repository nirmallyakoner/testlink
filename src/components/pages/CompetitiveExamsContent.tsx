"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const examCategories = [
  { category: "Civil Services", exams: ["UPSC CSE Prelims", "State PSC", "UPPSC", "MPPSC", "BPSC"] },
  { category: "Staff Selection", exams: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD"] },
  { category: "Engineering", exams: ["JEE Main", "JEE Advanced", "GATE", "State CETs"] },
  { category: "Medical", exams: ["NEET UG", "NEET PG", "AIIMS PG", "JIPMER"] },
  { category: "Banking", exams: ["IBPS PO", "IBPS Clerk", "SBI PO", "RBI Grade B"] },
  { category: "Teaching", exams: ["CTET", "STET", "UGC NET", "KVS", "NVS"] },
];

const stats = [
  { value: "10M+", label: "Educators in India" },
  { value: "50M+", label: "Aspirants preparing for competitive exams" },
  { value: "2 hrs", label: "Average time to create a mock test manually" },
  { value: "60s", label: "Time to create one on TestLink" },
];

export function CompetitiveExamsContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          For Competitive Exam Educators
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          Mock tests that feel like
          <br />
          <span className="gradient-text">the real competition.</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          UPSC, SSC, JEE, NEET, Banking — whatever exam you prepare students for.
          Paste your questions. Get a test link with a live leaderboard. Share it
          in seconds.
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-16 sm:mb-24"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4 sm:p-5 text-center">
            <p className="text-xl sm:text-2xl font-black font-mono text-text mb-1">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Exam categories */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Covers every competitive exam in India
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              className="bg-surface border border-border rounded-xl p-5"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-sm font-semibold text-text mb-3">{cat.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.exams.map((exam) => (
                  <span key={exam} className="text-[11px] text-text-muted bg-surface-2 px-2 py-1 rounded-md">
                    {exam}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why leaderboard matters */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <motion.div
          className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-text mb-4">
            Why leaderboards matter for competitive exams
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed">
            <p>
              Competitive exams are, by definition, competitions. Your students don&apos;t
              just need to know the material — they need to know where they stand
              relative to others. That&apos;s exactly what a leaderboard gives them.
            </p>
            <p>
              When a student completes your UPSC Prelims mock and sees &quot;Rank #47
              out of 1,200 students,&quot; they have real context for their preparation
              level. This single data point is more motivating than any score or
              percentage.
            </p>
            <p>
              Students screenshot their rank and share it on WhatsApp and Instagram
              stories. This is organic marketing for your coaching — every rank
              share brings a new student to your next mock test.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Turn your question bank into
          <br />
          <span className="text-text-secondary">a competitive arena.</span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          Free for all educators. No technical knowledge needed.
        </p>
        <Link
          href="/login"
          className="inline-block gradient-primary text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_50px_rgba(230,57,70,0.45)] transition-all duration-300"
        >
          Create Your First Mock Test
        </Link>
      </motion.div>
    </div>
  );
}
