const CACHE = 'fineri-v24';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'graph.json', 'forest.jpg', 'nu.jpg', 'nu-honto.jpg', 'holo-nu.jpg', 'bg-face.webp', 'earth-tex.jpg', 'earth-clouds.webp', 'moon-tex.webp', 'earth-night.webp', 'races.json', 'icon-192.png', 'manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
