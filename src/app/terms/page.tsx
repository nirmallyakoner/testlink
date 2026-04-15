import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — TestLink",
  description: "Terms and conditions for using the TestLink platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-text-muted mb-10">
            Last updated: April 15, 2026
          </p>

          <div className="space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using TestLink, you agree to be bound by these
                Terms of Service. If you do not agree, do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Accounts
              </h2>
              <p className="mb-3">
                You must sign in with a valid Google account to use TestLink as
                an educator or student. You are responsible for all activity
                under your account.
              </p>
              <p>
                You must not create accounts for the purpose of spamming,
                harassment, or any illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Educator Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must own or have rights to the questions you upload</li>
                <li>You must not upload offensive, illegal, or harmful content</li>
                <li>You are responsible for the accuracy of your questions and answers</li>
                <li>You must not use the platform to collect student data for spam purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Student Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must not attempt to manipulate test results or leaderboard rankings</li>
                <li>You must not share test answers with other students during an active test</li>
                <li>You must use the platform for educational purposes only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Content Ownership
              </h2>
              <p>
                Educators retain full ownership of the questions and content
                they upload to TestLink. TestLink does not claim any ownership
                over user-generated content. However, by uploading content, you
                grant TestLink a license to host, display, and distribute that
                content to students who access your tests.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Service Availability
              </h2>
              <p>
                TestLink is provided &quot;as is&quot; without warranties. We do not
                guarantee 100% uptime. We may modify, suspend, or discontinue
                parts of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these terms. You may delete your account at any time by
                contacting support@testlink.in.
              </p>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-semibold text-text mb-3">
                Contact
              </h2>
              <p>
                For questions about these terms, contact us at legal@testlink.in.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
