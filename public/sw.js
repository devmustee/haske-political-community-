/*
 * Haske Community service worker.
 *
 * Deliberately small:
 * - Page navigations are network-only, falling back to /offline when the
 *   network fails. HTML is never cached, so signed-in pages (notifications,
 *   bookmarks, admin) are never left on a shared phone.
 * - Hashed build assets (/_next/static) are cache-first: their URLs change on
 *   every deploy, so a cached copy can never be stale.
 * - Public brand imagery and icons are stale-while-revalidate.
 * Bump VERSION to drop all caches on the next visit.
 */
const VERSION = "v1";
const PRECACHE = `haske-precache-${VERSION}`;
const RUNTIME = `haske-runtime-${VERSION}`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      const res = await fetch(OFFLINE_URL, { cache: "reload" });
      await cache.put(OFFLINE_URL, res.clone());
      // Also cache the offline page's own CSS/JS so it renders styled offline.
      const html = await res.text();
      const assets = [...new Set(html.match(/\/_next\/static\/[^"'\s)]+/g) ?? [])];
      await cache.addAll([...assets, "/icons/icon-192.png", "/brand/haske-logo.png"]);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PRECACHE, RUNTIME]);
      for (const key of await caches.keys()) {
        if (key.startsWith("haske-") && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (/^\/(brand|icons|images)\//.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) (await caches.open(RUNTIME)).put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(RUNTIME);
  // Look in every cache: some of these (the logo) are precached for /offline.
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return network;
}
