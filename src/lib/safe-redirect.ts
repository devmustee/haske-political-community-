/**
 * Only same-site paths are allowed as post-sign-in destinations. Anything
 * else (full URLs, protocol-relative "//evil.example", "/\evil.example",
 * which browsers treat as another site) falls back, so a crafted
 * ?callbackUrl= link can't bounce people to a phishing page after a genuine
 * sign-in.
 */
export function safeCallbackUrl(raw: string | null | undefined, fallback = "/community"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  try {
    // Resolve against a dummy origin; anything that escapes it isn't a path.
    const url = new URL(raw, "https://local.invalid");
    if (url.origin !== "https://local.invalid") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
