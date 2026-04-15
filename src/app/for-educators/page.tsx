import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ForEducatorsContent } from "@/components/pages/ForEducatorsContent";

export const metadata: Metadata = {
  title: "For Educators — TestLink | Create Shareable Tests in 60 Seconds",
  description:
    "YouTube educators, private tutors, coaching institutes — create MCQ test links instantly. AI parses your questions, students compete on a live leaderboard, and you track every result.",
  keywords: [
    "test link for educators",
    "YouTube teacher test maker",
    "online MCQ test generator India",
    "coaching institute test platform",
    "shareable test link WhatsApp",
    "free test creator for tutors",
    "nursing exam mock test maker",
    "competitive exam test link",
  ],
  openGraph: {
    title: "For Educators — TestLink",
    description:
      "Create MCQ test links in 60 seconds. AI parses your questions. Students compete on a live leaderboard.",
  },
  alternates: { canonical: "https://testlink.in/for-educators" },
};

export default function ForEducatorsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ForEducatorsContent />
      </main>
      <Footer />
    </>
  );
}
