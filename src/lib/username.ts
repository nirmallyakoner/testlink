/**
 * Computes a display username from Google OAuth displayName and email.
 *
 * Rules:
 *  - "Priya Sharma"   → "Priya S."
 *  - "Priya"          → "Priya"   (single name — show as-is)
 *  - ""  / null       → email prefix  e.g. "priya.sharma" → "priya.sharma"
 *
 * The username is shown on leaderboards. Email is NEVER shown.
 */
export function computeUsername(
  displayName: string | null | undefined,
  email: string
): string {
  const name = (displayName ?? "").trim();

  if (!name) {
    // Fallback: use email prefix (before @)
    return email.split("@")[0] ?? "student";
  }

  const parts = name.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]; // Single name — show whole thing
  }

  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() ?? "";

  return `${first} ${lastInitial}.`;
}
