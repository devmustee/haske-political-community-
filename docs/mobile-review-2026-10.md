# Phone experience review and polish plan

12 October 2026. Follows `mobile-polish-plan.md`, whose mechanical fixes
(clipping, 44px tap targets, 12px text floor, safe areas, PWA) are done and
still hold: no page scrolls sideways and almost no text is under 12px.

This review looks at what that pass didn't: **how the site feels on a
typical phone and connection in Adamawa**, which means mostly mid-range
Android phones on patchy 3G/4G.

## How it was measured

- **Setup:** the production build, run in headless Chrome as a Pixel-class
  Android phone (390×844 at 3× density, touch), on a slow connection
  (1.6 Mbps down, 150 ms latency) with the CPU slowed 4×. Caches were off,
  so every visit is a first visit.
- **Pages:** 22, covering the public site, sign-in and the community as a
  guest.
- **Measures:** LCP (when the main content appears), CLS (layout shift),
  bytes by type, oversized images, form-field font size, sticky elements,
  small tap targets, page length, and full-page screenshots.

| Page | LCP | CLS | Length (screens) | Note |
|---|---|---|---|---|
| `/` | 2.2s | 0 | **21.8** | 809 KB; 444 KB of it JavaScript |
| `/biography` | 3.6s | 0 | **13.5** | |
| `/foundation` | 0.8s | 0 | **12.6** | |
| `/vision` | 2.2s | 0 | 11.3 | |
| `/leadership` | 1.0s | 0 | 10.9 | |
| `/gallery` | 1.8s | 0 | **24.1** | 877 KB of images |
| `/login`, `/register` | 2.1s / 0.9s | **0.07** / 0 | 1 | fields at 14px (iPhone zooms in) |
| `/community` (guest) | 1.5s | **0.13** | 5.1 | 9 small tap targets |
| `/community/explore` | 7.3s cold, about 0.1s warm | 0 | 4.9 | search field at 14px |
| `/community/post/…` | 1.9s | 0 | 1.5 | 11 small tap targets |

LCP is decent once a page is cached. The problems are in **what people see
while the page is still loading**, the **page length**, and the
**weight**.

## Findings

### P0: makes the site look broken or slow on phones

**1. Content is invisible until JavaScript loads.**
- **Cause:** 106 sections are wrapped in `<Reveal>`, whose CSS starts at
  `opacity: 0`. They only appear after the page's JavaScript (about 440 KB
  on the homepage) has downloaded, run, and fired an IntersectionObserver.
- **Effect:**
  - On a 3G phone, people scroll into blank space for several seconds.
  - If a script fails, the content never appears.
  - Every one of these elements also carries `will-change`. That pins a GPU
    layer each, so low-end phones run out of memory and stutter while
    scrolling.
- **Fix:**
  - Only hide when JavaScript is running: a tiny inline script in `<head>`
    adds `class="js"` to `<html>`, and the CSS becomes `.js .reveal`.
  - Never animate content in the first screen.
  - Drop `will-change`, or apply it only while animating.

**2. Counters read "0" until JavaScript runs.**
- **Cause:** `AnimatedCounter` renders `0` on the server and counts up in
  the browser.
- **Effect:**
  - Slow phones show "0 LGAs, 0 Strategic Pillars, 0% Documented"
    meanwhile.
  - So do link previews, search engines and screen readers, and the
  WhatsApp share preview of the homepage.
- **Fix:** render the real number on the server, and animate from 0 only
  when JavaScript starts the count-up.

**3. Error tracking costs 183 KB on every page.**
- **Cause:** since the Sentry DSN went live, the browser SDK (183 KB
  compressed) downloads on every page view. That's about 40% of the
  homepage's JavaScript.
- **Fix:**
  - Use Sentry's lazy loader script (about 1 KB), which downloads the SDK
    only when an error actually happens.
  - Or load a minimal browser client after the page is idle.
  - Server-side tracking is unaffected either way.

**4. iPhones zoom in on sign-in, sign-up and search.**
- **Cause:** the login and register fields, and the community search box,
  use 14px text. iOS Safari zooms the whole page when a field under 16px is
  focused.
- **Fix:** 16px (`text-base`) on phones in the shared `Input` and
  `Textarea`, keeping 14px from `sm` up.

**5. Images from other sites, and an open image proxy.**
- **Cause:**
  - `next.config.ts` allows `remotePatterns: hostname "**"`, so anyone can
    use the site's image optimizer to resize any image on the internet, at
    the site's bandwidth cost.
  - Some media items hotlink a 2560×1920 photo from a news site. It's slow,
    can disappear or be swapped at any time, and tells that site about
    every visitor.
- **Fix:**
  - Allow only your own storage host.
  - Re-host external media images in R2 when an item is saved in admin.

### P1: the experience

**6. The homepage is 22 screens long on a phone (about 18,400px).**
- **Cause:**
  - The 8 pillar cards stack one per screen-third.
  - "Who is Abdulrahman Bashir Haske", the timeline and the achievements
    repeat what `/biography` and `/timeline` already say.
- **Effect:** most visitors never reach the calls to action near the
  bottom (Join, Speak to Haske).
- **Fix (aim for 10–12 screens):**
  - Pillars become a 2-column grid of compact tiles, or a swipeable row
    with scroll-snap.
  - Shorten the bio and timeline teasers to 2–3 items, each with one
    "See all" link.
  - Move the main call to action ("Join Haske 2027") up, to directly after
    the hero stats.

**7. Long pages have no way around them.**
- **Cause:** `/biography` (13.5 screens), `/foundation` (12.6), `/vision`
  (11.3), `/leadership` (10.9) and the 24-screen `/gallery` are one long
  scroll.
- **Fix:**
  - Add a sticky row of section chips under the header ("Profile ·
    Education · Enterprise · Timeline"), which highlights as you scroll.
  - Add a back-to-top button after 3 screens.
  - Collapse long lists behind "Show more" on phones.

**8. Tapping a link gives no feedback.**
- **Cause:** there are no `loading.tsx` files anywhere. On a slow
  connection, a tap does nothing visible until the next page arrives (1–3s
  or more).
- **Effect:** people tap again or give up.
- **Fix:**
  - Add a thin top progress bar on navigation.
  - Add `loading.tsx` skeletons for the community feed, a post, a profile,
    explore and notifications. Those are the app-like screens where an
    instant response matters most.

**9. The community front door for guests.**
- **Gaps:**
  - The first thing a signed-out visitor sees is the feed, with no welcome
    or "Join / Sign in" card.
  - The install tip appears after the page loads and pushes the feed down
    (CLS 0.13, "poor").
  - The tab row cuts "Trending" off with no sign that it scrolls.
- **Fixes:**
  - Add a guest welcome card at the top with Join and Sign in.
  - Show the install tip as a bottom sheet after some engagement (second
    visit, or after a like), so it never shifts content.
  - Fade the tab row's edges and add scroll-snap, or fit all five tabs.

**10. Android has no install prompt.**
- **Cause:** there's an iPhone "Add to Home Screen" tip, but nothing for
  Android. Android is the large majority of phones in Nigeria. Chrome fires
  `beforeinstallprompt`, which the site ignores.
- **Fix:** an "Install the app" button (community sidebar and menu, plus a
  one-time card) that triggers Chrome's own install dialog.

**11. Image weight.**
- **Correction from the first draft:** fixed-width `next/image` uses
  already get a 1×/2× `srcset`, and the gallery's 1200px images are right
  for a 3× phone screen.
- **The real wins are:**
  - **AVIF:** the optimizer only produced WebP. AVIF is about 30% smaller.
  - **Raw images in new components:** the media artwork and card images
    bypassed the optimizer. The artwork loaded the 1920px portrait into a
    roughly 220px slot.

**12. Small tap targets in the community.**
- **Cause:** 9–11 controls under 40px on the feed and on post pages: comment
  actions, the "more" menus, poll options' secondary controls.
- **Fix:** the same `max-sm` minimum-size pattern used elsewhere.

**13. A sticky header that never moves.**
- **Cause:** the site header takes 67px (8% of the screen) on every public
  page.
- **Fix:** hide it on scroll down and show it on scroll up. It's a few
  lines of code, and it gives reading pages more room.

**14. Heavy visual effects on scroll.**
- **Cause:** there are 47 `backdrop-blur` uses. They are expensive to
  repaint on low-end Android while scrolling.
- **Fix:** turn blur off on phones (`max-sm:backdrop-blur-none` with a
  solid background), or use `@media (prefers-reduced-transparency)`.

### P2: details

- **Plurals:** "1 posts" on explore and profiles. Use a `plural()` helper.
- **Pull to refresh:** add a "New posts" pill in the feed instead of
  requiring a reload.
- **Cold first hit:** the first visit to a community page after a quiet
  period took 7s in the test (cold start plus a slow phone). Fluid Compute
  on Vercel (from the readiness review) addresses this.
- **Biography duplication:** the hero, profile card and opening quote
  repeat each other. Lead with one strong block.

## Plan

| Phase | Items | Effort | Result |
|---|---|---|---|
| **1. Fast and never blank** | 1, 2, 3, 4, 11 | 1 day | Content visible on first paint; ~180 KB less JS per page; no iPhone zoom; much lighter image downloads |
| **2. Feels like an app** | 8, 9, 10, 12 | 1–2 days | Instant feedback on every tap; a clear front door for guests; installable on Android |
| **3. Shorter, easier to read** | 6, 7, 13, P2 plurals | 2 days | Homepage about half as long; jump links and back-to-top on long pages; more reading room |
| **4. Hardening** | 5, 14, cold starts | 1 day | No open image proxy; no hotlinks; smoother scrolling on low-end phones |

Each phase ships on its own, and none needs a database change. Phase 1 has
the most impact for the least work. Phase 3 changes what people see, so
it's worth agreeing the new homepage order with the team first.

## Guardrail

Keep the audit used here as a check before each release, covering the same
22 pages at 390px on a throttled connection. Fail on any of:

- LCP over 2.5s;
- CLS over 0.1;
- any input under 16px;
- JavaScript over 250 KB compressed on public pages;
- any image more than 2× larger than it's shown;
- any text or control clipped (the existing check).
