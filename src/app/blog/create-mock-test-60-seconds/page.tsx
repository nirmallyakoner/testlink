import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Create a Mock Test in 60 Seconds — No Technical Knowledge Needed",
  description:
    "Complete walkthrough for educators: create an AI-parsed MCQ test link with a live leaderboard and share it on WhatsApp. From copy-paste to shareable link in under a minute.",
  keywords: [
    "create mock test online",
    "how to make test link",
    "make mock test for students",
    "online test sharing WhatsApp",
    "AI test maker tutorial",
    "free mock test generator",
    "create MCQ test in 1 minute",
  ],
  openGraph: {
    type: "article",
    title: "How to Create a Mock Test in 60 Seconds",
    description: "From copy-paste to shareable link in under a minute. No technical knowledge needed.",
    publishedTime: "2026-04-08T00:00:00Z",
  },
  alternates: { canonical: "https://testlink.in/blog/create-mock-test-60-seconds" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Create a Mock Test in 60 Seconds (No Technical Knowledge Needed)",
  description: "Complete walkthrough for educators: create an AI-parsed MCQ test link with a live leaderboard.",
  datePublished: "2026-04-08T00:00:00Z",
  author: { "@type": "Organization", name: "TestLink" },
  publisher: { "@type": "Organization", name: "TestLink", url: "https://testlink.in" },
  mainEntityOfPage: "https://testlink.in/blog/create-mock-test-60-seconds",
};

export default function BlogPost2() {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                Tutorial
              </span>
              <span className="text-xs text-text-muted">April 8, 2026</span>
              <span className="text-xs text-text-muted">5 min read</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text mb-4 leading-tight">
              How to Create a Mock Test in 60 Seconds (No Technical Knowledge Needed)
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              If you&apos;re an educator with questions in a document and students
              on WhatsApp — this guide will show you how to convert one into
              the other in under a minute.
            </p>
          </div>

          {/* Body */}
          <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Before you start
              </h2>
              <p>
                You need two things:
              </p>
              <ol className="mt-3 space-y-2.5 list-decimal list-inside">
                <li>A Google account (the same one you use for Gmail or YouTube)</li>
                <li>Your questions — in any format, in any document</li>
              </ol>
              <p className="mt-3">
                That&apos;s it. No software to install. No accounts to create. No
                templates to download.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Step 1: Sign in (0-10 seconds)
              </h2>
              <p>
                Go to <strong className="text-text">testlink.in</strong> and click
                &quot;Get Started.&quot; You&apos;ll see a Google sign-in prompt. Select your
                account. Done. You&apos;re now on the educator dashboard.
              </p>
              <p className="mt-3">
                No email verification. No password creation. No OTP. Just your
                Google account.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Step 2: Paste your questions (10-20 seconds)
              </h2>
              <p>
                Click &quot;Create Test.&quot; You&apos;ll see a large text area. Go to your
                question source — a Word document, a PDF, a Google Doc, even a
                WhatsApp message — and copy all your MCQs.
              </p>
              <p className="mt-3">
                Paste them into the text area. Don&apos;t worry about formatting.
              </p>
              <div className="bg-surface border border-border rounded-xl p-5 my-4">
                <p className="text-xs font-semibold text-text mb-2">
                  Example of what you can paste:
                </p>
                <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap leading-relaxed">{`1. What is the normal range of hemoglobin in adult males?
a) 11-13 g/dL
b) 13-17 g/dL
c) 17-20 g/dL
d) 8-11 g/dL
Answer: b

2. Which of the following is NOT a function of the liver?
a) Bile production
b) Glycogen storage
c) Insulin secretion
d) Detoxification
Ans: c`}</pre>
              </div>
              <p>
                Numbered, bulleted, with &quot;Answer:&quot; or &quot;Ans:&quot; — any format works.
                You can even paste messy text with inconsistent formatting. The AI
                handles it.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Step 3: Let AI parse the questions (20-25 seconds)
              </h2>
              <p>
                Click &quot;Parse Questions.&quot; TestLink sends your text to a GPT-4o-mini
                powered parser that:
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Identifies each individual question",
                  "Extracts all options (A, B, C, D)",
                  "Detects the correct answer from your text",
                  "Flags any question where the answer wasn't found",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                For 50 questions, this takes about 3-5 seconds. You&apos;ll see a
                preview of all parsed questions with nicely formatted cards.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Step 4: Review and fix (25-45 seconds)
              </h2>
              <p>
                Scroll through the parsed questions. Each one shows the
                question text, all four options, and a green badge on the
                correct answer.
              </p>
              <p className="mt-3">
                If any question has an orange &quot;No answer detected&quot; badge, just
                click the correct option to mark it. The AI is right 95% of
                the time, so you usually only need to fix 2-3 questions per
                test.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Step 5: Publish and share (45-60 seconds)
              </h2>
              <p>
                Give your test a title — something descriptive like &quot;NORCET
                Mock Test 1 — Anatomy &amp; Physiology.&quot; Click &quot;Publish Test.&quot;
              </p>
              <p className="mt-3">
                Your test link is generated instantly and auto-copied to your
                clipboard. The link format looks like:
              </p>
              <div className="bg-surface-2 rounded-lg px-4 py-2.5 font-mono text-sm text-text my-3 text-center">
                testlink.in/t/norcet-mock-1-anatomy
              </div>
              <p>
                Open WhatsApp, paste the link in your group, and send. When
                students tap the link, they&apos;ll see a clean landing page with
                the test title and a &quot;Sign in with Google to Start&quot; button.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                What happens when students take the test
              </h2>
              <p>
                From the student side, the experience is:
              </p>
              <ol className="mt-3 space-y-2 list-decimal list-inside">
                <li>Click the link in WhatsApp</li>
                <li>Tap &quot;Sign in with Google&quot; (one button, no forms)</li>
                <li>Start the test immediately (countdown timer begins)</li>
                <li>Answer all questions and submit</li>
                <li>See their rank on a live leaderboard with all other students</li>
              </ol>
              <p className="mt-3">
                The rank reveal is the key moment. Students see &quot;You ranked
                #47 out of 1,200 students&quot; with a large, animated number.
                Below it, a scrollable leaderboard shows all students with
                their scores and times. Their own row is highlighted.
              </p>
              <p className="mt-3">
                This is what drives sharing. Students screenshot their rank
                and post it on Instagram stories or WhatsApp status. Every
                share brings new students to your next test.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                What you see as the educator
              </h2>
              <p>
                Back on your dashboard, you&apos;ll see real-time analytics for
                every test:
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  "Total attempts — how many students took the test",
                  "Average score — how your students performed overall",
                  "Score distribution — visual bars showing the spread from 0-100%",
                  "Student list — every student's rank, username, score, and time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                No spreadsheets. No manual tallying. Everything updates in
                real-time as students submit.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                Tips for your first test
              </h2>
              <div className="space-y-3">
                {[
                  { tip: "Start small", desc: "Paste 10-20 questions for your first test. Once you see how fast it works, scale up to 50-100." },
                  { tip: "Use the test title wisely", desc: "Include the exam name and topic — 'NORCET Mock - Microbiology'. This helps students identify the test." },
                  { tip: "Share at peak times", desc: "Drop the link in your WhatsApp group when most students are online — usually 8-10 PM IST for competitive exam aspirants." },
                  { tip: "Create weekly tests", desc: "Consistency builds habit. Weekly mock tests keep your students engaged and coming back to your channel." },
                ].map((t) => (
                  <div key={t.tip} className="bg-surface border border-border rounded-lg p-4">
                    <p className="text-sm font-semibold text-text mb-1">{t.tip}</p>
                    <p className="text-sm text-text-secondary">{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 sm:mt-16 bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-text mb-3">
              60 seconds. That&apos;s all it takes.
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              Your first test is free. No setup. No downloads. Just your questions and a Google account.
            </p>
            <Link
              href="/login"
              className="inline-block gradient-primary text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(230,57,70,0.2)]"
            >
              Create Your First Test Now
            </Link>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
              Back to all posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
