import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Educator Access Only — TestLink",
  robots: { index: false, follow: false }, // not-educator page should not be indexed
};

export default function NotEducatorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Logo mark */}
        <Logo className="w-16 h-16 mx-auto mb-6 drop-shadow-xl" />

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
