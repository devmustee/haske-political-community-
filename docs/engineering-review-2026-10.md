# Engineering review: performance, reliability, security, scalability

October 2026. Based on live measurements of `www.abdulrahmanbashirhaske.com`,
read-only checks of the production database, and a code review of `main`
(`61e82c3`) plus the unreleased work on the local branch.

## Summary

The site is slow and posts silently fail for one main reason: **the
database connection setup is wrong for serverless hosting**, made worse by
the app running on a different continent from its database. Both are
configuration fixes, not rewrites. Three code issues amplify the problem and
hide the failures from users. Separately, there are a handful of security
gaps, one of them (an open redirect after sign-in) worth fixing this week.

## Evidence

| Measurement | Result |
|---|---|
| Page response times (`/community`, `/api/auth/session`) | Usually 1–4s, spikes to **10.4s and 10.7s**, one **HTTP 500** on `/community` |
| Where server code runs (`x-vercel-id`) | `iad1`, Washington D.C. |
| Where the database is | Supabase `eu-west-1`, Ireland |
| Database connections | Session pooler `:5432`: **15 of 15 pool connections held** (Supavisor), database max 60 |
| Opening a database connection (from outside Vercel) | 4–5 seconds; Prisma's default connect timeout is 5s |
| Posts in production | No new post since the seed on 26 Sept, although posting was attempted |
| Comments in production | Two by `@admin` at the same minute today: they save, and the duplicate suggests a retry after no visible confirmation |
| Users | 9, all seeded and email-verified |

## Findings

### P0: causing the reported problems

**P0-1. Connection pool exhaustion.**
- **Cause:** production's `DATABASE_URL` uses Supabase's *session* pooler
  (`:5432`) with no `connection_limit`. Every Vercel function instance
  opens Prisma's default pool (about `CPUs × 2 + 1` ≈ 5 connections) and
  holds them for the whole session.
- **Effect:** three warm instances use the pool's 15 slots, so every
  further request **waits for a free connection and then times out**. That
  explains the multi-second pages, the 500s, and actions that sometimes
  save (comments) and sometimes don't (posts).
- **Fix (environment, no code):**
  - `DATABASE_URL` → transaction pooler `:6543` with
    `?pgbouncer=true&connection_limit=1`
  - new `DIRECT_URL` → session pooler `:5432` (used only by migrations)
  - add `directUrl = env("DIRECT_URL")` to the Prisma datasource.

**P0-2. Server code runs an ocean away from the database.**
- **Cause:** functions run in `iad1` (Washington D.C.) while the database
  is in Ireland, so every query pays roughly 70–90 ms there and back.
- **Effect:** a community page makes about 8–12 queries, several of them
  one after another.
- **Fix:** pin functions to Dublin (`"regions": ["dub1"]` in
  `vercel.json`), next to the database. Queries drop to about 1–2 ms each,
  and Dublin is also closer to Nigeria than Washington is.

**P0-3. The session is re-read from the database on almost every call.**
- **Cause:** the `jwt` callback in `src/auth.ts` reloads roles and status
  from the database whenever the token's `rolesLoadedAt` is over 60s old.
  Inside page rendering the refreshed token can't be written back to the
  cookie, so after the first minute **every** `auth()` call queries the
  database.
- **Effect:** a community page calls `auth()` three times (layout, page,
  sidebar), and none of the calls are de-duplicated.
- **Fix:** wrap `auth()` in React `cache()` (once per request), and let only
  `/api/auth/session` (which can save the cookie) refresh roles on its
  schedule.

**P0-4. Failures are invisible to the user.**
- **Cause:** the post composer and comment composer `await` server actions
  with no `try/catch`.
- **Effect:** when an action throws (a timeout, or `requireUser()` failing),
  the button spins forever, nothing saves, and no message appears, so it
  looks like "the post just didn't record".
- **Fix:** catch errors in every client call to a server action, show "That
  didn't go through. Please try again.", and re-enable the button.

### P1: security (fix this week)

| # | Issue | Risk | Fix |
|---|---|---|---|
| S1 | **Open redirect after sign-in:** `router.push(searchParams.get("callbackUrl"))` | A link like `/login?callbackUrl=https://evil.example` sends people to an attacker's page right after a genuine sign-in (phishing) | Accept only same-site paths (`/…`, not `//…`), else go to `/community` |
| S2 | **Missing security headers:** only HSTS is set | Clickjacking (site can be framed), MIME sniffing, referrer leakage | Add `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`; then a CSP in report-only mode |
| S3 | **Rate limits are in-memory per instance** (login, posting, uploads, apply) | On Vercel each instance has its own counter, so brute-force and spam limits don't really hold | Move to a shared store (Upstash Redis, or a Postgres table) |
| S4 | **Uploads trust the browser:** the file extension comes from the user's filename and the type from the browser | With local storage, a file named `x.html` sent as `image/png` is stored as `.html` on the site's own domain (stored XSS) | Choose the extension from the validated type; check the file's magic bytes |
| S5 | **Leaked credentials:** the production DB password was pasted in chat; old seed passwords are in git history | Database takeover; old admin passwords | Rotate the Supabase password (with P0-1, since `DATABASE_URL` changes anyway). Admin passwords were already replaced |
| S6 | **Sign-in forms sent passwords in the URL** when submitted before the page loaded | Passwords in history and server logs | **Fixed** on the local branch (`method="post"`), not yet deployed |
| S7 | `resendVerificationEmail(userId)` takes any user ID | Low: can trigger repeat emails to others (rate-limited) | Derive the user from the session or a token |

### P1: reliability and operations

| # | Issue | Fix |
|---|---|---|
| R1 | **Is email verification deliverable in production?** `requireUser()` blocks unverified users from posting, commenting, liking and applying. If `EMAIL_PROVIDER` isn't `resend` with a valid key in Vercel, **every real new sign-up is stuck** (all current users are seeded and verified, so you won't have noticed) | Check the Vercel env. Send a test sign-up |
| R2 | **Uploads on Vercel:** with `STORAGE_PROVIDER=local`, uploads write to the function's read-only disk and fail | Confirm `STORAGE_PROVIDER=s3` with R2/S3 configured in Vercel |
| R3 | **No error tracking:** failures only reach the Vercel log, which nobody watches | Add Sentry (free tier), plus an alert on 5xx rate |
| R4 | **No staging environment:** changes go straight to production | Use Vercel preview deployments with a separate Supabase project |
| R5 | **Backups:** check what the Supabase plan includes; free tier has daily backups with short retention and no point-in-time recovery | Confirm the plan; test a restore once |

### P2: scalability and performance

- **Community pages are never cached** (`force-dynamic`, `private,
  no-store`). Fine while personalized, but the public parts (sidebar
  trending, official accounts, events) could be cached for 60s with
  `unstable_cache`/tags. That cuts 3 queries per view.
- **Media images are raw `<img>`** at full uploaded size. Use `next/image`
  (or R2 image resizing) for responsive sizes; client-side compression
  already caps them at 2048px.
- **Announcement push fan-out** runs inside one function invocation.
  Beyond a few thousand recipients, move to a queue (Vercel Queues /
  QStash).
- **Hashtag attach** does 2 queries per tag, one after another. Batch with
  `createMany` / a single upsert loop in a transaction.
- **Indexes are mostly right:** `Post(authorId, createdAt)`,
  `Comment(postId, createdAt)`, `Notification(userId, read, createdAt)`.
  Add `Post(deletedAt, createdAt)`, or a partial index, for the main feed
  when posts grow.
- The **feed is paged** (20 per page), so it's good to scale.

### What's in good shape
- Every server action checks sign-in or a permission (except the public
  sign-in/registration flows, as expected).
- Ownership checks on delete/withdraw; admin actions are audited.
- Session invalidation on password change; bcrypt cost 12.
- No `dangerouslySetInnerHTML` anywhere; user text is rendered safely.
- HSTS enabled; Server Actions have built-in CSRF/origin protection.
- Program applications and bank details: encrypted, least-privilege,
  audited, tested (see `program-applications-plan.md`).

## Fix order

1. **Today (environment, about 15 minutes):** P0-1 connection strings +
   `directUrl`, P0-2 region, S5 rotate the DB password; confirm R1 and R2
   in Vercel.
2. **Today (code, small):** P0-3 cached `auth()`, P0-4 error handling,
   S1 open redirect, S2 headers.
3. **This week:** S3 shared rate limiting, S4 upload hardening, R3 Sentry.
4. **Next:** R4 staging, the P2 items.

After step 1–2, re-measure: pages should be well under 1s server time, and
posting/commenting should be reliable.
