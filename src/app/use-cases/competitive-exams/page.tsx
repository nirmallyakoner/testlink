import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CompetitiveExamsContent } from "@/components/pages/CompetitiveExamsContent";

export const metadata: Metadata = {
  title: "Mock Tests for Competitive Exams — UPSC, SSC, JEE, NEET | TestLink",
  description:
    "Create free mock tests for UPSC, SSC, JEE, NEET, State PSC, Banking, and all competitive exams in India. AI-powered question parsing, live leaderboards, and instant test links. Perfect for coaching institutes and YouTube educators.",
  keywords: [
    "UPSC mock test creator",
    "SSC mock test online free",
    "JEE mock test link",
    "NEET practice test maker",
    "competitive exam test generator",
    "free mock test platform India",
    "coaching institute test maker",
    "state PSC mock test",
    "bank exam practice test",
    "online test with leaderboard",
  ],
  openGraph: {
    title: "Mock Tests for Competitive Exams — TestLink",
    description: "Create UPSC, SSC, JEE, NEET mock tests with AI. Students compete on a live leaderboard.",
  },
  alternates: { canonical: "https://testlink.in/use-cases/competitive-exams" },
};

export default function CompetitiveExamsPage() {
  return (
    <>
      <Navbar />
      <main><CompetitiveExamsContent /></main>
      <Footer />
    </>
  );
}
