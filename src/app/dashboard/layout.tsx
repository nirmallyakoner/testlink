import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "./DashboardNav";

/**
 * Dashboard Layout — Server Component (Layer 2 auth guard)
 *
 * Layer 1: middleware.ts checks for a session (fast, at the edge)
 * Layer 2: this layout checks the user is in the educators table
 *          (a session alone doesn't mean they are an educator)
 *
 * If the user has a session but is NOT in educators → /not-educator
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt + suspenders: middleware already caught this, but just in case
  if (!user) {
    redirect("/login");
  }

  // Critical check: is this user registered as an educator?
  const { data: educator } = await supabase
    .from("educators")
    .select("id, name, avatar_url, current_plan")
    .eq("id", user.id)
    .single();

  if (!educator) {
    // Valid session, but not an educator (could be a student who typed /dashboard)
    redirect("/not-educator");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav educator={educator} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
