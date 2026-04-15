import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — TestLink",
  description: "How TestLink collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-muted mb-10">
            Last updated: April 15, 2026
          </p>

          <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Information We Collect
              </h2>
              <p className="mb-3">
                When you sign in with Google, we receive your name, email
                address, and profile photo from Google. This is the only
                personal information we collect.
              </p>
              <p>
                When students take a test, we store their answers, scores, time
                taken, and the test they participated in. This data is used to
                generate leaderboards and analytics.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To create and manage your account</li>
                <li>To display your name on leaderboards (using a generated username, not your full name or email)</li>
                <li>To provide educators with test analytics (student usernames and scores)</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                What Educators Can See
              </h2>
              <p>
                Educators can see student usernames (derived from your name),
                avatar, score, rank, and time taken for their tests. In the
                current version, educators cannot see student email addresses.
                Email addresses are stored securely and are not shared with
                educators.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Data Storage and Security
              </h2>
              <p>
                Your data is stored securely on Supabase infrastructure with
                row-level security policies. We use HTTPS for all data
                transmission. We do not sell your data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Cookies and Tracking
              </h2>
              <p>
                We use essential cookies for authentication sessions only. We do
                not use third-party tracking cookies or analytics trackers.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Data Deletion
              </h2>
              <p>
                You can request deletion of your account and all associated data
                by contacting us at privacy@testlink.in. We will process deletion
                requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Contact
              </h2>
              <p>
                For privacy-related questions, contact us at privacy@testlink.in.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
