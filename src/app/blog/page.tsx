import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — TestLink | Insights for Indian Educators",
  description:
    "Articles, guides, and insights on building tests, growing your student audience, and using technology as an independent educator in India.",
  alternates: { canonical: "https://testlink.in/blog" },
};

const posts = [
  {
    slug: "why-educators-switching-from-google-forms",
    title: "Why Indian Educators Are Switching from Google Forms to Test Links",
    excerpt:
      "Google Forms was the default. But for mock tests with leaderboards, timers, and analytics — educators need something built for competition.",
    date: "April 12, 2026",
    readTime: "6 min read",
    tag: "Industry",
  },
  {
    slug: "create-mock-test-60-seconds",
    title: "How to Create a Mock Test in 60 Seconds (No Technical Knowledge Needed)",
    excerpt:
      "A complete walkthrough of creating your first AI-parsed test link with TestLink. From pasting questions to sharing on WhatsApp in under a minute.",
    date: "April 8, 2026",
    readTime: "5 min read",
    tag: "Tutorial",
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm font-medium text-primary mb-3 tracking-wider uppercase">
              Blog
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Insights for educators
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-xl">
              Guides, case studies, and thinking on how independent educators
              in India can grow with modern test infrastructure.
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-surface border border-border rounded-xl sm:rounded-2xl p-5 sm:p-7 hover:border-border-hover transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-xs text-text-muted">{post.date}</span>
                  <span className="text-xs text-text-muted">{post.readTime}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-text group-hover:text-primary-light transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
