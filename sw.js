// Offline support for Pasar Pagi Adventure.
// App files are cached on install, so the game opens with no internet.
// Google Fonts are cached the first time they load; offline before that, the game falls back to system fonts.
// To ship an update: change VERSION, push, then open the app twice on the tablet (first open fetches, second open uses it).
const VERSION = "pasar-pagi-v3";
const APP = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-32.png"];
const FONTS = "pasar-pagi-fonts";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Fonts: serve from cache, refresh in the background.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // Page: open the cached copy instantly (no waiting on slow wifi), refresh it in the background.
  if (req.mode === "navigate") {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match("./index.html");
      const net = fetch(req).then(r => { if (r.ok) c.put("./index.html", r.clone()); return r; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    }));
    return;
  }

  // Everything else (icons, manifest): cache first.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
