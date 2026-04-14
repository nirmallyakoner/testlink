# TestLink — Master Technical Plan
### Every decision, every screen, every database table, every flow

**Owner:** Nirmallya  
**Stack:** Next.js 15 · Supabase · Google OAuth · OpenAI GPT-4o-mini  
**Last Updated:** April 15, 2026  
**Status:** Pre-Build · Approved to Execute

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [The Two Users](#2-the-two-users)
3. [Complete User Flows](#3-complete-user-flows)
4. [Auth Architecture — How Protection Works](#4-auth-architecture--how-protection-works)
5. [Database Schema — Every Table, Every Column](#5-database-schema--every-table-every-column)
6. [AI Question Parser (GPT-4o-mini)](#6-ai-question-parser-gpt-4o-mini)
7. [Educator Analytics + Lead Capture](#7-educator-analytics--lead-capture)
8. [Email Feature — Educator to Student](#8-email-feature--educator-to-student)
9. [All Pages and Who Can Access Them](#9-all-pages-and-who-can-access-them)
10. [Frontend Component Architecture](#10-frontend-component-architecture)
11. [Supabase Edge Functions](#11-supabase-edge-functions)
12. [Next.js Middleware — Route Protection](#12-nextjs-middleware--route-protection)
13. [Design System — Rank Red](#13-design-system--rank-red)
14. [Folder Structure](#14-folder-structure)
15. [Environment Variables](#15-environment-variables)
16. [Build Phases — Day by Day](#16-build-phases--day-by-day)
17. [Monetization Roadmap](#17-monetization-roadmap)
18. [Infrastructure and Cost](#18-infrastructure-and-cost)

---

## 1. Product Summary

TestLink is a **creator-first test platform** built for independent Indian educators — YouTube teachers, private tutors, Telegram channel educators. 

An educator pastes their question bank in **any format**, AI structures it into a clean test, they publish it in one click and get a shareable link. Students click the link, sign in with Google, take the test, and instantly see their rank on a public leaderboard.

**The data advantage:** Every student who takes any test on TestLink signs in with Google. That means we silently collect their verified name and email in our database. In V1, educators see only student usernames (not emails) — but all data is stored. In V2, TestLink charges educators to unlock email access and send campaigns to their student lists. This is the platform's long-term revenue moat.

**North star:** Number of test submissions per week.

---

## 2. The Two Users

### User Type A — The Educator

| Attribute | Detail |
|-----------|--------|
| Who | YouTube educators, private tutors, coaching admins, Telegram group owners |
| Tech comfort | Low — uses WhatsApp, YouTube, Telegram. Not a developer. |
| Pain | Has MCQ question banks but no fast way to create a shareable test |
| Wants | Create test in under 60 seconds → share link → see who attended |
| Auth | Google OAuth only (no password, no OTP) |
| Protected area | `/dashboard/*` — only accessible to verified educators |

### User Type B — The Student

| Attribute | Detail |
|-----------|--------|
| Who | Competitive exam aspirants (UPSC, SSC, JEE, NEET, Nursing, State exams) |
| Device | Mobile-first — mid-range Android (Moto, Redmi, Realme) |
| Age range | 16–30 |
| Wants | Know where they rank among peers. Quick test. No friction. |
| Auth | Google OAuth only (no password, no OTP) |
| Protected area | `/t/[slug]` requires Google login before test starts |

---

## 3. Complete User Flows

### 3.1 — Educator Flow (End to End)

```
1. Educator lands on testlink.in
   └── Sees homepage: headline, how it works, [Get Started] button

2. Clicks [Get Started]
   └── Supabase Google OAuth popup
   └── Google account selected → callback fires
   └── /auth/callback checks: is this email in educators table?
       ├── YES → go to /dashboard
       └── NO  → INSERT into educators table → go to /dashboard/create

3. Lands on /dashboard/create (first-time or returning)
   └── Large textarea: "Paste your questions here — any format is fine"
   └── Format hint: collapsible example shown
   └── [Parse with AI →] button

4. Paste text → click [Parse with AI →]
   └── API call to /api/parse-questions (GPT-4o-mini)
   └── Returns: { questions: Question[] }
   └── Loading spinner shown (~2-4 seconds)
   └── Questions rendered in preview list
   └── Questions with no answer detected are flagged with ⚠️
   └── Educator clicks correct answer on flagged questions
   └── Test title input field shown (pre-filled from first question context if possible)
   └── [Publish Test →] button

5. Clicks [Publish Test →]
   └── Inserts test + questions into Supabase
   └── Generates slug from title (e.g. "norcet-mock-oct-1")
   └── Test link displayed in a highlighted box:
       testlink.in/t/norcet-mock-oct-1
   └── Auto-copied to clipboard
   └── "Copied!" confirmation shown
   └── Two buttons only:
       [Preview Test →] — opens student view in new tab
       [Create Another Test] — resets the create page

6. Educator shares link (WhatsApp, Telegram, YouTube)
   └── Educator's task is DONE

7. Later: educator visits /dashboard
   └── Sees list of all their tests
   └── Each test card shows:
       - Test title
       - Date created
       - 🔢 Total attempts
       - 📊 [View Analytics] button
       - 🔗 Copy link button

8. Clicks [View Analytics] on a test
   └── Goes to /dashboard/tests/[id]/analytics
   └── See all metrics (detailed in Section 7)
   └── See student list: username (e.g. "Priya S."), avatar, score, rank, time taken
       NOTE: Student emails are NOT shown to educators in V1. Stored in DB, unlocked in V2.
```

---

### 3.2 — Student Flow (End to End)

```
1. Student receives test link (WhatsApp / Telegram / YouTube description)
   └── Clicks link → lands on /t/[slug]
   └── Sees: Test title, Educator name, Number of questions, Subject
   └── [Sign in with Google to Start Test] button

2. Clicks [Sign in with Google to Start Test]
   └── Supabase Google OAuth popup
   └── Google account selected → callback fires
   └── /auth/callback checks: is this email in students table?
       ├── YES → go back to /t/[slug] (already a student, start test)
       └── NO  → INSERT into students table → go back to /t/[slug]

   NOTE: If the Google account is in the educators table,
   that person can still take tests — they'll be treated as a student
   for test-taking. Their submission is recorded under their auth.users id.

3. Test begins immediately after login
   └── All questions visible at once (scrollable)
   └── Question navigation grid at top (numbered pills, turn green when answered)
   └── Timer shown in top bar (if time limit set; otherwise no timer)
   └── Student answers questions (tap to select option)
   └── Sticky [Submit Test] bar at bottom
   └── On submit: confirmation modal "Are you sure? You answered 23/25 questions"

4. Submits test
   └── POST to Supabase Edge Function: submit-test
   └── Score calculated server-side
   └── Submission inserted into DB
   └── Redirect to /t/[slug]/result

5. Lands on /t/[slug]/result
   └── Shows:
       - Educator name + test title at top
       - Big animated rank reveal: "You ranked #47 out of 1,200 students"
       - Score: 38/50
       - Time taken: 24:12
       ─────────────────────────────────
       ALL STUDENTS (leaderboard)
       #1   [Avatar] Ramesh K.    50/50   18:02
       #2   [Avatar] Priya S.     49/50   21:44
       #3   [Avatar] Aarav M.     48/50   19:33
       ...
       #47  [Avatar] YOU (highlighted) 38/50  24:12
       ...
   └── Leaderboard auto-refreshes every 15 seconds

6. If student tries to open the same test link again:
   └── Sees test page but [Submit] is replaced with [View Your Result →]
   └── Cannot retake the test (one submission per student per test)
```

---

### 3.3 — Auth Callback Logic (The Brain of Both Flows)

```
User completes Google OAuth →
/auth/callback?role=educator           OR      /auth/callback?role=student&slug=norcet-mock-1

Route handler:
  1. Exchange code for session (Supabase)
  2. Get auth.users record (id, email, name, avatar_url)

  If role = "educator":
    → SELECT from educators WHERE id = auth_user_id
    → If NOT found: INSERT into educators (id, name, email, avatar_url)
    → Redirect to /dashboard/create

  If role = "student":
    → SELECT from students WHERE id = auth_user_id
    → If NOT found: INSERT into students (id, name, email, username, avatar_url)
    → Redirect to /t/[slug]

  If role is missing (direct /auth/callback hit):
    → Redirect to /
```

---

## 4. Auth Architecture — How Protection Works

### The Problem to Solve

We have three access categories:
1. **Public** — Anyone can see (landing page, leaderboard)
2. **Educator-only** — Only Google-authed users who are in the `educators` table
3. **Student-authed** — Only Google-authed users (educator OR student) who have submitted a test

### The Solution — Two Layers

#### Layer 1: Next.js Middleware (Fast, Edge-level check)

The middleware runs on **every request** before the page loads. It handles:

- Is the user logged in at all? (Checks Supabase session cookie)
- If NOT logged in AND trying to reach `/dashboard/*` → redirect to `/login`
- If NOT logged in AND trying to reach `/t/[slug]/result` → redirect to `/t/[slug]`
- If logged in → let them through to Layer 2

```typescript
// middleware.ts (runs at edge — no DB call here, just session check)
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isResult = req.nextUrl.pathname.includes('/result')

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isResult && !session) {
    // Extract slug from /t/[slug]/result
    const slug = req.nextUrl.pathname.split('/')[2]
    return NextResponse.redirect(new URL(`/t/${slug}`, req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/t/:path*/result'],
}
```

#### Layer 2: Server Component Role Check (DB-level verification)

Inside the dashboard layout, a Server Component makes a DB call:

```typescript
// app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check they are actually an educator, not just any logged-in user
  const { data: educator } = await supabase
    .from('educators')
    .select('id, name, plan')
    .eq('id', user.id)
    .single()

  if (!educator) {
    // Logged in with Google but not an educator
    // This could be a student who manually typed /dashboard
    redirect('/not-educator')
  }

  // Pass educator context to all dashboard pages
  return (
    <EducatorProvider value={educator}>
      <DashboardNav educator={educator} />
      {children}
    </EducatorProvider>
  )
}
```

#### What Each Route Requires

| Route | Session Required | Role Check | Notes |
|-------|-----------------|------------|-------|
| `/` | No | None | Public landing |
| `/login` | No | None | Redirects authed users away |
| `/auth/callback` | No | Creates profile | Core routing logic |
| `/dashboard` | Yes | `educators` table | Redirect if not educator |
| `/dashboard/create` | Yes | `educators` table | Same layout guard |
| `/dashboard/tests/[id]` | Yes | `educators` table + owns test | 404 if not owner |
| `/dashboard/tests/[id]/analytics` | Yes | `educators` table + owns test | Lead data shown here |
| `/t/[slug]` | No (public view) | None (login required to START) | Pre-login shows test info |
| `/t/[slug]/result` | Yes | Must have submission for this test | Redirect if no submission |
| `/t/[slug]/leaderboard` | No | None | Fully public |
| `/preview/[slug]` | Yes | `educators` table + owns test | Read-only student view |

#### Preventing Cross-User Data Access

```typescript
// NEVER do this (fetches any test):
supabase.from('tests').select('*').eq('id', testId)

// ALWAYS do this (educator can only see their own):
supabase.from('tests').select('*')
  .eq('id', testId)
  .eq('educator_id', user.id)  // ← this is the guard
  .single()
// Returns null if testId belongs to another educator → 404 page
```

---

## 5. Database Schema — Every Table, Every Column

### `educators` table

Populated on first Google login via the landing page CTA.

```sql
CREATE TABLE educators (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,           -- Google display name
  email       TEXT NOT NULL UNIQUE,    -- Google email
  avatar_url  TEXT,                    -- Google profile photo URL
  slug        TEXT UNIQUE,             -- Auto: "priya-sharma-educator"
  plan        TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'starter' | 'pro'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE educators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Educators can read their own row"
  ON educators FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Educators can update their own row"
  ON educators FOR UPDATE USING (auth.uid() = id);
```

---

### `students` table

Populated on first Google login via a test link.

```sql
CREATE TABLE students (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,           -- Google display name
  email       TEXT NOT NULL UNIQUE,    -- Google email — stored in DB, NOT shown to educators in V1
  avatar_url  TEXT,                    -- Google profile photo URL
  username    TEXT NOT NULL,           -- "Priya S." computed from name + email prefix (see below)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can read their own row"
  ON students FOR SELECT USING (auth.uid() = id);
-- V1: Educators can read username + avatar_url ONLY (email hidden at query level via view)
-- V2: Full row access unlocked when educator upgrades to paid plan
-- We use a restrictive view to enforce this:
CREATE VIEW student_public_profiles AS
  SELECT id, username, avatar_url FROM students;

-- Educators query student_public_profiles (not the students table directly)
-- The students table itself remains inaccessible to educators in V1
CREATE POLICY "Students can read their own full row"
  ON students FOR SELECT USING (auth.uid() = id);
```

**How `username` is computed (from BOTH Google name and email):**
```typescript
// lib/username.ts
// Strategy: Use Google display name as primary source.
// If name is just one word (e.g. "Priya"), supplement with email prefix
// to create a more unique, identifiable username.
// Examples:
//   name="Priya Sharma"    email=any           → "Priya S."
//   name="Priya"           email=priya.s@...   → "Priya S."
//   name="Ramesh"          email=ramesh123@..  → "Ramesh"
//   name=""                email=r.kumar@...   → "R. Kumar"

export function computeUsername(displayName: string, email: string): string {
  const nameParts = displayName.trim().split(/\s+/).filter(Boolean)

  // Case 1: Full name available (First + Last)
  if (nameParts.length >= 2) {
    const first = nameParts[0]
    const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase()
    return `${first} ${lastInitial}.`  // "Priya S."
  }

  // Case 2: Only one name word — try to get last initial from email prefix
  const emailPrefix = email.split('@')[0]  // "priya.sharma" or "priya_s" or "priya123"
  const emailParts = emailPrefix.split(/[._-]/).filter(p => /^[a-zA-Z]/.test(p))

  if (nameParts.length === 1 && emailParts.length >= 2) {
    const first = nameParts[0]
    const lastInitial = emailParts[emailParts.length - 1][0].toUpperCase()
    return `${first} ${lastInitial}.`  // "Priya S."
  }

  // Case 3: Only one word everywhere — use it as-is
  return nameParts[0] || emailPrefix
}
```

---

### `tests` table

```sql
CREATE TABLE tests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id      UUID NOT NULL REFERENCES educators(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  subject          TEXT,                    -- "Nursing", "UPSC", etc. (optional)
  slug             TEXT NOT NULL UNIQUE,    -- URL-safe, auto-generated
  description      TEXT,                    -- Short description shown on test landing
  time_limit_mins  INTEGER,                 -- NULL = no time limit
  is_published     BOOLEAN NOT NULL DEFAULT false,
  total_marks      INTEGER,                 -- Sum of all question marks
  question_count   INTEGER,                 -- Denormalized for fast display
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX tests_educator_id_idx ON tests(educator_id);
CREATE INDEX tests_slug_idx ON tests(slug);

-- RLS
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Educators can CRUD their own tests"
  ON tests FOR ALL USING (auth.uid() = educator_id);
CREATE POLICY "Anyone can read published tests"
  ON tests FOR SELECT USING (is_published = true);
```

**How `slug` is generated:**
```typescript
// lib/slug.ts
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '-')           // spaces to hyphens
    .slice(0, 50)                   // max length
  const suffix = Math.random().toString(36).slice(2, 6)  // 4-char random suffix
  return `${base}-${suffix}`        // "norcet-mock-test-1-k3m9"
}
```

---

### `questions` table

```sql
CREATE TABLE questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id        UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  order_index    INTEGER NOT NULL,
  question_text  TEXT NOT NULL,
  option_a       TEXT NOT NULL,
  option_b       TEXT NOT NULL,
  option_c       TEXT,                   -- Optional (some MCQs have 2-3 options)
  option_d       TEXT,                   -- Optional
  correct        CHAR(1) NOT NULL,       -- 'a' | 'b' | 'c' | 'd'
  explanation    TEXT,                   -- For future paid evaluation feature (V2)
  marks          INTEGER NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast test question fetching
CREATE INDEX questions_test_id_idx ON questions(test_id);

-- RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Educators can CRUD their test questions"
  ON questions FOR ALL USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = questions.test_id AND tests.educator_id = auth.uid())
  );
CREATE POLICY "Authenticated users can read questions of published tests"
  ON questions FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM tests WHERE tests.id = questions.test_id AND tests.is_published = true)
  );
```

---

### `submissions` table

```sql
CREATE TABLE submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id         UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES auth.users(id),  -- auth.users, not students table
                                                             -- allows educator to take test too
  answers         JSONB NOT NULL,   -- { "question_uuid": "a", "question_uuid2": "c", ... }
  score           NUMERIC(6,2) NOT NULL,
  total_marks     INTEGER NOT NULL,
  correct_count   INTEGER NOT NULL,
  wrong_count     INTEGER NOT NULL,
  unanswered      INTEGER NOT NULL,
  time_taken_sec  INTEGER,          -- NULL if no time limit test
  rank            INTEGER,          -- Computed and stored on submission (for this moment in time)
                                    -- NOT recalculated. Rank shown on result = rank at time of submit.
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(test_id, student_id)       -- One attempt per student per test (enforced at DB level)
);

-- Indexes for leaderboard queries
CREATE INDEX submissions_test_id_score_idx ON submissions(test_id, score DESC, time_taken_sec ASC);
CREATE INDEX submissions_student_id_idx ON submissions(student_id);

-- RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can insert their own submission"
  ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can read their own submission"
  ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Educators can read submissions for their tests"
  ON submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = submissions.test_id AND tests.educator_id = auth.uid())
  );
CREATE POLICY "Anyone can read submissions for leaderboard"
  ON submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM tests WHERE tests.id = submissions.test_id AND tests.is_published = true)
  );
```

**Why `rank` is stored (not computed dynamically):**
A student submits. At that moment, they are #47. 100 more students submit after them. Their rank changes to #200. The result page should show them `#47` — the rank at their moment of submission. The live leaderboard shows the real-time order, but their personal result page shows the stored rank. This is fair and feels better.

---

### `email_logs` table

Tracks every email an educator sends through TestLink. Keeps us out of spam territory and lets us throttle/monitor.

```sql
CREATE TABLE email_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id     UUID NOT NULL REFERENCES educators(id),
  test_id         UUID REFERENCES tests(id),
  subject         TEXT NOT NULL,
  body_preview    TEXT,             -- First 200 chars stored for audit
  recipient_count INTEGER NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Educators can read their own email logs"
  ON email_logs FOR SELECT USING (auth.uid() = educator_id);
CREATE POLICY "Educators can insert email logs"
  ON email_logs FOR INSERT WITH CHECK (auth.uid() = educator_id);
```

---

## 6. AI Question Parser (GPT-4o-mini)

### Why AI (Not Regex)

Educators paste questions in every imaginable format:

```
Format A (clean):
Q: What is normal hemoglobin in men?
A) 11-13 g/dL  B) 13-15 g/dL  C) 15-17 g/dL  D) 17-19 g/dL
Answer: B

Format B (messy):
1) which of following NOT symptom of anemia
a-fatigue b.jaundice c pallor d dyspnea
ans b

Format C (tabular paste from PDF):
3.    Normal RBC count in females:        a. 3.5–4.5      b. 4.5–5.5     c. 2.5–3.5     d. 5.5–6.5      Ans: a
```

A regex parser fails on Format B. GPT-4o-mini reads all three the same way.

### Implementation

**Route:** `POST /api/parse-questions`  
**Auth:** Supabase session required (educator only)  
**Cost:** ~$0.0002 per 50-question parse. Less than 0.02 paise.

```typescript
// app/api/parse-questions/route.ts
import OpenAI from 'openai'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

const QuestionSchema = z.object({
  question_text: z.string().min(5),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().nullable(),
  option_d: z.string().nullable(),
  correct: z.enum(['a', 'b', 'c', 'd']).nullable(),  // null = educator must pick
  marks: z.number().default(1),
})

const ResponseSchema = z.object({
  questions: z.array(QuestionSchema),
  parse_warnings: z.array(z.string()),  // e.g. "Question 3 has no answer marked"
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a question parser for an Indian exam preparation platform.
Your job: extract MCQ questions from raw text and return structured JSON.

Rules:
- Extract ALL questions, even if format is inconsistent
- Correct answer: set to 'a', 'b', 'c', or 'd'. If unclear or missing, set to null
- Clean up typos in questions and options (minor corrections only)
- If options C and D are missing, set option_c and option_d to null
- Maintain original question order
- Return ONLY valid JSON, no markdown code blocks
- Do not invent questions that aren't in the text
- Handle English and Hindi-English mixed text
- marks is always 1 unless specified otherwise`

export async function POST(req: Request) {
  // Auth check
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { raw_text } = await req.json()
  if (!raw_text || raw_text.length < 20) {
    return Response.json({ error: 'Text too short' }, { status: 400 })
  }
  if (raw_text.length > 50000) {
    return Response.json({ error: 'Text too long (max 50,000 characters)' }, { status: 400 })
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Parse these questions:\n\n${raw_text}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,  // Low temperature for consistent structured output
    max_tokens: 8000,
  })

  const raw = JSON.parse(completion.choices[0].message.content!)
  const parsed = ResponseSchema.parse(raw)

  return Response.json(parsed)
}
```

### UI Behavior on Parse Result

```
CASE 1: All questions have answers
→ Show all questions in preview list
→ All marked with ✅
→ [Publish Test →] button enabled

CASE 2: Some questions missing answers
→ Show all questions
→ Missing answer questions marked with ⚠️ in orange
→ Educator clicks the correct option on flagged questions
→ Once all ⚠️ resolved → [Publish Test →] button enables

CASE 3: Parse completely fails (API error / unreadable text)
→ Show error: "Could not parse questions. Check your format and try again."
→ Show format example
→ [Try Again] button

CASE 4: Partial parse (some questions unclear)
→ Show parse_warnings list at top: "3 questions had unclear formatting"
→ Those questions shown with ⚠️
→ Educator fixes manually inline
```

---

## 7. Educator Analytics + Lead Capture

### The Lead Capture Strategy

Every student who takes any test on TestLink authenticates with Google. We silently collect:
- **Name** (Google display name)
- **Email** (verified Google email) — stored in DB, not shown in V1
- **Profile photo**

**V1 (now):** Educators see student **usernames and avatars only** — no emails exposed.  
**V2 (future):** TestLink charges educators to unlock email access and send campaigns. The data is already there — the paywall is purely on access. This is the moat.

### Analytics Page: `/dashboard/tests/[id]/analytics` — V1 Layout

#### What the Educator Sees in V1:

```
────────────────────────────────────────────────────────
NORCET Mock Test 1                    📋 Copy Link   👁 Preview
Created: April 10, 2026
────────────────────────────────────────────────────────

OVERVIEW CARDS
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│              │ │              │ │              │ │              │
│  1,247       │ │  38.4/50     │ │  24:12       │ │  68%         │
│  Attempts    │ │  Avg Score   │ │  Avg Time    │ │  Completion  │
│              │ │              │ │              │ │  Rate        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

SCORE DISTRIBUTION (bar chart)
0–20%  ████░░░░░░  12%
21–40% ██████░░░░  24%
41–60% ████████░░  31%
61–80% ██████░░░░  24%
81–100% ███░░░░░░░░ 9%

────────────────────────────────────────────────────────
STUDENTS WHO TOOK THIS TEST                    🔍 Search
────────────────────────────────────────────────────────

  #1   [Avatar] Ramesh K.     50/50   18:02
  #2   [Avatar] Priya S.      49/50   21:44
  #3   [Avatar] Aarav M.      48/50   19:33
  ...
  #47  [Avatar] Anjali S.     38/50   24:12
  ...

[ Load More ]
────────────────────────────────────────────────────────
```

> **What is NOT shown in V1:** Student emails, checkboxes for selection, Email Students button.  
> **What IS stored silently in DB:** Full name, verified email, avatar URL — ready for V2 unlock.

### Analytics Data Queries

All queries are scoped to `educator_id` via RLS — educators only ever see data from their own tests.

```typescript
// Query 1: Overview stats
const { data: stats } = await supabase
  .from('submissions')
  .select('score, total_marks, time_taken_sec')
  .eq('test_id', testId)

// Compute client-side:
const totalAttempts = stats.length
const avgScore = stats.reduce((s, r) => s + r.score, 0) / totalAttempts
const avgTime = stats.reduce((s, r) => s + (r.time_taken_sec || 0), 0) / totalAttempts

// Query 2: Student list — V1 uses the student_public_profiles view (username + avatar only)
// Educators CANNOT access the students table directly — only the restricted view
const { data: attendees } = await supabase
  .from('submissions')
  .select(`
    score, total_marks, time_taken_sec, rank, submitted_at,
    student_public_profiles!inner(id, username, avatar_url)
  `)
  .eq('test_id', testId)
  .order('score', { ascending: false })
  .order('time_taken_sec', { ascending: true })

// V2 query (future — behind paywall check):
// .select('score, ..., students!inner(id, name, email, avatar_url, username)')
```

---

## 8. Email Feature — Educator to Student

> **V1 STATUS: UI HIDDEN. Data infrastructure built. Feature locked behind V2 paywall.**

### Why We Build the Infrastructure Now (Even Though UI Is Hidden)

Every student email is collected and stored in the `students` table from day one.
The `email_logs` table is created in the initial migration.
The `send-email` Edge Function is written and deployed but never called from the V1 UI.

When we flip the switch for V2 (paid plan), we don't need to touch the database or rewrite the backend — we just unhide the UI. This is intentional.

### What's Hidden in V1

- No "Email Students" button on analytics page
- No student checkboxes in the attendee list
- No EmailModal component rendered
- No Resend API key needed at launch

### V2 Plan (When We Unlock It)

1. Educator on analytics page sees "📧 Email Students" button (Starter plan only)
2. They select students or click "Email All"
3. Compose modal opens: subject + message body
4. Sends via Resend from `noreply@testlink.in`, reply-to = educator's email
5. Rate limited: 3 sends/day per educator (V2 free) → unlimited (Pro plan)

### V2 Implementation (Already Specified — Do Not Build in V1)

The `send-email` Edge Function will:
1. Verify educator auth + owns the test
2. Check `email_logs`: enforce rate limits
3. Fetch student emails from `students` table (full access, not public view)
4. Batch via Resend (100 per batch)
5. Insert into `email_logs`
6. Return `{ sent: number }`

### Email Edge Function

```typescript
// supabase/functions/send-email/index.ts
// POST { test_id, subject, body, student_ids?: string[] }
// Auth: Educator JWT required

// Steps:
// 1. Verify educator owns this test
// 2. Fetch student emails (either selected or all)
// 3. Send via Resend API (bulk email, batched 100 at a time)
// 4. Insert into email_logs
// 5. Return { sent: number, failed: number }
```

**Email rate limits (to prevent spam):**
- Max 500 emails per send action (to avoid Resend free tier issues)
- Max 3 email sends per educator per day (V1 limit)
- These limits enforced in the Edge Function

**Why Resend (not SendGrid / Mailgun)?**
- 3,000 free emails/month — covers V1 completely
- Dead simple API — one `resend.emails.send()` call
- Built for transactional email, reliable deliverability

---

## 9. All Pages and Who Can Access Them

| Route | Auth Required | Role | What Happens If Wrong |
|-------|-------------|------|----------------------|
| `/` | No | Public | — |
| `/login` | No | Public | Authed users redirected to `/dashboard` |
| `/pricing` | No | Public | — |
| `/auth/callback` | No | System | Routes based on `role` param |
| `/not-educator` | No | Public | Error page for students who hit `/dashboard` |
| `/dashboard` | Yes | Educator only | Redirect to `/login` if no session; redirect to `/not-educator` if not educator |
| `/dashboard/create` | Yes | Educator only | Same as above |
| `/dashboard/tests/[id]` | Yes | Educator + owns test | 404 if doesn't own test |
| `/dashboard/tests/[id]/analytics` | Yes | Educator + owns test | 404 if doesn't own test |
| `/t/[slug]` | No (partial) | Anyone can VIEW | Login required to START test |
| `/t/[slug]/result` | Yes | Must have submission | Redirect to `/t/[slug]` if no submission |
| `/t/[slug]/leaderboard` | No | Public | — |
| `/preview/[slug]` | Yes | Educator + owns test | Used to preview student view |

---

## 10. Frontend Component Architecture

```
src/components/

├── ui/                          ← Base design system components
│   ├── Button.tsx               variant: 'primary' | 'ghost' | 'danger'
│   ├── Input.tsx                dark themed, with label + error state
│   ├── Textarea.tsx             large, for question paste
│   ├── Card.tsx                 Surface card with border
│   ├── Badge.tsx                Rank badge (#1 gold, #2 silver, #3 bronze, rest default)
│   ├── Avatar.tsx               Google photo + colored initial fallback
│   ├── Modal.tsx                Centered overlay with backdrop
│   ├── Skeleton.tsx             Loading skeleton blocks
│   ├── Toast.tsx                Success / error notifications (via Sonner)
│   └── Spinner.tsx              Loading spinner

├── landing/
│   ├── Hero.tsx                 Big headline, sub-headline, [Get Started] CTA
│   ├── HowItWorks.tsx           Two columns: Educator steps + Student steps
│   ├── FeatureGrid.tsx          3 key features: AI Parse, Live Leaderboard, Lead Capture
│   └── Footer.tsx               Links + "Made with ❤️ for Indian educators"

├── nav/
│   ├── PublicNav.tsx            Logo + [Get Started] (for landing page)
│   └── DashboardNav.tsx         Logo + educator avatar + [+ Create Test] + [Logout]

├── create/
│   ├── CreatePage.tsx           Main orchestrator: manages step state (paste → preview → published)
│   ├── PasteStep.tsx            Textarea + format hint + [Parse with AI →]
│   ├── PreviewStep.tsx          Parsed question list + title input + [Publish →]
│   ├── QuestionPreviewItem.tsx  Single Q with options, ⚠️ flag if no answer
│   ├── AnswerPicker.tsx         Click to select correct answer on flagged questions
│   └── PublishedStep.tsx        Link display + copy button + Preview + Create Another

├── dashboard/
│   ├── TestCard.tsx             Test row: title, date, attempt count, copy link, analytics link
│   ├── StatsGrid.tsx            4 overview cards for analytics page
│   ├── ScoreDistribution.tsx    Bar chart of score ranges (Recharts)
│   ├── StudentLeadTable.tsx     Checkbox list of students with email/score/rank
│   ├── EmailModal.tsx           Compose and send email modal
│   └── EmptyState.tsx           "No tests yet — create your first test" prompt

├── test/
│   ├── TestLanding.tsx          Pre-login: test info + [Sign in with Google to Start]
│   ├── TestGate.tsx             Shows login prompt if not authed; shows test if authed
│   ├── TestUI.tsx               Main test interface orchestrator
│   ├── QuestionCard.tsx         Single question with 4 option buttons
│   ├── QuestionNavGrid.tsx      Top grid of numbered pills (green = answered)
│   ├── Timer.tsx                Countdown, turns red under 5 minutes
│   ├── SubmitBar.tsx            Sticky bottom: "X of Y answered" + [Submit Test]
│   └── SubmitConfirmModal.tsx   "You answered 23/25, are you sure?" modal

└── result/
    ├── RankReveal.tsx           Animated count-up to rank number
    ├── ScoreSummary.tsx         Score, time taken, correct/wrong/unanswered counts
    └── LeaderboardTable.tsx     Full ranked list with avatars + highlight for current user
```

---

## 11. Supabase Edge Functions

### `submit-test`

**Trigger:** Student submits test answers  
**File:** `supabase/functions/submit-test/index.ts`

```typescript
// POST { test_slug: string, answers: Record<string, string>, time_taken_sec: number }
// Auth: Supabase Bearer token (student must be logged in)

// Steps:
// 1. Verify auth token → get student id
// 2. Fetch test id from slug
// 3. Check: has this student already submitted this test? → error if yes
// 4. Fetch all questions for this test (with correct answers)
// 5. Calculate score:
//    - For each question, compare answers[question_id] with question.correct
//    - score += question.marks if correct
//    - correct_count++, wrong_count++ accordingly
// 6. Calculate rank at moment of submission:
//    SELECT COUNT(*) + 1 FROM submissions WHERE test_id = ? AND score > calculated_score
//    (ties broken by time_taken_sec ASC — faster gets higher rank)
// 7. INSERT into submissions (with calculated rank stored)
// 8. Return { score, total_marks, correct_count, wrong_count, rank, total_students }
```

---

### `send-email`

**Trigger:** Educator sends email to their students  
**File:** `supabase/functions/send-email/index.ts`

```typescript
// POST { test_id: string, subject: string, body: string, student_ids?: string[] }
// Auth: Supabase Bearer token (educator must be logged in)

// Steps:
// 1. Verify educator auth + verify educator owns this test
// 2. Check email_logs: has educator sent email in last hour? (rate limit: 3/day)
// 3. If student_ids provided: fetch only those students
//    Else: fetch ALL students who submitted this test
// 4. Validate all fetched students actually submitted this educator's test (security)
// 5. Batch emails (max 100 per Resend batch call)
// 6. Send via Resend: from "TestLink <noreply@testlink.in>" reply-to educator email
// 7. INSERT into email_logs (educator_id, test_id, subject, preview, count)
// 8. Return { sent: number }
```

---

## 12. Next.js Middleware — Route Protection

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protect /dashboard/* — must be logged in
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect /t/[slug]/result — must be logged in
  // (DB check for actual submission happens inside the page)
  const resultPathMatch = path.match(/^\/t\/(.+)\/result$/)
  if (resultPathMatch && !user) {
    const slug = resultPathMatch[1]
    return NextResponse.redirect(new URL(`/t/${slug}`, request.url))
  }

  // Redirect logged-in users away from /login
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/t/:path*/result',
    '/login',
  ],
}
```

---

## 13. Design System — Rank Red

### Color Tokens

```css
/* tailwind.config.ts — extend.colors */
:root {
  --color-bg:           #0A0A0F;   /* App background */
  --color-surface:      #14141E;   /* Cards, panels */
  --color-surface-2:    #1E1E2E;   /* Inputs, hover states */
  --color-border:       #2A2A3E;   /* Separators */

  --color-primary:      #FF3B30;   /* Primary red */
  --color-primary-end:  #FF6B6B;   /* Gradient end */
  --color-primary-glow: rgba(255, 59, 48, 0.15);

  --color-text:         #FFFFFF;   /* Primary text */
  --color-text-muted:   #8B8BA0;   /* Subtext, labels */

  --color-gold:         #FFD700;   /* #1 rank crown */
  --color-silver:       #C0C0C0;   /* #2 rank */
  --color-bronze:       #CD7F32;   /* #3 rank */
  --color-cyan:         #00D4FF;   /* Live indicators, timers */

  --color-success:      #22C55E;   /* Correct answers */
  --color-error:        #EF4444;   /* Wrong answers */
  --color-warning:      #F59E0B;   /* ⚠️ flags */
}
```

### Typography

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* Font scale */
--font-xs:   0.75rem;    /* 12px — labels */
--font-sm:   0.875rem;   /* 14px — body small */
--font-base: 1rem;       /* 16px — body */
--font-lg:   1.125rem;   /* 18px — card titles */
--font-xl:   1.25rem;    /* 20px — section headers */
--font-2xl:  1.5rem;     /* 24px — page titles */
--font-3xl:  1.875rem;   /* 30px — hero sub */
--font-4xl:  2.25rem;    /* 36px — hero title */
--font-rank: 5rem;       /* 80px — rank reveal number */
```

### Key Component Styles

```css
/* Primary button */
.btn-primary {
  background: linear-gradient(135deg, #FF3B30, #FF6B6B);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 0 20px rgba(255, 59, 48, 0.3);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 30px rgba(255, 59, 48, 0.5);
}

/* Card */
.card {
  background: #14141E;
  border: 1px solid #2A2A3E;
  border-radius: 12px;
  padding: 24px;
}

/* Rank badge — #1 */
.rank-badge-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  border-radius: 999px;
  font-weight: 700;
}

/* Live indicator */
.live-dot {
  width: 8px;
  height: 8px;
  background: #00D4FF;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Rank reveal number */
.rank-number {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FF3B30, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 14. Folder Structure

```
c:\Users\DELL\Desktop\testlink\
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout: fonts, global CSS
│   │   ├── page.tsx                      ← Landing page (/)
│   │   ├── login/
│   │   │   └── page.tsx                  ← Google login trigger
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts              ← OAuth callback (educator/student routing)
│   │   ├── not-educator/
│   │   │   └── page.tsx                  ← Error: "This area is for educators"
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                ← Auth guard + educator role check
│   │   │   ├── page.tsx                  ← Test list (/dashboard)
│   │   │   ├── create/
│   │   │   │   └── page.tsx              ← Create test (/dashboard/create)
│   │   │   └── tests/
│   │   │       └── [id]/
│   │   │           ├── page.tsx          ← Test detail
│   │   │           └── analytics/
│   │   │               └── page.tsx      ← Analytics + leads + email
│   │   ├── t/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              ← Student test page
│   │   │       ├── result/
│   │   │       │   └── page.tsx          ← Rank + leaderboard
│   │   │       └── leaderboard/
│   │   │           └── page.tsx          ← Public leaderboard standalone
│   │   ├── preview/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              ← Educator preview of student view
│   │   └── api/
│   │       └── parse-questions/
│   │           └── route.ts              ← GPT-4o-mini parse endpoint
│   │
│   ├── components/                       ← (See Section 10)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 ← createBrowserClient() for client components
│   │   │   └── server.ts                 ← createServerClient() for server components
│   │   ├── slug.ts                       ← generateSlug(title) → URL-safe string
│   │   ├── username.ts                   ← computeUsername("Priya Sharma") → "Priya S."
│   │   └── utils.ts                      ← formatTime, formatScore, cn() classnames helper
│   │
│   ├── hooks/
│   │   ├── useLeaderboard.ts             ← TanStack Query poll every 15s
│   │   └── useAuth.ts                    ← Current user + which table they're in
│   │
│   ├── store/
│   │   └── useTestStore.ts               ← Zustand: answers, currentQuestion, timeRemaining
│   │                                         (persists in sessionStorage, cleared on submit)
│   │
│   └── types/
│       └── database.ts                   ← Generated Supabase types (run: supabase gen types)
│
├── supabase/
│   ├── migrations/
│   │   └── 20260415_001_initial.sql      ← All CREATE TABLE + RLS statements
│   └── functions/
│       ├── submit-test/
│       │   └── index.ts
│       └── send-email/
│           └── index.ts
│
├── public/
│   ├── logo.svg
│   └── og-image.png                      ← Open Graph image for link previews
│
├── docs/
│   ├── MASTER_PLAN.md                    ← This file
│   ├── testlink-architecture.md          ← Original architecture doc
│   └── testlink-ceo-guide.md             ← Original CEO guide
│
├── .env.local                            ← Local env (never commit)
├── .env.example                          ← Template for env vars
├── middleware.ts                         ← Route protection (root level)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 15. Environment Variables

### `.env.local` (local dev — never commit to git)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (for question parsing)
OPENAI_API_KEY=sk-...

# Resend (for educator email feature)
RESEND_API_KEY=re_...

# App URL (for OAuth redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### `.env.example` (commit this to git)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

### Where Each Variable Is Used

| Variable | Used In | Why |
|----------|---------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions ONLY | Bypasses RLS for backend operations |
| `OPENAI_API_KEY` | `/api/parse-questions` (server) | Never exposed to client |
| `RESEND_API_KEY` | `send-email` Edge Function | Never exposed to client |
| `NEXT_PUBLIC_APP_URL` | Auth callback redirect | Must match Supabase OAuth redirect URL |

---

## 16. Build Phases — Day by Day

### Phase 0 — Foundation (Day 1–2)

- [ ] `npx create-next-app@latest testlink --typescript --tailwind --app`
- [ ] Configure Tailwind with "Rank Red" design tokens
- [ ] Install core packages:
  - `@supabase/ssr @supabase/supabase-js` — database + auth
  - `openai` — GPT-4o-mini
  - `resend` — email
  - `zustand` — test session state
  - `@tanstack/react-query` — server state + leaderboard polling
  - `react-hook-form zod @hookform/resolvers` — forms
  - `sonner` — toast notifications
  - `framer-motion` — animations
  - `recharts` — analytics charts
- [ ] Create Supabase project at supabase.com
- [ ] Enable Google OAuth in Supabase dashboard:
  - Auth → Providers → Google → Enable
  - Add Client ID + Secret from Google Cloud Console
  - Add redirect URL: `http://localhost:3000/auth/callback`
- [ ] Run initial SQL migration (all tables + RLS)
- [ ] Generate TypeScript types: `npx supabase gen types typescript > src/types/database.ts`
- [ ] Build middleware.ts (route protection)
- [ ] Build `/auth/callback/route.ts` (educator/student routing)

### Phase 1 — Landing Page + Educator Auth (Day 3)

- [ ] Landing page (`/`): Hero, HowItWorks, FeatureGrid, Footer
- [ ] Login page (`/login`): Google sign-in button → triggers OAuth with `role=educator`
- [ ] Dashboard layout with auth guard + educator role check
- [ ] `/dashboard` — empty state + [+ Create Test] button

### Phase 2 — Test Creation (Day 4–5)

- [ ] `/api/parse-questions` route (GPT-4o-mini integration)
- [ ] `/dashboard/create` — PasteStep component: textarea + parse button + loading state
- [ ] PreviewStep: rendered Q&A list, ⚠️ flagged questions, answer picker
- [ ] PublishedStep: link display, auto-copy, preview button
- [ ] `.env.local` with OpenAI key connected

### Phase 3 — Student Test Flow (Day 6–7)

- [ ] `/t/[slug]` — TestLanding (pre-login) with test metadata
- [ ] Student Google OAuth → `/auth/callback?role=student&slug=[slug]`
- [ ] TestUI — QuestionCard, QuestionNavGrid, Timer, SubmitBar
- [ ] Zustand store: track answers + time
- [ ] Submit → call `submit-test` Edge Function
- [ ] Redirect to `/t/[slug]/result`

### Phase 4 — Result + Leaderboard (Day 8)

- [ ] `/t/[slug]/result` — auth guard (must have submission)
- [ ] RankReveal animation (framer-motion count-up)
- [ ] ScoreSummary card
- [ ] LeaderboardTable with TanStack Query 15s polling
- [ ] Highlight current user's row

### Phase 5 — Educator Analytics + Leads (Day 9–10)

- [ ] `/dashboard/tests/[id]/analytics` — StatsGrid (4 cards)
- [ ] ScoreDistribution chart (Recharts)
- [ ] StudentLeadTable with checkboxes, email, score, rank
- [ ] EmailModal — subject + body compose
- [ ] `send-email` Edge Function + Resend integration
- [ ] `email_logs` insert on send

### Phase 6 — Polish + Mobile (Day 11–12)

- [ ] Full mobile pass at 375px (every one of the 8 screens)
- [ ] Error states:
  - Test not found → 404 page
  - Test already submitted → "You've already taken this test" with [View Your Result] link
  - Test not published yet → "This test isn't live yet"
- [ ] Loading skeletons on all data-fetching screens
- [ ] Sonner toasts on: copy link, email sent, parse error
- [ ] OG meta tags on `/t/[slug]` for WhatsApp/Telegram link previews
- [ ] Supabase project keep-alive (cron-job.org ping every 5 days)

---

## 17. Monetization Roadmap

### V1 (Launch) — Free For Everyone
- No paywalls
- Focus on getting 5–10 active educators, 50+ submissions
- Collect data, learn what users need

### V2 — First Revenue
| Feature | Who Pays | Price |
|---------|---------|-------|
| Lead CSV Export | Educator | ₹199 one-time per test |
| Unlimited email sends | Educator | ₹199/month (Starter plan) |
| Advanced analytics | Educator | Starter plan |
| Question-by-question evaluation | Student | ₹29 per test unlock |

### V3 — Platform Revenue
| Feature | Who Pays | Price |
|---------|---------|-------|
| Premium Lead Access (all-test leads) | Educator | ₹499/month (Pro plan) |
| Test series / question bank | Educator | Pro plan |
| PDF upload + AI parse | Educator | Pro plan |
| White-label test page (educator branding) | Educator | Pro plan |

**The lead data moat:** Every free user grows the database. When educators see 1,000+ verified student emails in their analytics page and want to download them or email them more than 3x/day, they pay. The data has already been collected — the paywall is on access, not collection.

---

## 18. Infrastructure and Cost

### V1 Launch Stack (Zero Monthly Cost)

| Service | Purpose | Free Tier | Monthly Cost |
|---------|---------|-----------|-------------|
| Vercel | Frontend hosting | Generous | ₹0 |
| Supabase | DB + Auth + Edge Functions | 500MB DB, 50K MAUs | ₹0 |
| Resend | Educator emails | 3,000/month | ₹0 |
| OpenAI | Question parsing | Pay per use | ~₹2–5/month at early scale |
| cron-job.org | Supabase keep-alive ping | Free | ₹0 |
| **Domain** | testlink.in | — | **~₹800/year** |
| **Total** | | | **~₹800 one-time + ₹5/month** |

### When You Start Paying

| Trigger | Service | New Cost |
|---------|---------|---------|
| 50K+ monthly users | Supabase upgrade | $25/month (~₹2,100) |
| 3,000+ emails/month | Resend upgrade | $20/month (~₹1,700) |
| Active parse usage (100+ educators) | OpenAI | ~$5/month (~₹420) |

### Supabase Free Tier Warning

> The Supabase free tier **pauses after 7 days of no database activity.**
> 
> During development and early launch: set up a free cron job at [cron-job.org](https://cron-job.org) to ping your Supabase REST API every 5 days.
> 
> Ping URL: `https://your-project-id.supabase.co/rest/v1/tests?limit=1`
> Headers: `apikey: your-anon-key`

---

*Document version: 1.0*  
*Owner: Nirmallya*  
*Last updated: April 15, 2026*  
*Status: Approved. Ready to build.*
