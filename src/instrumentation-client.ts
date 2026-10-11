/**
 * Browser error tracking with Sentry. Does nothing until
 * NEXT_PUBLIC_SENTRY_DSN is set at build time; until then the SDK isn't even
 * downloaded, so it costs visitors nothing.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  import("@sentry/nextjs").then((Sentry) =>
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      // Noise from browser extensions and flaky mobile networks.
      ignoreErrors: ["ResizeObserver loop", "Failed to fetch", "Load failed", "NetworkError"],
    })
  );
}
