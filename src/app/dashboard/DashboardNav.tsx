"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

type Educator = {
  name: string;
  avatar_url: string | null;
  current_plan: string;
};

const navItems = [
  { label: "Tests", href: "/dashboard", icon: "📋" },
  { label: "Create", href: "/dashboard/create", icon: "✏️" },
];

export function DashboardNav({ educator }: { educator: Educator }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="text-text font-semibold text-sm">TestLink</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-lg transition-colors",
                  pathname === item.href
                    ? "text-text bg-surface-2 font-medium"
                    : "text-text-secondary hover:text-text"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Avatar + Sign out (desktop) / Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Desktop: name + sign out */}
            <div className="hidden sm:flex items-center gap-3">
              <Avatar
                name={educator.name}
                imageUrl={educator.avatar_url ?? undefined}
                size="sm"
              />
              <span className="text-sm text-text-secondary max-w-[120px] truncate">
                {educator.name}
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs text-text-muted hover:text-error transition-colors cursor-pointer border border-border hover:border-error/30 px-2.5 py-1 rounded-lg"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>

            {/* Mobile: avatar + hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              <Avatar
                name={educator.name}
                imageUrl={educator.avatar_url ?? undefined}
                size="sm"
              />
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-2 border border-border text-text-secondary"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-bg px-4 pb-4 pt-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors",
                  pathname === item.href
                    ? "text-text bg-surface-2 font-medium"
                    : "text-text-secondary hover:text-text hover:bg-surface-2"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-xs text-text-muted px-3 mb-2">{educator.name}</p>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-error hover:bg-error/8 transition-colors cursor-pointer text-left"
              >
                <span>🚪</span>
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-xl border-t border-border">
        <div className="grid grid-cols-2 px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors",
                  isActive ? "text-primary bg-primary/8" : "text-text-muted hover:text-text"
                )}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className={cn("text-[10px] font-semibold", isActive && "text-primary")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
