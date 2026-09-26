# Self-hosted fonts

`Inter-Variable.woff2` and `Fraunces-Variable.woff2` are the same files Google
Fonts serves (latin subset) for the Inter and Fraunces variable fonts, both
licensed under the SIL Open Font License. They're checked in and loaded via
`next/font/local` (see `src/app/layout.tsx`) instead of `next/font/google`
because Vercel's Turbopack build image failed to resolve
`@vercel/turbopack-next/internal/font/google/font` for this Next.js version,
breaking production deploys even though `next build` succeeded locally.
Self-hosting removes that build-time dependency entirely.

Source:
- https://fonts.google.com/specimen/Inter
- https://fonts.google.com/specimen/Fraunces
