/* ATI Water Monitor - service worker (offline cache). Bump VERSION when files change. */
const VERSION = 'ati-monitor-v24';
const FILES = ['./', './index.html', './plotly.min.js', './manifest.webmanifest', './icon.svg', './water_level.png', './ATI_Monitor_Shared_TEMPLATE.xlsx', './ATI_Monitor_Sheet.gs'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('ati-monitor-') === 0 && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin || new URL(e.request.url).pathname.indexOf('/viewer/') >= 0) return;   // never touch the Google Sheet requests
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {}); return res;
  }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
