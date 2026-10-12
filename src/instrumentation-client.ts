/**
 * Browser error tracking with Sentry, loaded only when it's needed.
 *
 * The SDK is about 180 KB compressed, so instead of downloading it on every
 * page view (a real cost on slow phones), this waits for the first uncaught
 * error or unhandled promise rejection, then loads the SDK and reports that
 * error. Pages that never error never download it. Does nothing until
 * NEXT_PUBLIC_SENTRY_DSN is set at build time.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Noise from browser extensions and flaky mobile networks.
const IGNORE = [/ResizeObserver loop/, /Failed to fetch/, /Load failed/, /NetworkError/, /ChunkLoadError/];

if (dsn && typeof window !== "undefined") {
  let loading: Promise<typeof import("@sentry/nextjs")> | null = null;

  const onError = (event: ErrorEvent) => report(event.error ?? event.message);
  const onRejection = (event: PromiseRejectionEvent) => report(event.reason);

  function report(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (IGNORE.some((re) => re.test(message))) return;
    loading ??= import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
        sendDefaultPii: false,
        tracesSampleRate: 0,
        ignoreErrors: IGNORE,
      });
      // From here on Sentry's own global handlers catch errors.
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      return Sentry;
    });
    // Report the error that triggered loading, and any raised while it loaded.
    loading.then((Sentry) => Sentry.captureException(error)).catch(() => {});
  }

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
}
