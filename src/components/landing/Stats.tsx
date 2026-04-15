"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "60s", label: "To create a test" },
  { value: "1 click", label: "To share on WhatsApp" },
  { value: "0", label: "App downloads needed" },
  { value: "Free", label: "Forever for educators" },
];

export function Stats() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 border-y border-border">
      <motion.div
        className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl sm:text-4xl font-black font-mono gradient-text mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-text-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
