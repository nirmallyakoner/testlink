import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://testlink.in"),
  title: {
    default: "TestLink — Instant Test Links for Educators | AI-Powered MCQ Platform",
    template: "%s | TestLink",
  },
  description:
    "Create shareable MCQ test links in 60 seconds. AI-powered question parsing, live leaderboards, and instant results. Built for India's independent educators — YouTube teachers, coaching institutes, and private tutors.",
  keywords: [
    "test link generator",
    "online MCQ test maker",
    "create test link",
    "shareable test link",
    "live leaderboard test",
    "AI question parser",
    "mock test maker India",
    "nursing exam test creator",
    "competitive exam mock test",
    "online test for students",
    "YouTube educator tools",
    "coaching institute test platform",
    "free test maker",
    "Google Forms alternative for tests",
  ],
  authors: [{ name: "TestLink" }],
  creator: "TestLink",
  publisher: "TestLink",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://testlink.in",
    siteName: "TestLink",
    title: "TestLink — Instant Test Links for Educators",
    description:
      "Paste your questions, get a live test link. Students compete on a real-time leaderboard. Built for India's educators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestLink — Create shareable test links with live leaderboards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TestLink — Instant Test Links for Educators",
    description:
      "Paste your questions, get a live test link. Students compete on a real-time leaderboard.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://testlink.in",
  },
  category: "Education",
};

// JSON-LD structured data for rich Google results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TestLink",
  url: "https://testlink.in",
  description:
    "Create shareable MCQ test links in 60 seconds with AI-powered question parsing and live leaderboards.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    description: "Free forever for educators",
  },
  creator: {
    "@type": "Organization",
    name: "TestLink",
    url: "https://testlink.in",
  },
  featureList: [
    "AI-powered MCQ question parsing",
    "Live student leaderboard",
    "Instant shareable test links",
    "Student analytics dashboard",
    "Google OAuth authentication",
    "Mobile-first responsive design",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "teacher",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07070C" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
