import type { Instrumentation } from "next";

/**
 * Server error tracking with Sentry. Does nothing until SENTRY_DSN is set,
 * and loads the SDK only then. No personal data is sent (no cookies, IPs or
 * request bodies), only the error, stack and route.
 */
export async function register() {
  if (!process.env.SENTRY_DSN || process.env.NEXT_RUNTIME !== "nodejs") return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}

// Called by Next.js for errors in pages, layouts, route handlers and server actions.
export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!process.env.SENTRY_DSN || process.env.NEXT_RUNTIME !== "nodejs") return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
