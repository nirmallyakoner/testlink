"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-5">
          Your students are waiting
          <br />
          <span className="gradient-text">to see their rank.</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-8 sm:mb-10">
          Create your first test in 60 seconds. Free forever for up to 100
          students per test. No credit card.
        </p>
        <Link
          href="/login"
          className="inline-block gradient-primary text-white font-semibold text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:shadow-[0_0_60px_rgba(230,57,70,0.45)] transition-all duration-300 hover:-translate-y-0.5"
        >
          Get Started — It&apos;s Free
        </Link>
      </motion.div>
    </section>
  );
}
