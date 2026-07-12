const CACHE_NAME = "jk_v1_2026";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./bootstrap.min.css",
  "./bootstrap.bundle.min.js",
  "./qrcode.min.js",
  "./app.js",
  "./core.js",
  "./router.js",
  "./layout.js",
  "./ui.js",
  "./home.js",
  "./product.js",
  "./search.js",
  "./brand.js",
  "./blog.js",
  "./cart.js",
  "./checkout.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
];

// Install Phase - Pre-cache Static Core Components
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activation Phase - Purge Legacy Cache Generations
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});

// Fetch Interceptor - Cache First Strategy falling back to Live Network Nodes
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || e.request.url.includes("script.google.com")) return;
  e.respondWith(
    caches.match(e.request).then((cachedRes) => {
      if (cachedRes) return cachedRes;
      return fetch(e.request).then((networkRes) => {
        if (!networkRes || networkRes.status !== 200) return networkRes;
        const cacheCopy = networkRes.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, cacheCopy));
        return networkRes;
      });
    })
  );
});