# Production readiness review

10 October 2026, after deploying `73379b9` (Dublin region, cached session,
error messages, security headers). Based on live measurements of
`www.abdulrahmanbashirhaske.com` as a signed-out visitor, and a code review.
Follows on from `engineering-review-2026-10.md`.

## Verdict

**Ready for a soft launch with known members, not yet for a public launch.**
The server-side problems from the first review are fixed: posts and comments
now save, and the server responds in about half a second. What remains is
mostly **how the app behaves on a slow, variable network** (the reality for
most of the audience), plus operational gaps that would leave the team blind
when something breaks. The "must fix" list below is about 2–3 days of work.

## What the fixes changed (measured)

| | Before | Now |
|---|---|---|
| Server region (`x-vercel-id`) | `iad1` Washington | `dub1` Dublin, next to the database |
| `/api/auth/session` | 0.7–10.7s | 0.66–0.70s, steady |
| `/community`, compressed | 1–10.4s, one HTTP 500 | 1.0–1.3s, no errors in any test request |
| New posts | none saved since 26 Sept | a new post is at the top of the feed |
| Comments | sometimes saved | saved and visible on the post page (checked two posts as a visitor) |

## Why it still feels slow

1. **The network path, not the app.** Requests from here go through Vercel's
   Cape Town edge (`cpt1`) to Dublin. Plain round-trip cost is about 0.65s,
   and it varies a lot: a static `robots.txt` once took 5.5s and the static
   `/programs` page once took 8.5s, with no server work involved. The app
   can't fix the network, but it can stop making people wait for it.
2. **Every action costs two round trips, and the screen shows nothing in
   between.** Posting a comment waits for the server action, then
   `router.refresh()` re-renders the whole page on the server. On this
   network that is 2–4s with only a disabled button to show for it.
   - **Fix:** optimistic UI. Show the comment straight away, have the action
     return the saved comment, and drop the full-page refresh.
3. **Cold starts.** After a quiet period, the first request loads Prisma and
   Auth.js and opens a database connection, which adds 1–3s.
   - **Fix:** turn on Fluid Compute (Vercel → Settings → Functions) so warm
     instances are reused.
4. **Page weight.** `/community` loads 280 KB of compressed JavaScript in 20
   files, plus 22 KB of CSS. Uploaded images are served at full size through
   raw `<img>` tags. Both are significant on mobile data.

## Why "comments are not showing"

On the server, comments save and appear on the post page. The likely causes
are all in the experience:

- **Replies from the feed vanish.** The reply box under a feed post closes
  with a "Reply posted" toast, but the feed never shows replies, only the
  count. To the person replying, it looks lost.
  - **Fix:** after replying from the feed, take the user to the post page with
    their reply highlighted, or show their reply under the post.
- **The long wait causes double posts.** "Absolutely" was posted twice in
  the same minute: nothing appeared, so the button was pressed again.
  - **Fix:** the optimistic UI above, plus a client-generated ID on each
    submission so a retry can't create a duplicate.
- **Unverified accounts can't comment.** This is by design, and since
  `73379b9` they see an error message instead of a silent failure. That only
  helps if verification emails actually arrive (see M4).

## Must fix before a public launch

| # | Item | Why |
|---|---|---|
| M1 | Optimistic comments, likes and posts; no full-page refresh after actions | The main remaining cause of "slow" and "not showing" |
| M2 | Feed replies stay visible (see above); idempotent submits | Lost-looking replies and duplicates |
| M3 | Error tracking (Sentry, free tier) and an uptime monitor | Today nobody learns about a failure until a user complains, and the cause can't be traced |
| M4 | Confirm verification emails are delivered (`EMAIL_PROVIDER=resend` and a verified sending domain); send a test sign-up | Without it, no real new member can ever post |
| M5 | Confirm `STORAGE_PROVIDER=s3` (R2) and upload one image in production | Otherwise every photo post fails |
| M6 | Rotate the Supabase password (it was pasted in chat) and update both URLs | Anyone with the chat log has full database access |
| M7 | Shared rate limiting (Upstash Redis or a Postgres table) | Today's limits are per server instance, so login brute force and spam limits don't hold |
| M8 | Uploads: choose the extension from the checked file type; check magic bytes | Stops a disguised HTML file from being stored and served as an "image" |
| M9 | Hosting plans: move to Vercel Pro; check what the Supabase plan includes | Vercel's Hobby plan is for non-commercial use only; Pro also gives better limits and logs. On Supabase, confirm backups, retention and whether the project can pause |

## Should fix soon

- **Only select public user fields.** Eight queries use `author: true`,
  `user: true` or `actor: true` and so load whole user rows, including the
  password hash and email, into server memory. Nothing leaks today:
  `PostCard` is a server component and only renders chosen fields, and the
  hash does not appear in page HTML. But one future change that passes such a
  row to a client component would ship hashes to every browser. Use a shared
  `publicUserSelect`.
- `resendVerificationEmail(userId)` accepts any user ID. Take the user from
  the session or a token instead.
- **Content Security Policy:** run it in report-only mode first.
- **Staging:** use Vercel preview deployments with a separate Supabase
  project. Today every change goes straight to production.
- **Load test** before campaign spikes, for example k6 at 50–200 concurrent
  users against staging. Watch database connections and p95 latency.
- **Bank details:** keep them off until the legal review is done, the privacy
  policy is updated, and production keys are set.

## Later (scale)

- Cache the public parts of the community sidebar (trending, official
  accounts, events) for 60s.
- Use `next/image`, or R2 resizing, for uploaded media.
- Move announcement push fan-out to a queue once there are thousands of
  recipients.
- Batch the hashtag upserts.
- Add a `Post(deletedAt, createdAt)` index as the feed grows.

## What's in good shape

- Every server action checks sign-in or a permission. Admin actions are
  audited. Ownership is checked on delete and withdraw.
- The database connection pool is fixed: transaction pooler plus
  `DIRECT_URL`.
- Failures now show a message instead of an endless spinner.
- Open redirect fixed; security headers and HSTS are live.
- No `dangerouslySetInnerHTML`; user text is rendered safely.
- Bank details are encrypted, least-privilege, audited and unit tested.
- The service worker never caches signed-in pages, so it can't serve stale
  comments.

## Suggested order

1. **Today (no code):** M4, M5, M6, M9 checks in Vercel and Supabase; turn on
   Fluid Compute.
2. **Next 1–2 days:** M1, M2 (fixes the "slow" and "not showing" complaints),
   M3.
3. **This week:** M7, M8, public user fields.
4. **Before campaign traffic:** staging and a load test.
