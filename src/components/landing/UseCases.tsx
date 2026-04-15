"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const useCases = [
  {
    title: "YouTube Educators",
    description: "Share a test link in your video description. Students who watch your lecture take the test and compete — driving engagement and return views.",
    cta: "Nursing Exams",
    href: "/use-cases/nursing-exams",
  },
  {
    title: "Coaching Institutes",
    description: "Weekly mock tests for your batch. Track performance across all students. Identify who's improving and who needs attention — all from one dashboard.",
    cta: "Competitive Exams",
    href: "/use-cases/competitive-exams",
  },
  {
    title: "Private Tutors",
    description: "After every class, send a quick 10-question test. See exactly which topics your student struggles with. Tailor your next session based on real data.",
    cta: "See How It Works",
    href: "/how-to-create-online-test",
  },
  {
    title: "Telegram & WhatsApp Groups",
    description: "Drop a test link in your study group. Students compete against peers. The group buzzes with rank comparisons — organic engagement you can't buy.",
    cta: "Start Free",
    href: "/login",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function UseCases() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wider uppercase">
            Use Cases
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Built for how you teach
          </h2>
          <p className="text-sm sm:text-base text-text-secondary mt-3 max-w-xl mx-auto">
            Whether you teach on YouTube, run a coaching batch, or tutor
            one-on-one — TestLink fits your workflow.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4 sm:gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {useCases.map((uc) => (
            <motion.div
              key={uc.title}
              variants={item}
              className="bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7 flex flex-col"
            >
              <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                {uc.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">
                {uc.description}
              </p>
              <Link
                href={uc.href}
                className="text-sm font-medium text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1.5"
              >
                {uc.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
