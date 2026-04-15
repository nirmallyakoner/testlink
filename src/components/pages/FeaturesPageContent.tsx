"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    tag: "AI Parsing",
    title: "Paste anything. We structure it.",
    description:
      "Educators paste questions in any format — numbered, bulleted, tabular, even copy-pasted from messy PDFs. Our GPT-4o-mini powered parser reads the intent, cleans up the text, and returns structured MCQs with options and answers identified.",
    details: [
      "Handles English, Hindi, and mixed-language questions",
      "Detects answer keys even when inconsistently formatted",
      "Flags questions with missing answers for manual selection",
      "Processes 50 questions in under 3 seconds",
    ],
  },
  {
    tag: "Live Leaderboard",
    title: "Real-time rankings that drive competition.",
    description:
      "The moment a student submits, they see their rank among all students who have taken the test. The leaderboard updates in real-time — creating a competitive, engaging experience that students share with their friends.",
    details: [
      "Auto-refreshing leaderboard every 15 seconds",
      "Gold, Silver, Bronze badges for top 3",
      "Rank at time of submission preserved on result page",
      "Score + time taken determines final ranking",
    ],
  },
  {
    tag: "Zero Friction",
    title: "Link to first question in under 60 seconds.",
    description:
      "No app downloads. No registration forms. No OTPs. Students click the shared link, tap 'Sign in with Google', and they're immediately in the test. This is critical for the Indian market where every extra step loses 30% of users.",
    details: [
      "Google OAuth only — one tap to start",
      "Works on any browser, any device",
      "No app installation required",
      "Optimized for 3G/4G connections on budget phones",
    ],
  },
  {
    tag: "Analytics",
    title: "Understand your audience without surveys.",
    description:
      "Every test generates rich analytics: total attempts, average scores, time distributions, and a ranked list of every student who participated. Educators see exactly how their content performs and where students struggle.",
    details: [
      "Score distribution charts (0-20%, 21-40%, etc.)",
      "Average completion time per test",
      "Completion rate tracking",
      "Ranked student list with usernames and scores",
    ],
  },
  {
    tag: "Universal Sharing",
    title: "One link. Every platform.",
    description:
      "TestLink generates a single URL that works everywhere. Share it on WhatsApp groups, Telegram channels, YouTube descriptions, Instagram bios, or email newsletters. The link opens directly in the browser — no app switching needed.",
    details: [
      "Auto-copied to clipboard on publish",
      "Clean URLs: testlink.in/t/your-test-name",
      "Open Graph meta tags for rich previews",
      "Works in WhatsApp, Telegram, YouTube, Instagram",
    ],
  },
  {
    tag: "Mobile-First",
    title: "Built for the phones your students actually use.",
    description:
      "80% of Indian students will open your test on a mid-range Android phone. Every screen in TestLink is designed for 375px width first, then scales up. Touch targets are large. Load times are fast. Data usage is minimal.",
    details: [
      "Optimized for 375px screens (Redmi, Moto, Realme)",
      "Large tap targets for accurate option selection",
      "Minimal data usage — no heavy assets",
      "Session stored locally to survive network drops",
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesPageContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Features
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Built for speed.
          <br />
          <span className="text-text-secondary">Designed for educators.</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Every feature in TestLink exists because an educator needed it.
          No bloat. No complexity. Just the fastest path from question bank to
          shareable test link.
        </motion.p>
      </div>

      {/* Feature blocks */}
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.tag}
            variants={item}
            className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10"
          >
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/8 px-2.5 py-1 rounded-full mb-4 sm:mb-5">
              {feature.tag}
            </span>

            <h2 className="text-xl sm:text-2xl font-bold text-text mb-3">
              {feature.title}
            </h2>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-5 sm:mb-6 max-w-3xl">
              {feature.description}
            </p>

            <ul className="grid sm:grid-cols-2 gap-2 sm:gap-3">
              {feature.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-start gap-2.5 text-sm text-text-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center mt-16 sm:mt-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to create your first test?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          Free forever for up to 100 students per test. No credit card required.
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
