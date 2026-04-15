import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Comparison } from "@/components/landing/Comparison";
import { UseCases } from "@/components/landing/UseCases";
import { FAQ } from "@/components/landing/FAQ";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

// FAQ structured data for Google rich results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is TestLink really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Unlimited tests, AI question parsing, live leaderboards, and student analytics — all free. The free plan supports up to 100 students per test.",
      },
    },
    {
      "@type": "Question",
      name: "Do students need to download an app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Students click the test link, sign in with Google in one tap, and start the test. Everything works in the browser.",
      },
    },
    {
      "@type": "Question",
      name: "What format should my questions be in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any format. Numbered lists, bulleted lists, tabular data, even messy copy-paste from PDFs. Our AI parser handles all of it — English, Hindi, and mixed languages.",
      },
    },
    {
      "@type": "Question",
      name: "How does the leaderboard work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When a student submits their test, they see their rank among all students who have taken that test. Rankings are based on score first, then time taken. The leaderboard updates in real-time.",
      },
    },
    {
      "@type": "Question",
      name: "Can I see who took my test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your analytics dashboard shows every student's username, rank, score, and time taken.",
      },
    },
    {
      "@type": "Question",
      name: "What about student privacy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Students sign in with Google, and we display only their generated username (not their email) on leaderboards. Educators can see usernames and scores, but not student email addresses.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Comparison />
        <UseCases />
        <FAQ />
        <BlogPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
