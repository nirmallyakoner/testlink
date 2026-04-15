/**
 * Generates a URL-safe, collision-resistant slug from a test title.
 *
 * Examples:
 *  "NORCET Mock Test 1"  → "norcet-mock-test-1-k3m9"
 *  "Physics: Chapter 5"  → "physics-chapter-5-x7q2"
 *
 * Rules:
 *  - Lowercased
 *  - Non-alphanumeric chars replaced with hyphens
 *  - Max 45 chars from title + 4-char random suffix
 *  - Total max length: 50 chars
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "")     // strip leading/trailing hyphens
    .slice(0, 45);                // truncate title portion

  const suffix = Math.random().toString(36).slice(2, 6); // 4-char random base-36 string

  return `${base}-${suffix}`;
}
