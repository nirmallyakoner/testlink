import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingContent } from "@/components/pages/PricingContent";

export const metadata: Metadata = {
  title: "Pricing — TestLink | Free Test Link Generator for Educators",
  description:
    "TestLink is free forever for educators. Create unlimited tests, up to 100 students per test, AI question parsing, and live leaderboards — all at no cost.",
  keywords: [
    "free online test maker",
    "free MCQ generator",
    "free test link creator",
    "TestLink pricing",
    "free educator tools",
  ],
  openGraph: {
    title: "Pricing — TestLink",
    description: "Free forever. Unlimited tests. Up to 100 students per test.",
  },
  alternates: { canonical: "https://testlink.in/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricingContent />
      </main>
      <Footer />
    </>
  );
}
