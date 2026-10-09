# Mobile polish plan

Based on an automated pass over 43 routes at 375px (plus 320px spot checks),
measuring clipped content, tap targets under 40px, and text under 12px.
Auth pages (`/login`, `/register`, `/forgot-password`) redirected because the
audit ran signed in. They still need a signed-out pass.

## Already done

- **Homepage hero:** stacked APM pill, one-line brand strip, full-width equal
  buttons, tighter top spacing, and small-phone (<360px) sizing.
- **Header:** the name now shows beside the logo on phones, and the tagline is
  hidden there.
- **`/contact`:** the left column was 58px wider than the screen and silently
  clipped. It now has a single-column grid and wrapping emails.
- **Installable PWA:** manifest, icons, theme colour, iOS home-screen meta, a
  service worker, and an `/offline` page. See "PWA follow-ups" below.
- **Contact form:** now sends through Speak to Haske, with a tracking ID.
- **Clipped content fixed at 320 and 375px:**
  - `/`: the "Who is Abdulrahman Bashir Haske" section (cut off at every
    phone width) and long CTA labels;
  - `/leadership`: the APM ticket buttons;
  - `/sports-polo`: the stats;
  - `/media`: the article cards.

  A re-audit that flags text or controls cut off by a clipping container
  now passes on every route at both widths.

## P0: broken or misleading on phones (do first)

1. **Placeholder contact details are live in the footer on every page:**
   - `+234 801 234 5678` (a placeholder-pattern number);
   - `info@abhaske.ng`, while `/contact` uses `@haske.community` addresses;
   - "No. 1 / No. 2, Haske Road" office addresses (seeded site settings).

   Replace these with real details or remove them.
2. **Clipping is hidden, not prevented.** `html` and `body` have
   `overflow-x: hidden`, so a too-wide element gets cut off instead of making
   the page scroll. Keep it as a safety net, but add the audit below to CI so
   regressions like the `/contact` one are caught.

## P1: tap targets (aim for 44px; WCAG 2.5.8 minimum is 24px)

| Where | What's small |
|---|---|
| Footer (every page) | Email, phone and social icon links (about 8 per page) |
| `/media`, `/gallery` | Category filter chips |
| `/community-issues`, `/speak-to-haske` | Category and form-type toggle buttons |
| Community post cards | Action icons (about 36px, with negative margins); avatar links |
| Community post cards | Like and bookmark buttons have **no accessible label** (read as just "button") |
| Profile page | Posts / Replies / Media / Likes tabs |
| Detail pages | Back/breadcrumb links ("Events", "Programs", "Media Center", "Achievements", "Our Agenda") |
| Home and section pages | Text-only CTAs ("View Full Gallery", "Explore the 2027 Agenda", …) |
| `/image-credits` | 43 of 47 links |

Fix pattern: `min-h-11` with inline padding on links and chips. For icon
buttons, a `size-11` hit area around the visual icon, with no negative margins
that shrink it.

## P2: type size

Labels at 10–11px with wide uppercase tracking are the most common issue:

- stat labels on `/`, `/mission` (56), `/vision` (56), `/enterprise`, and the
  section pages;
- photo captions on `/gallery` (51);
- pillar tags on `/manifesto` (10px);
- role badges in the community (10px).

Set a 12px floor on phones and reduce tracking below `sm` (as done in the
hero brand strip).

## P3: layout consistency

- Apply the hero pattern to the other page heroes: tighter top padding on
  phones, and stacked full-width CTAs.
- Scroll-reveal animations that slide in sideways (`reveal-right`) should
  fade only on phones, and respect `prefers-reduced-motion`.
- Installed iPhone app: add `viewportFit: "cover"` and pad the community bottom
  nav and the header with `env(safe-area-inset-*)`, so nothing sits under the
  home indicator.
- Check the site-header mobile drawer at 320px and in landscape.

## PWA follow-ups

- **Push notifications:** VAPID keys, a `PushSubscription` table, sending
  from `src/lib/notify.ts`, and a `push` handler in `public/sw.js` (see the
  Next.js PWA guide). Needs HTTPS and a permission UX that asks only after a
  user action.
- **Install hint for iOS:** Safari has no install prompt, so show a one-time
  "Add to Home Screen" tip in the community for iOS visitors.
- **Offline reading:** optionally cache static public pages (manifesto,
  biography) for offline viewing. Keep signed-in pages uncached, as the
  service worker does now.
- **Richer install sheet:** add `screenshots` to `src/app/manifest.ts`.
- **Updating:** bump `VERSION` in `public/sw.js` whenever its caching rules
  change.

## Guardrail

Turn the audit used for this plan into a Playwright test that runs at 320,
375 and 768px over the route list. Disable transitions and force `.reveal`
elements to their finished state first, so content isn't caught
mid-animation. It should fail on:

- any text or control extending beyond its nearest `overflow: hidden`/`clip`
  ancestor (this is how hidden clipping shows up, since the page itself
  never scrolls sideways). The usual cause is a `grid` with no
  `grid-cols-1` on phones, plus a child that can't shrink (buttons in a
  row that doesn't wrap, long words, badge rows);
- new tap targets under 24px;
- text under 11px.

Run it in CI, plus Lighthouse (PWA + accessibility) on `/` and `/community`.

## Not mobile, but noticed

Some section-page stat labels read as factual claims ("Jobs Created",
"Audited Fiduciary", "Governance Certified"). The seed is strict about sourced
facts, so these deserve the same provenance check.
