"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    step: "1",
    title: "Go to testlink.in and click \"Get Started\"",
    description: "You'll be prompted to sign in with your Google account. No forms to fill. No passwords to remember. Just select your Google account and you're in.",
    tip: "Use the same Google account you use daily — this becomes your educator profile.",
  },
  {
    step: "2",
    title: "Paste your questions in the text area",
    description: "Copy your MCQ questions from wherever they are — a Word document, a PDF, a notes app, even a WhatsApp message. Paste them into the large text area on the Create page.",
    tip: "Don't worry about formatting. TestLink AI handles numbered lists, bulleted lists, tabular formats, and even messy copy-paste from PDFs.",
  },
  {
    step: "3",
    title: "Click \"Parse Questions\" and let AI do the work",
    description: "TestLink sends your text to an AI parser that identifies each question, extracts the options (A, B, C, D), and detects the correct answer. This takes about 3-5 seconds for 50 questions.",
    tip: "If the AI can't detect an answer for some questions, they'll be flagged with an orange indicator. Simply click the correct option to mark them.",
  },
  {
    step: "4",
    title: "Review, set a title, and publish",
    description: "Check the parsed questions to make sure everything looks right. Give your test a descriptive title (e.g., 'NORCET Mock Test - Anatomy & Physiology'). Click \"Publish Test\".",
    tip: "The title becomes part of your test URL — keep it descriptive so students know what to expect.",
  },
  {
    step: "5",
    title: "Copy the link and share it",
    description: "Your test link is generated instantly and auto-copied to your clipboard. Share this link on WhatsApp, Telegram, YouTube description, or anywhere your students are.",
    tip: "The link format is testlink.in/t/your-test-name — clean and professional.",
  },
];

const faq = [
  {
    q: "Do I need to install anything?",
    a: "No. TestLink is a web app. You access it from any browser on phone or laptop. Nothing to install, ever.",
  },
  {
    q: "Can I create tests from my phone?",
    a: "Yes. The entire flow — pasting questions, reviewing, publishing — works perfectly on mobile browsers.",
  },
  {
    q: "What format should my questions be in?",
    a: "Any format. Numbered, bulleted, tabular, even messy PDFs. TestLink AI handles all of them. You don't need to follow any template.",
  },
  {
    q: "Is there a limit on the number of questions?",
    a: "You can paste up to 50,000 characters per test, which comfortably fits 100-200 MCQs. There's no limit on the number of tests you create.",
  },
  {
    q: "Do students need to install anything?",
    a: "No. Students click your link, sign in with Google, and start the test. Works on any phone with a browser.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Unlimited tests, AI parsing, live leaderboards — all free. Up to 100 students per test on the free plan.",
  },
];

// JSON-LD for HowTo schema (rich snippet in Google)
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create an Online Test in 60 Seconds",
  description: "Step-by-step guide to creating a free online MCQ test with a shareable link and live leaderboard using TestLink.",
  totalTime: "PT1M",
  tool: { "@type": "HowToTool", name: "TestLink (testlink.in)" },
  step: steps.map((s) => ({
    "@type": "HowToStep",
    position: parseInt(s.step),
    name: s.title,
    text: s.description,
  })),
};

export function HowToCreateContent() {
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-28">
      {/* HowTo structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <motion.p
          className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          Step-by-Step Guide
        </motion.p>
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          How to create an online test
          <br />
          <span className="gradient-text">in 60 seconds</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          No technical knowledge. No templates. No app downloads. Just paste
          your questions and get a shareable link with a live leaderboard.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="space-y-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className="bg-surface border border-border rounded-xl p-5 sm:p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-sm font-mono font-bold text-bg bg-primary w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-text mb-2">
                    {s.title}
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    {s.description}
                  </p>
                  <p className="text-xs text-text-muted bg-surface-2 border border-border rounded-lg px-3 py-2">
                    <span className="font-semibold text-text-secondary">Tip:</span> {s.tip}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-text mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-xl p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <h3 className="text-sm font-semibold text-text mb-1.5">{f.q}</h3>
              <p className="text-sm text-text-secondary">{f.a}</p>
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
          Ready to try it yourself?
        </h2>
        <p className="text-sm sm:text-base text-text-secondary mb-8">
          It takes less time to create a test than to read this guide.
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
