import Link from "next/link";

const productLinks = [
  { label: "Features", href: "/features" },
  { label: "For Educators", href: "/for-educators" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-to-create-online-test" },
];

const useCaseLinks = [
  { label: "Nursing Exams", href: "/use-cases/nursing-exams" },
  { label: "Competitive Exams", href: "/use-cases/competitive-exams" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="text-text font-semibold text-sm">TestLink</span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed max-w-[200px]">
              Instant test links for India&apos;s independent educators. Paste.
              Publish. Share.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Product
            </p>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Company
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Get Started
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-text-secondary hover:text-text transition-colors"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-primary hover:text-primary-light transition-colors"
                >
                  Create a Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Use Cases
            </p>
            <ul className="space-y-2">
              {useCaseLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            Built for Indian educators
          </p>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} TestLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
