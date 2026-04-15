"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />

      {/* Gradient orb behind heading */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-primary/8 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-24">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium text-text-secondary bg-surface border border-border rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-live" />
            Now live — free for all educators
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Paste questions.
          <br />
          <span className="gradient-text">Get a test link.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-sm sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ditch Google Forms. Turn messy PDFs into a shareable test link with a live
          leaderboard in 60 seconds using AI. Students compete for rank — no app download required.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/login"
            className="w-full sm:w-auto text-center gradient-primary text-white font-semibold text-sm sm:text-base px-8 py-3 sm:py-3.5 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_50px_rgba(230,57,70,0.45)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Create Your First Test
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto text-center text-text-secondary font-medium text-sm sm:text-base px-6 py-3 sm:py-3.5 rounded-xl border border-border hover:border-border-hover hover:text-text transition-all duration-200"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          className="mt-8 sm:mt-10 text-xs sm:text-sm text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Free forever for up to 100 students per test
        </motion.p>

        {/* Demo preview card */}
        <motion.div
          className="mt-10 sm:mt-16 mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
            <div className="bg-surface-2 rounded-lg sm:rounded-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-text-muted/30" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-text-muted/30" />
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-text-muted/30" />
                </div>
                <div className="flex-1 mx-2 sm:mx-4 min-w-0">
                  <div className="bg-bg rounded-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-text-muted font-mono text-center truncate">
                    testlink.in/t/norcet-mock-oct-1
                  </div>
                </div>
              </div>

              {/* Leaderboard preview */}
              <div className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-text-muted mb-0.5 sm:mb-1 truncate">
                      NORCET Nursing Mock Test
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-text">
                      Live Leaderboard
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-text-muted shrink-0 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-live" />
                    <span className="hidden sm:inline">1,247 students</span>
                    <span className="sm:hidden">1,247</span>
                  </div>
                </div>

                {/* Mock leaderboard rows */}
                <div className="space-y-1.5 sm:space-y-2 relative h-[140px] sm:h-[160px] overflow-hidden">
                  {[
                    { rank: 1, name: "Ramesh K.", score: "50/50", time: "18:02", delay: 1.0 },
                    { rank: 2, name: "Priya S.", score: "49/50", time: "21:44", delay: 1.2 },
                    { rank: 3, name: "Aarav M.", score: "48/50", time: "19:33", delay: 1.4 },
                    { rank: 4, name: "Sneha P.", score: "47/50", time: "17:15", delay: 1.6 },
                  ].map((row) => (
                    <motion.div
                      key={row.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: row.delay, ease: "easeOut" }}
                      className="flex items-center gap-2 sm:gap-3 bg-bg/50 rounded-lg px-2.5 sm:px-4 py-2 sm:py-2.5"
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] sm:text-xs font-bold min-w-[24px] sm:min-w-[28px] h-5 sm:h-6 flex items-center justify-center rounded-full shrink-0",
                          row.rank === 1 && "bg-gold/15 text-gold",
                          row.rank === 2 && "bg-silver/15 text-silver",
                          row.rank === 3 && "bg-bronze/15 text-bronze",
                          row.rank > 3 && "bg-surface-2 text-text-secondary"
                        )}
                      >
                        #{row.rank}
                      </span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-primary shrink-0">
                        {row.name[0]}
                      </div>
                      <span className="text-xs sm:text-sm text-text flex-1 truncate">
                        {row.name}
                      </span>
                      <span className="text-xs sm:text-sm font-mono font-medium text-text-secondary shrink-0">
                        {row.score}
                      </span>
                      <span className="text-[10px] sm:text-xs text-text-muted font-mono shrink-0 hidden xs:inline">
                        {row.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
