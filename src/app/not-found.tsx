import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-8xl font-black font-mono gradient-text mb-4">404</p>
        <h1 className="text-xl font-bold text-text mb-2">Page not found</h1>
        <p className="text-sm text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="gradient-primary text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(230,57,70,0.2)]"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text border border-border hover:border-border-hover px-6 py-2.5 rounded-xl transition-colors"
          >
            Create a Test
          </Link>
        </div>
      </div>
    </div>
  );
}
