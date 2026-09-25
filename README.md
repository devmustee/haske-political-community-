# Haske Community

The official public platform of Abdulrahman Bashir Haske — biography, documented
record, proposed policy agenda for Adamawa State, empowerment programs, and a
public social community modeled on X.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, React 19
- **Styling:** Tailwind CSS v4, hand-built shadcn/ui-style component kit
- **Database:** PostgreSQL + Prisma 6
- **Auth:** Auth.js (NextAuth v5) — credentials + JWT sessions, bcrypt password hashing
- **Storage:** pluggable service — local filesystem in dev, S3-compatible in production
- **Email:** pluggable service — console logging in dev, Resend in production

## Getting started

### 1. Prerequisites

- Node.js 20+
- A running PostgreSQL instance

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string. Generate
a real `AUTH_SECRET` with:

```bash
npx auth secret
```

Everything else (`EMAIL_PROVIDER=console`, `STORAGE_PROVIDER=local`) works out of
the box with no external accounts — see [`src/lib/services`](src/lib/services) for
the pluggable abstractions, and switch to `resend` / `s3` plus the matching
credentials when you're ready for production.

### 4. Set up the database

```bash
npx prisma migrate dev
npm run db:seed
```

The seed script populates only the verified facts given in the platform brief
(biography, timeline, the one documented achievement, program/policy pillar
*placeholders* clearly marked as such, the historical "A.D.A.M.A.W.A First
Agenda" manifesto, and a couple of demo community posts). It's safe to re-run —
re-seeding updates existing rows instead of duplicating them.

Seeded accounts (all local dev-only — **change these before any real deployment**):

| Account | Email | Password | Role |
|---|---|---|---|
| Admin | `admin@haskecommunity.ng` | `Admin123!` | Super Admin |
| Official Haske account | `office@haskecommunity.ng` | `Haske123!` | Content Admin, Official verified |
| Campaign team | `team@haskecommunity.ng` | `Team1234!` | Organization verified |
| Demo user | `demo.fatima@example.com` | `Demo1234!` | — |
| Demo user | `demo.ibrahim@example.com` | `Demo1234!` | — |
| Demo user | `demo.aisha@example.com` | `Demo1234!` | — |
| Demo user | `demo.yakubu@example.com` | `Demo1234!` | — |
| Demo user | `demo.grace@example.com` | `Demo1234!` | — |
| Demo user | `demo.suleiman@example.com` | `Demo1234!` | — |

Demo users get generated (non-photographic) placeholder avatars via DiceBear, seeded
deterministically from their username — no real photos of real people are used for
these fictional accounts.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
prisma/schema.prisma       Full data model (community, CMS, programs,
                            manifesto, events, moderation, RBAC, audit log)
prisma/seed.ts              Content-provenance-only seed data
src/app/(site)/             Public marketing/CMS pages (homepage, biography,
                            achievements, programs, manifesto, events, media,
                            public record, citizen feedback, legal pages)
src/app/(auth)/              Register / login / password reset / email verify
src/app/community/           The social platform (feed, posts, profiles,
                            notifications, bookmarks, explore/search)
src/app/admin/               RBAC-gated admin dashboard, moderation, CMS CRUD
src/lib/actions/             Server actions (the only way data is mutated)
src/lib/queries/             Read-side Prisma query helpers
src/lib/services/            Pluggable email/storage providers
src/components/              ui/ (design system), community/, cms/, admin/
```

## Content model

Every editorial piece of content carries a `ContentStatus`: **Official**,
**Documented Record**, **Proposed Agenda**, **Community Content**,
**Third-Party Source**, **Draft**, or **Archived**. The UI always renders this
as a visible badge (`ContentStatusBadge`) so visitors can tell at a glance
whether something is a verified fact, a campaign proposal, or a community
member's opinion. See the platform brief's content rules for the reasoning —
nothing in the seed data invents achievements, statistics, quotes,
endorsements, or campaign promises beyond what was explicitly provided.

## Testing checklist

```bash
npm run lint        # ESLint
npx tsc --noEmit    # Type-check
npm run build       # Production build (also runs the type-check)
```

Manually verified end-to-end in this build: registration, login/logout,
password reset, email verification, profile editing with avatar/cover upload,
post creation (text/image/video/poll), comments/replies, likes, reposts, quote
reposts, poll voting, follows, notifications, bookmarks, content reporting,
admin moderation actions, admin role management, CMS CRUD (achievements,
programs, events, media, policy pillars, manifesto publishing), program
applications, event registration, citizen feedback with tracking IDs, global
search, and a clean production build.

## Deployment notes

- Set `STORAGE_PROVIDER=s3` and the `S3_*` variables for real file uploads at
  scale (avatars, post media, program/achievement documents).
- Set `EMAIL_PROVIDER=resend` and `RESEND_API_KEY` to send real verification
  and password-reset email.
- Change every seeded account's password before deploying anywhere public.
- `AUTH_SECRET` must be a strong, unique value in production — never reuse the
  development value committed to `.env`.
