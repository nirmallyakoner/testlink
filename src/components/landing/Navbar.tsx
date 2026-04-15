"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "For Educators", href: "/for-educators" },
  { label: "Use Cases", href: "/use-cases/nursing-exams" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const mobileLinks = [
  { label: "Features", href: "/features" },
  { label: "For Educators", href: "/for-educators" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-to-create-online-test" },
];

const mobileUseCases = [
  { label: "Nursing Exams", href: "/use-cases/nursing-exams" },
  { label: "Competitive Exams", href: "/use-cases/competitive-exams" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-bg/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <Logo className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-text font-bold text-base sm:text-lg tracking-tight">
            TestLink
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text transition-colors px-3 py-2 rounded-lg hover:bg-surface/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-text-secondary hover:text-text transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-light transition-all duration-200 shadow-[0_0_20px_rgba(230,57,70,0.2)] hover:shadow-[0_0_30px_rgba(230,57,70,0.35)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-semibold bg-primary text-white px-3.5 py-2 rounded-lg"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-xl max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-text-secondary hover:text-text px-3 py-2.5 rounded-lg hover:bg-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Use Cases sub-section */}
            <div className="pt-3 border-t border-border mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-3 mb-2">
                Use Cases
              </p>
              {mobileUseCases.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-text-secondary hover:text-text px-3 py-2.5 rounded-lg hover:bg-surface transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border mt-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-text-secondary hover:text-text px-3 py-2.5"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
