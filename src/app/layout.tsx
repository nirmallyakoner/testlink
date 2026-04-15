import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://testlink.online"),
  title: {
    default: "Free Online Mock Test Maker | Create Shareable Links — TestLink",
    template: "%s | TestLink",
  },
  description:
    "Turn messy PDFs or notes into shareable MCQ test links in 60 seconds using AI. Live student leaderboards, instant analytics, mobile-first design. Better than Google Forms.",
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
    url: "https://testlink.online",
    siteName: "TestLink",
    title: "Free Online Mock Test Maker | Create Shareable Links",
    description:
      "Turn messy PDFs or notes into shareable MCQ test links in 60 seconds. AI parsing, live student leaderboards, instant analytics. Ditch Google Forms.",
    images: [
      {
        url: "https://testlink.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestLink — Create shareable test links with live leaderboards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Mock Test Maker | TestLink",
    description:
      "Paste your messy PDF questions and get a live, shareable test link instantly. Live leaderboards and analytics.",
    images: ["https://testlink.online/og-image.png"],
  },
  alternates: {
    canonical: "https://testlink.online",
  },
  category: "Education",
};

// JSON-LD structured data for rich Google results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TestLink",
  url: "https://testlink.online",
  description:
    "Create shareable MCQ test links in 60 seconds from PDF questions with AI-powered question parsing and live leaderboards.",
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
    url: "https://testlink.online",
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
