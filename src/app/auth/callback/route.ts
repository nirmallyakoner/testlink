import { createClient } from "@/lib/supabase/server";
import { computeUsername } from "@/lib/username";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth Callback Route Handler
 *
 * Called by Supabase after Google OAuth completes.
 * URL params:
 *   - code  : OAuth code to exchange for session
 *   - role  : "educator" | "student"  (passed by us via redirectTo)
 *   - slug  : test slug (only for student flow, to redirect back to test)
 *
 * Educator flow: upserts into educators → redirects to /dashboard/create
 * Student flow:  upserts into students → redirects to /t/[slug] or /
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const role = searchParams.get("role") ?? "student";
  const slug = searchParams.get("slug");

  // Missing code — OAuth didn't complete
  if (!code) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const supabase = await createClient();

  // Exchange the one-time code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[auth/callback] session exchange failed:", exchangeError.message);
    return NextResponse.redirect(new URL("/?auth_error=1", origin));
  }

  // Get the verified user (server-side — never trust cookie alone)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const { id, email } = user;
  const name: string =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    email.split("@")[0];
  const avatar_url: string | null = user.user_metadata?.avatar_url ?? null;

  // ── Educator flow ────────────────────────────────────────────────────────────
  if (role === "educator") {
    await supabase.from("educators").upsert(
      { id, name, email, avatar_url },
      { onConflict: "id", ignoreDuplicates: true }
    );

    return NextResponse.redirect(new URL("/dashboard/create", origin));
  }

  // ── Student flow (default) ───────────────────────────────────────────────────
  const username = computeUsername(name, email);

  await supabase.from("students").upsert(
    { id, name, email, username, avatar_url },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const destination = slug ? `/t/${slug}` : "/";
  return NextResponse.redirect(new URL(destination, origin));
}
