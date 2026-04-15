"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const posts = [
  {
    slug: "why-educators-switching-from-google-forms",
    title: "Why Indian Educators Are Switching from Google Forms",
    excerpt: "Google Forms was the default. But for competitive mock tests — educators need leaderboards, timers, and real analytics.",
    tag: "Industry",
    date: "Apr 12",
  },
  {
    slug: "create-mock-test-60-seconds",
    title: "Create a Mock Test in 60 Seconds — A Step-by-Step Guide",
    excerpt: "From copy-paste to a shareable test link with a live leaderboard. No technical knowledge needed.",
    tag: "Tutorial",
    date: "Apr 8",
  },
];

export function BlogPreview() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-xs sm:text-sm font-medium text-primary mb-2 tracking-wider uppercase">
              From the Blog
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Insights for educators
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-text-secondary hover:text-text transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:border-border-hover transition-all duration-200 group h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-xs text-text-muted">{post.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-text group-hover:text-primary-light transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
