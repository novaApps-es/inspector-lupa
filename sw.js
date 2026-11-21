/* Inspector Lupa — modo sin conexión.
   Al publicar una versión nueva, cambia el número de CACHE para que los móviles la descarguen. */
const CACHE = 'inspector-lupa-v2.2';
const ARCHIVOS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './fredoka-latin-500-normal.woff2', './fredoka-latin-700-normal.woff2', './patrick-hand-latin-400-normal.woff2'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : undefined))
  );
});
