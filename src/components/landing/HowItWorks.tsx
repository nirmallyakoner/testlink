"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

        {/* Visual representation: Messy -> Clean */}
        <motion.div
          className="bg-surface border border-border rounded-2xl p-4 sm:p-8 mb-12 sm:mb-20 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-6 sm:gap-8">
            {/* Messy Input */}
            <div className="flex-1 bg-bg/50 rounded-xl p-4 sm:p-6 border border-border/50 relative">
              <span className="absolute -top-3 left-4 bg-surface text-[10px] sm:text-xs font-semibold text-text-muted px-2 py-0.5 rounded border border-border">
                Your Messy Input
              </span>
              <pre className="text-[10px] sm:text-xs font-mono text-text-secondary/70 whitespace-pre-wrap mt-2 overflow-hidden h-[150px] sm:h-[180px]" style={{ maskImage: "linear-gradient(to bottom, black 50%, transparent)" }}>
                {`Q1. who is the president of india??
a) ramanath kovind
b) droupadi murmu
C Narendra modi -> D none

2) what is capital of MP
i. bhopal ii indore 
(3) jabalpur, 4 ujjain

Q3 ...`}
              </pre>
            </div>

            {/* Arrow/AI indicator */}
            <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-12">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
              <div className="absolute w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center -translate-y-1/2 shadow-[0_0_15px_rgba(230,57,70,0.4)]">
                <span className="text-xs">✨</span>
              </div>
            </div>
            
            {/* Mobile Arrow */}
            <div className="md:hidden flex justify-center -my-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(230,57,70,0.4)]">
                <span className="text-xs">✨</span>
              </div>
            </div>

            {/* Clean Output */}
            <div className="flex-1 bg-surface-2 rounded-xl p-4 sm:p-6 border border-primary/20 relative shadow-[0_0_30px_rgba(230,57,70,0.05)]">
               <span className="absolute -top-3 left-4 bg-primary text-[10px] sm:text-xs font-semibold text-white px-2 py-0.5 rounded shadow-sm">
                Generated Test
              </span>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-mono font-bold text-text-muted bg-surface px-1.5 py-0.5 rounded shrink-0">1</span>
                  <p className="text-[11px] sm:text-sm font-medium text-text leading-tight">Who is the President of India?</p>
                </div>
                <div className="space-y-1.5 ml-6">
                  {["Ram Nath Kovind", "Droupadi Murmu", "Narendra Modi", "None"].map((opt, i) => (
                    <div key={opt} className={cn("text-[10px] sm:text-xs px-2 py-1.5 rounded-md border", i === 1 ? "border-success/40 bg-success/10 text-success font-medium" : "border-border/50 text-text-secondary bg-surface/50")}>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
