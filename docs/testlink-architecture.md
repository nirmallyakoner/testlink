# TestLink — Project Architecture Document
### Instant Test Links for Independent Educators

**Version:** 1.0  
**Date:** April 2026  
**Status:** Pre-Build / Planning Phase

---

## Table of Contents

1. [The Idea](#1-the-idea)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Target Users](#4-target-users)
5. [Core Features & Product Scope](#5-core-features--product-scope)
6. [User Flows](#6-user-flows)
7. [System Architecture](#7-system-architecture)
8. [Database Schema](#8-database-schema)
9. [API Design](#9-api-design)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Monetization Logic](#11-monetization-logic)
12. [Tech Stack](#12-tech-stack)
13. [Build Phases](#13-build-phases)
14. [Folder Structure](#14-folder-structure)
15. [Environment & Infrastructure](#15-environment--infrastructure)
16. [Security Considerations](#16-security-considerations)
17. [Analytics & Tracking](#17-analytics--tracking)
18. [Go-To-Market Summary](#18-go-to-market-summary)

---

## 1. The Idea

TestLink is a platform that allows **independent educators** — YouTube teachers, private tutors, coaching institutes — to instantly convert any question bank into a shareable test link with a public leaderboard.

The core value proposition is **speed and simplicity**:

> Upload a PDF or paste text with questions, options, and correct answers → Get a public link in under 60 seconds → Share it anywhere (WhatsApp, Telegram, YouTube description, Instagram bio) → Students take the test, profiles are created, scores are recorded, a public leaderboard goes live.

The leaderboard creates a **competitive mentality** among students, which drives engagement, repeat test-taking, and organic sharing — making the product market itself.

This is not a classroom tool. It is a **creator tool**. The target is the educator who teaches outside institutions: the YouTube channel with 30K subscribers, the tutor in a city running 80 students offline, the Telegram group admin who shares PDFs.

---

## 2. Problem Statement

### For Educators

- They have question banks — in PDFs, Word files, WhatsApp messages, typed notes.
- They want to test their students, but have no simple way to do it digitally.
- Existing tools (Kahoot, Quizizz, Google Forms) require:
  - School/institutional signup
  - A shared screen / projector (Kahoot)
  - Technical setup that feels like work
  - Monthly subscriptions before the tool even becomes useful
- Google Forms is free but produces no competitive experience, no leaderboard, and no student profiles over time.
- There is no tool designed for the **creator economy educator** — someone whose students are a dispersed audience, not a classroom.

### For Students

- They want to know where they rank among peers.
- Exam-prep culture in India is intensely competitive — students actively seek benchmarking.
- They want evaluation that tells them *what they got wrong and why* — not just a score.
- They have no persistent record of their test history across different educators' tests.

### The Gap

No product in the market combines:
- Instant creation from raw text/PDF
- A publicly shareable link (no student signup required to attempt)
- A live leaderboard visible to all
- Persistent student profiles across tests
- Pricing that works for India (affordable per-test or monthly)

---

## 3. Solution Overview

TestLink operates on three layers:

### Layer 1 — Creator Layer (Educator)
The educator uploads content and gets a link. That's it. Everything else is automated.

### Layer 2 — Test Layer (Student Experience)
Students open the link, enter a name and phone number (OTP verified), and take the test. After submission, they see their score and rank on the public leaderboard.

### Layer 3 — Evaluation Layer (Paid Feature)
Students who want a question-by-question detailed breakdown — with explanations, wrong answer analysis, and time spent per question — pay a small fee to unlock this view.

---

## 4. Target Users

### Primary — The Creator (Educator)

| Attribute | Detail |
|-----------|--------|
| Who | YouTube educators, private tutors, coaching admins |
| Subscriber/student range | 500 – 200,000 |
| Tech comfort | Medium — uses WhatsApp, Telegram, YouTube. Not a developer. |
| Pain | Has questions, has students, no easy test tool |
| Willingness to pay | Low initially, upgrades when student count grows |
| India-specific niches | UPSC, SSC, JEE/NEET, math, finance, spoken English, coding basics |

### Secondary — The Student (Test Taker)

| Attribute | Detail |
|-----------|--------|
| Who | Students of the above educators |
| Age range | 16–30 primarily |
| Motivation | Competitive exam prep, skill building |
| Device | Mobile-first (Android, low-end to mid-range) |
| Willingness to pay | ₹29–99 for detailed evaluation if value is clear |

---

## 5. Core Features & Product Scope

### MVP Features (Phase 1)

- **Educator signup** — email/phone auth, creator profile
- **Test creation** — paste raw text with questions, options, and correct answers in a defined format. System parses and creates test.
- **PDF upload** — upload a PDF; system extracts questions using AI parsing
- **Test configuration** — set title, subject, time limit, optional password
- **Shareable link** — unique URL per test (e.g., `testlink.in/t/upsc-daily-oct-1`)
- **Student test experience** — mobile-first, clean UI, one question at a time (free mode: all questions visible at once, self-navigated)
- **OTP verification** — phone number verified before test submission to prevent duplicates
- **Score calculation** — auto-graded on submission
- **Public leaderboard** — live, shows rank, name, score, time taken. Publicly accessible without login.
- **Basic student profile** — name, phone (masked), tests taken, scores

### Phase 2 Features

- **Question-by-question evaluation mode** (paid) — reveals correct/incorrect per question with explanation
- **Creator dashboard** — see all tests, total students, average scores, top performers
- **Student performance history** — across all tests taken on the platform
- **Test scheduling** — open/close test at specific date and time
- **Creator branding** — add logo, name, color to test page
- **Custom slug** — `testlink.in/t/yourname-test1`

### Phase 3 Features (Post-PMF)

- **Question bank** — save and reuse questions across multiple tests
- **Test series** — group multiple tests into a course-like structure
- **Negative marking** — configurable per test
- **Analytics per question** — see which question most students got wrong
- **Leaderboard embed** — widget educators can embed on their website
- **WhatsApp results bot** — auto-send result to student on WhatsApp after submission

---

## 6. User Flows

### 6.1 — Educator: Create a Test

```
Educator lands on homepage
  → Signs up (email or Google)
  → Onboarding: name, subject focus, student count
  → Dashboard: "Create New Test" button
  → Choose input method:
      Option A: Paste text (with format guide shown)
      Option B: Upload PDF
  → System parses questions → Preview screen
  → Educator reviews, edits if needed
  → Configure test: title, time limit, open/close date (optional)
  → Click "Publish"
  → Test link generated
  → Share screen: copy link / share to WhatsApp / share to Telegram
```

### 6.2 — Student: Take a Test

```
Student opens test link (from WhatsApp / Telegram / YouTube)
  → Landing page: Test title, creator name, subject, number of questions
  → Enter name + phone number
  → OTP sent → verify
  → Test begins (timer shown if time-limited)
  → Answer all questions (free mode: all visible, can navigate back)
  → Submit
  → Score shown immediately
  → Leaderboard shown: their rank among all students
  → Option: "Get detailed evaluation" → ₹29 unlock
```

### 6.3 — Student: Detailed Evaluation (Paid)

```
After score shown:
  → Click "Get Detailed Evaluation"
  → Payment screen: ₹29 via Razorpay (UPI / card / netbanking)
  → Payment success
  → Full question-by-question breakdown unlocked:
      - Question shown
      - Their answer (highlighted red/green)
      - Correct answer
      - Explanation (if educator added one)
      - Time spent on that question
  → Option to share score card image (with branding)
```

### 6.4 — Educator: View Results

```
Educator logs into dashboard
  → Select test
  → See: total attempts, average score, score distribution chart
  → Leaderboard (same as public, but with more detail)
  → Per-student: name, score, time taken, phone (masked)
  → Export CSV (Pro feature)
```

---

## 7. System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│  Next.js (Web App) — Educator Dashboard + Test Interface │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│                      API LAYER                           │
│              Node.js + Express REST API                  │
│         (Auth, Test CRUD, Submission, Payments)          │
└───────────┬──────────────────────────┬──────────────────┘
            │                          │
┌───────────▼──────────┐  ┌────────────▼───────────────────┐
│    PostgreSQL DB      │  │        Redis Cache              │
│  (Primary data store) │  │  (Leaderboard, OTP, Sessions)  │
└───────────────────────┘  └────────────────────────────────┘
            │
┌───────────▼──────────┐
│    File Storage       │
│  (S3 / Cloudflare R2) │
│  PDF uploads, assets  │
└───────────────────────┘
            │
┌───────────▼──────────┐
│   AI Parsing Service  │
│  (PDF → Questions)    │
│  OpenAI / Claude API  │
└───────────────────────┘
```

### Key Architectural Decisions

**Why Next.js?**  
Full-stack capability. Server-side rendering for test pages (good for SEO and fast first load on mobile). API routes for lightweight endpoints. Can host on Vercel at zero cost initially.

**Why PostgreSQL?**  
Relational data fits this problem well — educators, tests, questions, students, submissions all have clear relationships. JSONB support handles flexible question formats without separate migrations.

**Why Redis?**  
Leaderboard is the most-read piece of data. Redis sorted sets are perfect for real-time ranked leaderboards. OTP storage with TTL is another natural fit.

**Why Razorpay?**  
India-first payment gateway. Supports UPI (the dominant payment method in India), cards, netbanking, and wallets. Easy integration and ₹0 monthly fee — pay per transaction only.

---

## 8. Database Schema

### `educators` table
```sql
CREATE TABLE educators (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(300) UNIQUE,
  phone         VARCHAR(20) UNIQUE,
  password_hash TEXT,
  plan          VARCHAR(20) DEFAULT 'free',    -- free | starter | pro
  slug          VARCHAR(100) UNIQUE,           -- custom URL prefix
  logo_url      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### `tests` table
```sql
CREATE TABLE tests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id     UUID REFERENCES educators(id),
  title           VARCHAR(300) NOT NULL,
  subject         VARCHAR(100),
  slug            VARCHAR(200) UNIQUE NOT NULL,  -- used in URL
  description     TEXT,
  time_limit_mins INTEGER,                       -- NULL = no limit
  is_published    BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  opens_at        TIMESTAMPTZ,
  closes_at       TIMESTAMPTZ,
  password_hash   TEXT,                          -- optional test password
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `questions` table
```sql
CREATE TABLE questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id       UUID REFERENCES tests(id),
  order_index   INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a      TEXT NOT NULL,
  option_b      TEXT NOT NULL,
  option_c      TEXT,
  option_d      TEXT,
  correct       CHAR(1) NOT NULL,               -- 'a' | 'b' | 'c' | 'd'
  explanation   TEXT,                           -- shown in paid evaluation
  marks         INTEGER DEFAULT 1,
  negative_marks NUMERIC(3,1) DEFAULT 0
);
```

### `students` table
```sql
CREATE TABLE students (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(200) NOT NULL,
  phone        VARCHAR(20) UNIQUE NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `submissions` table
```sql
CREATE TABLE submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id        UUID REFERENCES tests(id),
  student_id     UUID REFERENCES students(id),
  answers        JSONB NOT NULL,               -- { "q_id": "a", "q_id2": "c" }
  score          NUMERIC(6,2),
  total_marks    INTEGER,
  time_taken_sec INTEGER,
  evaluation_paid BOOLEAN DEFAULT false,
  submitted_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `payments` table
```sql
CREATE TABLE payments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id      UUID REFERENCES submissions(id),
  student_id         UUID REFERENCES students(id),
  amount_paise       INTEGER NOT NULL,           -- in paise (₹29 = 2900)
  razorpay_order_id  TEXT,
  razorpay_payment_id TEXT,
  status             VARCHAR(20) DEFAULT 'pending',  -- pending | success | failed
  created_at         TIMESTAMPTZ DEFAULT NOW()
);
```

### `otps` table (or use Redis with TTL)
```sql
CREATE TABLE otps (
  phone      VARCHAR(20) PRIMARY KEY,
  otp        CHAR(6),
  expires_at TIMESTAMPTZ,
  attempts   INTEGER DEFAULT 0
);
```

---

## 9. API Design

All API routes follow REST conventions. Base URL: `/api/v1`

### Auth Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | Educator signup with email+password |
| POST | `/auth/login` | Educator login, returns JWT |
| POST | `/auth/otp/send` | Send OTP to student phone |
| POST | `/auth/otp/verify` | Verify OTP, return student session token |

### Educator Endpoints (requires educator JWT)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/educator/me` | Get educator profile |
| PUT | `/educator/me` | Update profile |
| GET | `/educator/tests` | List all tests by educator |
| POST | `/tests` | Create new test |
| GET | `/tests/:id` | Get test details |
| PUT | `/tests/:id` | Update test |
| DELETE | `/tests/:id` | Delete test |
| POST | `/tests/:id/publish` | Publish test (generate link) |
| GET | `/tests/:id/submissions` | Get all submissions for a test |
| GET | `/tests/:id/analytics` | Aggregate analytics |

### Test Creation — Input Parsing

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/parse/text` | Parse raw text into questions array |
| POST | `/parse/pdf` | Upload PDF, extract and parse questions |

### Student / Public Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/t/:slug` | Get public test metadata (title, creator, question count) |
| GET | `/t/:slug/questions` | Get questions (after OTP verified, time-limited token) |
| POST | `/t/:slug/submit` | Submit answers |
| GET | `/t/:slug/leaderboard` | Get public leaderboard (paginated) |
| GET | `/submissions/:id` | Get own submission result |
| GET | `/submissions/:id/evaluation` | Get detailed evaluation (paid) |

### Payment Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/payments/create-order` | Create Razorpay order for evaluation unlock |
| POST | `/payments/verify` | Verify payment signature, unlock evaluation |

---

## 10. Frontend Architecture

### Pages / Routes

```
/                        → Homepage (educator landing + CTA)
/signup                  → Educator signup
/login                   → Educator login
/dashboard               → Educator dashboard (test list, stats)
/dashboard/create        → Create new test (text paste / PDF upload)
/dashboard/tests/:id     → Test detail (questions preview, settings)
/dashboard/tests/:id/results → Submissions & analytics
/t/:slug                 → Public test page (student facing)
/t/:slug/leaderboard     → Public leaderboard page
/student/profile         → Student profile (test history)
/payment/success         → Post-payment success + evaluation unlock
```

### Component Structure

```
src/
├── components/
│   ├── ui/                  ← shared: Button, Input, Modal, Toast
│   ├── test/
│   │   ├── QuestionCard.tsx
│   │   ├── Timer.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ResultCard.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   └── RankBadge.tsx
│   ├── dashboard/
│   │   ├── TestCard.tsx
│   │   ├── StatsRow.tsx
│   │   └── SubmissionTable.tsx
│   └── create/
│       ├── TextParser.tsx
│       ├── PDFUploader.tsx
│       └── QuestionPreview.tsx
├── pages/
├── lib/
│   ├── api.ts             ← axios instance, interceptors
│   ├── auth.ts            ← JWT handling
│   └── razorpay.ts        ← payment helpers
└── store/
    └── useTestStore.ts    ← Zustand state for active test session
```

### Key Frontend Decisions

**Mobile-first design**: Students will primarily open test links on phones. Every screen — especially the test taking UI and leaderboard — must work perfectly on a 375px Android screen.

**No test state in URL**: Active test session state lives in Zustand + sessionStorage, not URL params. Prevents cheating via URL manipulation.

**Leaderboard polling**: Leaderboard page polls `/t/:slug/leaderboard` every 15 seconds for live updates. Use `SWR` or `React Query` with `refreshInterval`.

**OTP flow**: Student enters phone → OTP SMS sent → OTP verified → short-lived JWT (2 hours) stored in sessionStorage → used for question fetch and submission. Student does not create a password.

---

## 11. Monetization Logic

### Revenue Streams

#### Stream 1 — Student Evaluation Unlock
- Trigger: After test submission, student wants question-by-question breakdown
- Price: ₹29 per test unlock (impulse price, below friction threshold)
- Optional subscription: ₹99/month for unlimited evaluation unlocks
- This is the primary early revenue driver

#### Stream 2 — Creator Starter Plan (₹199/month)
- Unlocks: up to 500 students per test, branded test page with creator name/logo, shareable leaderboard permalink
- Target: Educator with 1,000–10,000 students who has outgrown the free tier

#### Stream 3 — Creator Pro Plan (₹499/month)
- Unlocks: unlimited students, advanced analytics, CSV export, custom test slug, priority support
- Target: Serious educator with 10,000+ students or running test series

### Free Tier Limits

| Feature | Free | Starter | Pro |
|---------|------|---------|-----|
| Tests per month | Unlimited | Unlimited | Unlimited |
| Students per test | 100 | 500 | Unlimited |
| Public leaderboard | Yes | Yes | Yes |
| Creator branding | No | Yes | Yes |
| Analytics | Basic | Basic | Advanced |
| CSV export | No | No | Yes |
| Custom slug | No | No | Yes |
| Question explanations | No | Yes | Yes |

### Student Evaluation Unlock Logic (Backend)

```
On submission:
  → Calculate score
  → Store submission
  → Return: score, rank, leaderboard snippet
  → evaluation_paid = false on submission record

On student clicking "Get Evaluation":
  → POST /payments/create-order
    { submission_id, amount: 2900 }
  → Create Razorpay order
  → Return order_id to frontend
  → Frontend opens Razorpay checkout
  → On success: POST /payments/verify
    { razorpay_payment_id, razorpay_order_id, razorpay_signature }
  → Verify signature (HMAC SHA256 with secret)
  → Set submission.evaluation_paid = true
  → Return full question-by-question evaluation
```

---

## 12. Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma (with PostgreSQL)
- **Auth**: JWT (jsonwebtoken), bcrypt for passwords
- **Validation**: Zod
- **File handling**: Multer (upload), pdf-parse (PDF extraction)
- **AI parsing**: OpenAI GPT-4o API or Anthropic Claude API — for converting unstructured PDF question text into structured JSON
- **SMS OTP**: Twilio or MSG91 (MSG91 is cheaper for India)
- **Payments**: Razorpay Node SDK
- **Cache**: ioredis (Redis client)
- **Job queue**: Bull (for async PDF parsing jobs)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (client state), React Query (server state / caching)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (for dashboard analytics)
- **Payment**: Razorpay.js (frontend SDK)
- **Notifications**: react-hot-toast

### Infrastructure
- **Hosting (Frontend)**: Vercel (free tier initially)
- **Hosting (Backend)**: Railway or Render (free tier → $7/month paid)
- **Database**: Supabase PostgreSQL (free tier: 500MB, enough for months)
- **Redis**: Upstash Redis (serverless, pay-per-request, generous free tier)
- **File Storage**: Cloudflare R2 (S3-compatible, zero egress fee)
- **Domain**: `.in` domain preferred (testlink.in)
- **CDN**: Cloudflare

### Development Tools
- **Monorepo**: Single repo with `/backend` and `/frontend` folders
- **Package manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest (unit), Playwright (e2e for critical flows)
- **CI/CD**: GitHub Actions → auto-deploy to Vercel + Railway on merge to main

---

## 13. Build Phases

### Phase 0 — Foundation (Week 1–2)

Goal: Codebase skeleton running locally end-to-end.

Tasks:
- [ ] Initialize monorepo (pnpm workspaces)
- [ ] Backend: Express + TypeScript + Prisma setup
- [ ] Database: Supabase project, run initial migrations
- [ ] Frontend: Next.js 14 project, Tailwind configured
- [ ] Auth: Educator signup/login with JWT
- [ ] Basic test creation: manual question entry (no PDF yet)
- [ ] Test published → shareable link works
- [ ] Student opens link → can see test → can submit
- [ ] Score calculated and returned

Deliverable: A working prototype (ugly is fine) that completes the educator create → student submit flow.

---

### Phase 1 — MVP (Week 3–5)

Goal: Real product. Clean UI. Ready for first 20 educators.

Tasks:
- [ ] OTP verification for students (MSG91 integration)
- [ ] Leaderboard: Redis sorted set, live rank, public page
- [ ] Student profiles: persistent across tests via phone number
- [ ] Text parser: structured format for educators to paste questions
- [ ] Test configuration: time limit, title, subject
- [ ] Mobile-first UI polish (test taking screen is priority)
- [ ] Educator dashboard: list tests, see submission count
- [ ] "Powered by TestLink" footer on leaderboard page (growth mechanic)
- [ ] Error handling: OTP failures, duplicate submissions, test closed

Deliverable: Product ready for first real users. Target: onboard 20 educators manually.

---

### Phase 2 — Revenue (Week 6–9)

Goal: First revenue. Real student + educator payment flows.

Tasks:
- [ ] PDF upload + AI parsing (GPT-4o API call to extract questions from PDF)
- [ ] Razorpay integration: student evaluation unlock (₹29)
- [ ] Question-by-question evaluation UI
- [ ] Educator plan upgrade flow (₹199 / ₹499/month via Razorpay subscription)
- [ ] Plan enforcement: student limit check per plan
- [ ] Creator branding: logo + name on test page (Starter+)
- [ ] Analytics dashboard: score distribution, average, top questions missed
- [ ] Email receipts on payment

Deliverable: MRR > ₹0. First paying students and/or educators.

---

### Phase 3 — Growth (Week 10–16)

Goal: Organic distribution. Reduce churn. Add stickiness.

Tasks:
- [ ] Score card image generation (shareable image of student's rank/score)
- [ ] Question bank: save questions, reuse across tests
- [ ] Test series: group tests into a course
- [ ] Negative marking support
- [ ] Per-question analytics: which questions most students got wrong
- [ ] Custom test slugs for Pro educators
- [ ] Embed widget: leaderboard iframe embed for educator websites
- [ ] Referral tracking: which educators drive most student signups
- [ ] SEO landing pages: `/for-upsc-educators`, `/for-math-tutors`

---

## 14. Folder Structure

```
testlink/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── tests.ts
│   │   │   ├── submissions.ts
│   │   │   ├── payments.ts
│   │   │   └── parse.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── test.controller.ts
│   │   │   ├── submission.controller.ts
│   │   │   └── payment.controller.ts
│   │   ├── services/
│   │   │   ├── leaderboard.service.ts  ← Redis sorted set logic
│   │   │   ├── otp.service.ts
│   │   │   ├── parser.service.ts       ← PDF + text parsing
│   │   │   ├── scoring.service.ts
│   │   │   └── razorpay.service.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── validate.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── redis.ts
│   │   │   └── openai.ts
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 ← Homepage
│   │   │   ├── dashboard/
│   │   │   ├── t/[slug]/
│   │   │   │   ├── page.tsx             ← Test landing page
│   │   │   │   └── leaderboard/
│   │   │   └── student/
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .env.example
├── pnpm-workspace.yaml
└── README.md
```

---

## 15. Environment & Infrastructure

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=...                  # for PDF parsing

MSG91_AUTH_KEY=...                  # OTP SMS India
MSG91_TEMPLATE_ID=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=testlink-uploads

# Frontend
NEXT_PUBLIC_API_URL=https://api.testlink.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

### Cost at Scale (Estimates)

| Service | Free Tier | Paid Tier | When to upgrade |
|---------|-----------|-----------|-----------------|
| Vercel (Frontend) | Generous free | $20/month | 10M+ requests |
| Railway (Backend) | $5 credit/month | $10–20/month | At launch |
| Supabase (DB) | 500MB / 2 projects | $25/month | ~5,000 educators |
| Upstash Redis | 10K requests/day | $0.2 per 100K | Moderate scale |
| Cloudflare R2 | 10GB / 1M ops | $0.015/GB | Never a problem early |
| MSG91 OTP | Pay per SMS | ~₹0.15/OTP | Always pay-per-use |
| OpenAI API | Pay per token | ~₹2–5 per PDF parse | Always pay-per-use |

**Total infra cost at MVP:** ~$20–30/month (≈ ₹2,000–2,500)

---

## 16. Security Considerations

### Anti-Cheating
- OTP verification before test start prevents anonymous mass attempts
- One submission per phone number per test (enforced at DB level with unique constraint on `test_id + student_id`)
- Questions delivered only after OTP verification, with a time-limited signed token
- Answer submission endpoint validates that: (a) student token is valid, (b) test is still open, (c) submission doesn't already exist

### Payment Security
- Razorpay webhook signature verification (HMAC SHA256) before unlocking evaluation
- Never trust frontend payment success — always verify on backend
- Payment status stored server-side; evaluation_paid flag set only after verified webhook

### General
- Rate limiting on OTP send endpoint (max 3 OTPs per phone per 10 minutes)
- Rate limiting on test submission (max 2 attempts per IP per minute)
- Input sanitization on all text fields (prevent XSS)
- SQL injection prevention via Prisma parameterized queries
- PDF file validation: type check, size limit (10MB), scan for malicious content

---

## 17. Analytics & Tracking

### Product Analytics (Posthog — free self-hosted or cloud)

Key events to track:
- `test_created` — educator creates test
- `test_published` — educator publishes and gets link
- `test_link_opened` — student opens link
- `otp_verified` — student verified and starts test
- `test_submitted` — student submits
- `evaluation_unlocked` — student pays ₹29
- `educator_upgraded` — educator upgrades to paid plan

Key funnels to measure:
1. Educator signup → first test created → first test published (creator activation)
2. Test link opened → OTP verified → test submitted → evaluation unlocked (student conversion)

### Business Metrics (track in a simple spreadsheet weekly)

- MRR (monthly recurring revenue)
- Number of active educators (created ≥ 1 test in last 30 days)
- Number of test links shared (tests published)
- Total test submissions (student volume)
- Evaluation unlock rate (submissions → paid)
- Educator upgrade rate (free → paid)

---

## 18. Go-To-Market Summary

### Phase 0 → Phase 1 (Months 1–2)

**Who to acquire first**: YouTube educators in UPSC, SSC, JEE, finance niches with 5K–100K subscribers.

**How**:
- Manual YouTube search by niche → DM via YouTube community tab or Instagram
- Message: "I built a tool that turns your question PDFs into a test link with a leaderboard. Takes 60 seconds. Free forever for up to 100 students. Want to try?"
- Offer: Free Pro for 3 months in exchange for honest feedback

**Target**: 20 active educators by end of month 1.

### Phase 1 → Phase 2 (Months 2–4)

**Growth through the leaderboard**: Every test link opens to a public leaderboard with "Create your test free at TestLink →" in the footer. Every student becomes a potential educator acquisition.

**Telegram community seeding**: Post a live test in relevant preparation Telegram groups (UPSC, SSC, JEE) as a demo. "Take this daily current affairs test — see where you rank." Let the product demonstrate itself.

**Content**: One YouTube short or LinkedIn post per week. Topic: the problem ("Why are 500K YouTube educators still using Google Forms?") and the solution.

### Pricing Activation

- Month 1: Free only. Focus on product quality and educator adoption.
- Month 2: Launch ₹29 student evaluation unlock. First revenue.
- Month 3: Launch ₹199 and ₹499 educator plans. Target 5 paying educators.
- Month 6 target: ₹1,00,000 MRR (combination of student + educator revenue)

### North Star Metric

**Number of test submissions per week.** This metric captures both educator activity (creating and sharing tests) and student engagement. Everything — product decisions, GTM, content — should be measured against whether it moves this number up.

---

*Document last updated: April 2026*  
*Owner: Nirmallya*  
*Status: Planning — pre-build*
