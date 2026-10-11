import "server-only";

/**
 * True for images and videos this site serves itself: a same-site path
 * (local uploads, built-in images) or a file in the configured storage bucket.
 * Keeps posts and profiles from embedding outside URLs, which could track
 * everyone who views them or swap in different content later.
 */
export function isOwnMediaUrl(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) return true;
  const base = process.env.S3_PUBLIC_URL || (process.env.S3_BUCKET && process.env.S3_REGION ? `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` : "");
  return Boolean(base) && url.startsWith(`${base.replace(/\/+$/, "")}/`);
}
