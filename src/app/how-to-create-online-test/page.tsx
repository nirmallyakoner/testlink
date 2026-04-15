import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HowToCreateContent } from "@/components/pages/HowToCreateContent";

export const metadata: Metadata = {
  title: "How to Create an Online Test in 60 Seconds — Free Guide | TestLink",
  description:
    "Step-by-step guide to creating a free online MCQ test with a shareable link and live leaderboard. No technical knowledge needed. Works on phone and laptop. Perfect for educators, tutors, and coaching institutes.",
  keywords: [
    "how to create online test",
    "how to make MCQ test link",
    "create test link free",
    "make online test for students",
    "share test on WhatsApp",
    "online test maker tutorial",
    "create mock test online free",
    "how to make quiz link",
    "test link generator guide",
  ],
  openGraph: {
    title: "How to Create an Online Test in 60 Seconds",
    description: "Free step-by-step guide. No technical skills needed. Paste questions, get a test link.",
  },
  alternates: { canonical: "https://testlink.in/how-to-create-online-test" },
};

export default function HowToCreatePage() {
  return (
    <>
      <Navbar />
      <main><HowToCreateContent /></main>
      <Footer />
    </>
  );
}
