import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AboutContent } from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "About — TestLink | Built for Indian Independent Educators",
  description:
    "TestLink is a creator-first test platform for India's independent educators. We believe every teacher — from YouTube educators to private tutors — deserves modern test infrastructure.",
  openGraph: {
    title: "About — TestLink",
    description:
      "Built for Indian independent educators. From YouTube teachers to coaching institutes.",
  },
  alternates: { canonical: "https://testlink.in/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
