import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeaturesPageContent } from "@/components/pages/FeaturesPageContent";

export const metadata: Metadata = {
  title: "Features — TestLink | AI-Powered Test Link Generator",
  description:
    "AI question parsing, live leaderboards, instant sharing, student analytics, mobile-first design. Everything an educator needs to create and share tests in 60 seconds.",
  keywords: [
    "online test maker features",
    "AI MCQ parser",
    "live leaderboard test",
    "share test link WhatsApp",
    "student analytics platform",
    "mobile test app India",
  ],
  openGraph: {
    title: "Features — TestLink",
    description:
      "AI question parsing, live leaderboards, instant sharing, and student analytics. Built for India's educators.",
  },
  alternates: { canonical: "https://testlink.in/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        <FeaturesPageContent />
      </main>
      <Footer />
    </>
  );
}
