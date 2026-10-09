/*
 * Haske Community service worker.
 *
 * Deliberately small:
 * - Page navigations are network-only, falling back to /offline when the
 *   network fails, so signed-in pages (notifications, bookmarks, admin) are
 *   never left on a shared phone. The exception is READABLE_OFFLINE: public,
 *   statically built pages (identical for every visitor) that are cached
 *   network-first so they can be read offline after one visit.
 * - Hashed build assets (/_next/static) are cache-first: their URLs change on
 *   every deploy, so a cached copy can never be stale.
 * - Public brand imagery and icons are stale-while-revalidate.
 * - Web Push: shows notifications sent by src/lib/push.ts and opens their
 *   (same-origin) link when tapped.
 * Bump VERSION to drop all caches on the next visit.
 */
const VERSION = "v2";
const PRECACHE = `haske-precache-${VERSION}`;
const RUNTIME = `haske-runtime-${VERSION}`;
// Also read by src/app/offline/offline-reading-list.tsx.
const PAGES = `haske-pages-${VERSION}`;
const OFFLINE_URL = "/offline";
// Must be static (prerendered) routes only: their HTML has no per-user content.
const READABLE_OFFLINE = new Set(["/biography", "/timeline", "/manifesto", "/mission", "/vision", "/leadership", "/public-record", "/programs"]);

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
      const keep = new Set([PRECACHE, RUNTIME, PAGES]);
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
    if (READABLE_OFFLINE.has(url.pathname) && !url.search) {
      event.respondWith(networkFirstPage(request));
    } else {
      event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    }
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

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok && !res.redirected) cache.put(request.url, res.clone());
    return res;
  } catch {
    return (await cache.match(request.url)) ?? (await caches.match(OFFLINE_URL));
  }
}

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

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Haske Community", {
      body: data.body || "You have a new notification.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag,
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const raw = event.notification.data && event.notification.data.url;
  // Only ever open same-origin paths from a push payload.
  const path = typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/community/notifications";
  const target = new URL(path, self.location.origin).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if (client.url === target && "focus" in client) return client.focus();
      }
      const existing = windows.find((c) => "navigate" in c);
      if (existing) {
        await existing.navigate(target);
        return existing.focus();
      }
      return self.clients.openWindow(target);
    })()
  );
});
