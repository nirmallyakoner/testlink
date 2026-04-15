"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "Is TestLink really free?",
    a: "Yes. Unlimited tests, AI question parsing, live leaderboards, and student analytics — all free. The free plan supports up to 100 students per test.",
  },
  {
    q: "Do students need to download an app?",
    a: "No. Students click the test link, sign in with Google in one tap, and start the test. Everything works in the browser — no downloads needed.",
  },
  {
    q: "What format should my questions be in?",
    a: "Any format. Numbered lists, bulleted lists, tabular data, even messy copy-paste from PDFs. Our AI parser handles all of it — English, Hindi, and mixed languages.",
  },
  {
    q: "How does the leaderboard work?",
    a: "When a student submits their test, they see their rank among all students who have taken that test. Rankings are based on score first, then time taken. The leaderboard updates in real-time.",
  },
  {
    q: "Can I see who took my test?",
    a: "Yes. Your analytics dashboard shows every student's username, rank, score, and time taken. You see the full ranked list for every test you create.",
  },
  {
    q: "What about student privacy?",
    a: "Students sign in with Google, and we display only their generated username (not their email) on leaderboards. Educators can see usernames and scores, but not student email addresses.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3 tracking-wider uppercase">
            FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-surface border border-border rounded-xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-text mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
