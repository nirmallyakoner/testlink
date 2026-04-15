import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { NursingExamsContent } from "@/components/pages/NursingExamsContent";

export const metadata: Metadata = {
  title: "Mock Tests for Nursing Exams — NORCET, AIIMS, Staff Nurse | TestLink",
  description:
    "Create mock tests for NORCET, AIIMS BSc Nursing, Staff Nurse Recruitment, and all nursing competitive exams. AI parses your questions, students compete on a live leaderboard. Free for all nursing educators.",
  keywords: [
    "NORCET mock test",
    "AIIMS nursing mock test",
    "staff nurse exam practice",
    "nursing MCQ test online",
    "nursing competitive exam",
    "free nursing mock test creator",
    "nursing question bank test link",
    "NORCET preparation test",
    "BSc nursing entrance test",
    "nursing leaderboard test",
  ],
  openGraph: {
    title: "Mock Tests for Nursing Exams — TestLink",
    description:
      "Create NORCET, AIIMS, and Staff Nurse mock tests with AI. Students compete on a live leaderboard.",
  },
  alternates: { canonical: "https://testlink.in/use-cases/nursing-exams" },
};

export default function NursingExamsPage() {
  return (
    <>
      <Navbar />
      <main><NursingExamsContent /></main>
      <Footer />
    </>
  );
}
