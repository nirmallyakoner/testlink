import Link from "next/link";

export const metadata = {
  title: "Educator Access Only — TestLink",
  robots: { index: false, follow: false }, // not-educator page should not be indexed
};

export default function NotEducatorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-black text-primary font-display">T</span>
        </div>

        <h1 className="text-2xl font-bold text-text mb-3">
          Educator Access Only
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          The dashboard is for educators only. If you are a student,
          open the test link your teacher shared with you.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Sign in as Educator instead
          </Link>
        </div>
      </div>
    </div>
  );
}
