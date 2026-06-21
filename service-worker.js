// Suhrid Tutorial — minimal app-shell service worker
const CACHE = "suhrid-v1";
const SHELL = [
  "./","./index.html","./app.html","./manifest.json",
  "./css/styles.css","./js/config.js","./js/common.js","./js/supabase.js","./js/fees-lib.js",
  "./icons/icon-192.png","./icons/icon-512.png","./icons/favicon.png",
  "./pages/dashboard.html","./pages/students.html","./pages/fee_collection.html",
  "./pages/history.html","./pages/reports.html","./pages/student_profile.html","./pages/settings.html"
];
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  // network-first for Supabase / cross-origin (don't cache API)
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const copy = r.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
      return r;
    }).catch(()=> caches.match(e.request).then(r => r || caches.match("./app.html")))
  );
});
