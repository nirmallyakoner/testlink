import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy (previously "middleware")
 * Export must be named `proxy` — not `middleware`.
 *
 * Layer 1 route protection:
 *  - /dashboard/*       → session required → else /login
 *  - /t/[slug]/result   → session required → else /t/[slug]
 *  - /login             → if already signed in → /dashboard
 *
 * Layer 2 (educator role check) happens in dashboard/layout.tsx via DB query.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await createMiddlewareClient(request);
  const { pathname } = request.nextUrl;

  // ── 1. Protect /dashboard/* ─────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── 2. Protect /t/[slug]/result ─────────────────────────────────────────────
  const resultMatch = pathname.match(/^\/t\/([^/]+)\/result/);
  if (resultMatch) {
    if (!user) {
      const slug = resultMatch[1];
      const url = request.nextUrl.clone();
      url.pathname = `/t/${slug}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── 3. Protect /profile/* ────────────────────────────────────────────────────
  if (pathname.startsWith("/profile")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── 3. Redirect authenticated users away from /login ────────────────────────
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
