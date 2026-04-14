# TestLink — CEO Mindset Guide
### Idea Validation + WOW Factor Strategy + V1 Feature List
**Owner:** Nirmallya | **Date:** April 2026 | **Budget:** ₹2,000 now, max ₹5,000 total

---

## Part 1 — Is This Idea Real? (Honest Validation, April 2026)

### The Market Is Genuinely Big

India's EdTech market is valued at over **$12 billion as of 2024** and is projected to cross $61 billion by 2035. More importantly for you, the **test preparation segment dominates** the market — driven by UPSC, SSC, JEE, NEET, and nursing exams. This is not a dying space. This is one of the fastest-growing segments in Indian digital products.

India now has **over 886 million internet users**, with 55% from rural areas, and monthly data costs of around ₹14/GB — cheapest in the world. Students from Tier 2 and Tier 3 cities are already consuming YouTube education daily. The audience exists. It's not a future bet — it's today's reality.

### The Gap You're Targeting Is Real

Here's what the market looks like right now for your specific target (independent educators who aren't institutions):

| Tool | Problem for independent educators |
|------|----------------------------------|
| **Kahoot** | Requires shared screen and live session. Useless for YouTube/Telegram educators. Starts at $3.99/month even for basics. |
| **Quizizz** (rebranded as Wayground in early 2025) | Classroom-first. No public shareable leaderboard. Designed for school use, not creator economy. |
| **Google Forms** | Free but zero competitive experience, no leaderboard, no student profiles. Still widely used because nothing better exists. |
| **Classplus / Teachmint** | Classplus had $129M in funding and is now pivoting to offline colleges. Teachmint pivoted to selling hardware smart boards. Neither cares about the solo YouTube educator anymore. |

**The key insight: All these tools are either classroom-first or institution-first. Nobody has built a tool that is creator-first and competitive-exam-student-first at the same time.** That is your gap.

### Your Unfair Advantage Nobody Talks About

You have two things other founders don't:

1. **You're a frontend developer.** You don't need to pay anyone for the UI. That alone saves you ₹30,000–₹80,000 in MVP cost.

2. **Your girlfriend is in nursing.** India has hundreds of nursing entrance exams — AIIMS BSc Nursing (exam: June 27, 2026), NORCET for nursing officer posts across AIIMS and JIPMER, and state government staff nurse recruitment drives that happen year-round. These exams have thousands of aspirants and almost zero good creator tools built specifically for them. This is your beachhead niche.

---

## Part 2 — Why It's NOT a WOW Yet (And How to Fix It)

### What's Missing Right Now

Your current idea is a test tool. That's fine, but it's not a wow. When you describe it to someone, they think "oh, like Google Forms but with a leaderboard." That's not wrong — but it's not exciting enough to make someone stop scrolling.

**The wow isn't in the feature. The wow is in the outcome story.**

Here's the reframe:

> "You're a nursing educator on YouTube with 8,000 subscribers. You post a video, paste a link in the description, 400 students take the test in 24 hours, a leaderboard shows who's #1 in India for that topic, and students are tagging each other in comments saying 'I beat you.' You didn't build a classroom. You built a competitive event — from your phone."

That is the wow. It's not about the tool. It's about **what the educator feels like after their first test goes live.**

### Three WOW Moves You Can Make Without Spending Money

**WOW Move 1 — The Shareable Rank Badge**
After a student submits, show them a shareable card: *"I ranked #47 among 1,200 students on [Educator Name]'s AIIMS Nursing Mock Test."* Students will post this on Instagram Stories and WhatsApp status. Every share is a free ad for both the educator and TestLink. This is free to build — just a canvas-rendered image using the browser's Canvas API.

**WOW Move 2 — The "Live" Leaderboard Feel**
Don't show a static table. Show the leaderboard refreshing every 30 seconds. When a student sees "you just moved from #34 to #22" — they feel something real. That feeling is your retention and your word-of-mouth. Costs zero extra to build.

**WOW Move 3 — Zero Friction Student Entry**
No app download. No student account creation. Open the link, enter name and phone, get OTP, take test. Done. In 2026, every platform is adding friction. You remove it. A student in a village with a ₹8,000 Android phone should complete the link-to-rank flow in under 90 seconds. That will be remembered, talked about, and shared.

---

## Part 3 — Budget Reality Check (April 2026 Prices)

You have ₹2,000 to spend now and max ₹5,000 total. Here's the real math:

### Infrastructure Cost (Monthly, MVP Phase)

| Service | What it does | Free Tier | When You Pay |
|---------|-------------|-----------|-------------|
| **Vercel** | Frontend hosting | Generous free | Only at 10M+ requests |
| **Supabase** | Database + Auth + Edge Functions | Free: 500MB DB, 50K MAUs — but pauses after 7 days of inactivity | $25/month when real users arrive |
| **Upstash Redis** | Leaderboard (optional in V1) | 10K requests/day free | ₹0.2 per 100K |
| **Cloudflare R2** | PDF storage (V2 feature) | 10GB + 1M ops free | Never a problem early |
| **MSG91 OTP** | Phone verification | Pay per use | ~₹0.25 per OTP SMS |
| **Razorpay** | Payments (V2 feature) | Free setup, zero monthly fee | 2% per successful transaction only |

**Real cost at zero users: ₹0/month.**
**Real cost at 50 educators + 500 student tests/month: ~₹300–500/month (mostly OTP costs).**

> **Important:** Supabase free tier pauses after 7 days of no database activity. Set up a simple free cron job (cron-job.org) to ping your DB endpoint every 5 days during early days.

### The Backend Problem — And Your Solution

You're a frontend developer. The honest challenge: TestLink needs server-side logic for OTP verification, score calculation, and payment webhook handling. You cannot skip this.

**Best option at this budget: Use Supabase as your entire backend.** Supabase gives you:
- PostgreSQL database
- Auth (for educator login)
- Edge Functions (serverless TypeScript — write your OTP trigger, score logic, and Razorpay webhook here)
- Realtime subscriptions (leaderboard auto-updates without extra setup)

You write zero backend server code. You stay in JavaScript/TypeScript. You ship faster. You save money.

### What You Actually Need to Spend to Launch

- Domain name (testlink.in or similar): ~₹800–1,500/year
- MSG91 wallet top-up for testing: ~₹200
- **Total to launch MVP: ₹1,000–1,700** — well within your ₹2,000

---

## Part 4 — Competitive Landscape (April 2026)

### Who Could You Bump Into?

**Examifly** — Launched February 2026 with an AI chat-based mock test platform. They are student-facing (students generate their own tests by chatting with AI). They are NOT educator-facing and don't solve the "educator uploads content and shares a link" problem. Different product.

**Testbook** (owned by Classplus) — Focuses on large-scale exam prep courses and mock test series. Charges ₹500–₹2,000 for course packages. Not a tool for independent educators to create their own tests. Content platform, not creator tool.

**Physics Wallah, Unacademy, Vedantu** — All building full course ecosystems. They are not going to build a simple shareable test link tool for small independent educators. Too small a problem for them at their scale.

**Google Forms** — Still your biggest indirect competitor because it's free and familiar. Your job is to make TestLink so much better that switching feels obvious and takes under 5 minutes.

### The Real Competitive Gap

Nobody in India has built a tool that combines:
- A public shareable test link (no student login required)
- A live public leaderboard
- OTP-verified submissions (prevents duplicates)
- Pricing that works for a 200-student independent educator

That specific combination does not exist as of April 2026. That is the window.

---

## Part 5 — Your Niche Strategy (Start Here, Not Everywhere)

Don't build for all of India. Build for one niche first.

### Target Niche: Nursing Exam Aspirants and Educators

**Why this niche works right now:**
- AIIMS BSc Nursing 2026 exam is on June 27, 2026 — a real calendar event to build urgency around
- NORCET (Nursing Officer recruitment for AIIMS/JIPMER) is a major recurring exam
- State government staff nurse recruitment drives happen year-round across all states
- Nursing educators on YouTube are small channels (5K–50K subscribers) — reachable by direct DM
- Your girlfriend is your warm introduction. That's not a small thing.

**The big EdTech companies are ignoring nursing.** Physics Wallah, Unacademy, and Vedantu are focused on UPSC/JEE/NEET. Nursing is a large category with serious competition among students and almost no good digital tools for educators. That's your edge.

---

## Part 6 — V1 Feature List (Your Contract With Yourself)

If it's not on this list, you don't build it for V1. Not because it's a bad idea — because you need to validate first.

### MUST BUILD (V1)

**Educator Side:**
- Email or Google signup for educator
- Create a test by pasting text in a structured format
- Format example: `Q: What is X? | A: Option 1 | B: Option 2 | C: Option 3 | D: Option 4 | ANS: B`
- Preview the parsed test before publishing
- Publish test → get a shareable URL
- Dashboard showing all tests (title, attempt count, date)

**Student Side:**
- Open test link — no login required
- Enter name + phone number
- Receive OTP via SMS (MSG91)
- After OTP verification, test begins
- All questions visible at once, can navigate back, submit at the end
- Score shown immediately after submission
- Public leaderboard shown with their rank

**Leaderboard:**
- Public — no login required to view
- Shows: Rank, First Name + Last Initial, Score, Time Taken
- Auto-refreshes every 30 seconds

### DO NOT BUILD IN V1

- PDF upload / AI parsing — too complex, add in V2
- Paid evaluation unlock (₹29 feature) — add in V2 after you see real usage
- Creator analytics dashboard with charts — add in V2
- Custom branding or logo on test page — add in V2
- Test scheduling / open-close dates — add in V2
- Student performance history across tests — add in V2
- Negative marking — add in V2
- WhatsApp results bot — add much later
- Mobile app — responsive web is enough, don't build an app

### Why Only This?

There is one question you're trying to answer with V1: **Will educators actually share a test link with their students?**

Everything in this V1 exists to answer that one question. You cannot learn that from a PDF parser or an analytics dashboard. Keep it small. Answer the question.

---

## Part 7 — Tech Stack for V1

Chosen to play to your strengths as a frontend developer:

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | Next.js + Tailwind CSS | You know React. Next.js gives API routes and SSR for the leaderboard page. |
| Database + Auth + Backend | Supabase | Replaces your entire backend. PostgreSQL + Auth + Edge Functions + Realtime. Free tier covers V1. |
| OTP | MSG91 | India-specific, reliable, ~₹0.25/SMS, clean API. |
| Hosting | Vercel | Free tier is generous. One-command deploy from GitHub. |
| Payments (V2, not V1) | Razorpay | 2% per transaction, no setup fee, UPI/cards/netbanking all included. |
| File Storage (V2, not V1) | Cloudflare R2 | For PDFs when you add upload. |

**You do not need:** A separate Node.js server, Redis (for V1 leaderboard, Supabase Realtime is enough), Docker, or anything complex.

---

## Part 8 — Go-To-Market for V1 (Free, No Ads)

### Week 1–2: Build and Deploy

Get V1 live. Don't obsess over design. Obsess over the core flow working cleanly: educator creates test → shares link → student takes test → leaderboard appears. That's it.

### Week 3–4: First 5 Educators (Nursing Niche)

Your girlfriend finds 5 nursing exam YouTube educators. She messages them directly. Suggested DM:

> "Hi [Name], I'm a nursing student and my partner built a tool that turns any MCQ set into a shareable test link with a live leaderboard. Students just open the link, verify OTP, take the test, and see their rank instantly. No app download. No student login. Takes under 60 seconds to set up. Completely free. Would you like to try it for your next practice test?"

Get 5 educators to try it. Watch what happens.

### Week 5–8: Learn and Fix

Talk to every educator who used it. Ask three questions:
- What was confusing?
- Did your students actually take the test?
- What would make you use this every week?

Come back with those answers. That becomes your V2 list.

### What Success at End of V1 Looks Like

- 5–10 active educators who have created at least 1 test
- At least 50 total student test submissions
- At least 1 educator who used it more than once without being asked to

If you hit these, you have validation. If you don't, you have answers about why not. Both outcomes are valuable.

---

## Part 9 — The One Thing That Will Make or Break This

**The product lives or dies on how fast a student gets from the test link to seeing their rank.**

If it takes more than 3 minutes from link-click to leaderboard, students drop off. If the OTP is slow, students abandon. If the test breaks on a mid-range Android phone, students don't come back.

Every week of building, ask yourself: *did I make the link-to-rank experience faster or slower this week?* That is your north star.

---

## Part 10 — Full Summary

| Topic | Decision |
|-------|----------|
| Idea validity | Real gap. Right timing. Underserved niche. ✅ |
| Market size | India EdTech $12B today, $61B by 2035. Test prep is the dominant segment. |
| Biggest competitors | Google Forms (indirect), Wayground/Quizizz (classroom-first), Examifly (student-facing, not educator-facing) |
| Your moat | Creator-first + public leaderboard + zero friction entry = unique combination |
| WOW factors | Rank badge sharing, live leaderboard feel, 90-second student flow |
| Starting niche | Nursing exam educators — use your girlfriend's warm network |
| V1 must-builds | Text-based test creation, OTP verification, score, public leaderboard |
| V1 hard skips | PDF upload, paid unlock, analytics, branding, scheduling, mobile app |
| Budget to launch | ₹1,000–1,700 (domain + MSG91 wallet top-up) |
| Monthly infra cost | ₹0 until real users arrive. ~₹300–500/month at early traction. |
| Backend strategy | Supabase Edge Functions — no separate server, no extra cost |
| Success metric for V1 | 5 active educators, 50 submissions, 1 repeat user |
| First outreach method | Warm DM from your girlfriend to nursing YouTube educators |

---

*Document prepared: April 15, 2026*
*All market data, pricing, and competitor analysis based on April 2026 research*
*This is your V1 contract. Build only what is on this list. Validate. Then come back.*
