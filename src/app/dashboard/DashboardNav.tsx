"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";

type Educator = {
  name: string;
  avatar_url: string | null;
  current_plan: string;
};

const navItems = [
  { label: "Tests", href: "/dashboard" },
  { label: "Create Test", href: "/dashboard/create" },
];

export function DashboardNav({ educator }: { educator: Educator }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo + nav items */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="text-text font-semibold text-sm hidden sm:block">
              TestLink
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-lg transition-colors",
                  pathname === item.href
                    ? "text-text bg-surface-2"
                    : "text-text-secondary hover:text-text"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Profile + sign out */}
        <div className="flex items-center gap-3">
          <Avatar
            name={educator.name}
            imageUrl={educator.avatar_url ?? undefined}
            size="sm"
          />
          <span className="text-sm text-text-secondary hidden sm:block">
            {educator.name}
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors ml-1 cursor-pointer"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
