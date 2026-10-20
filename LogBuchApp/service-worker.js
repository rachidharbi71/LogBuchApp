const CACHE = 'logbuch-v1';
const DATEIEN = ['./', './index.html', './apple-touch-icon.png', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

/* Netzwerk-First für die Google-Script-Abfragen (stets aktuelle Daten),
   Cache-First für statische Dateien */
self.addEventListener('fetch', e => {
  if (e.request.url.indexOf('script.google.com') !== -1 || e.request.url.indexOf('docs.google.com') !== -1) {
    return; // Google Apps Script direkt durchreichen, kein Caching
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
