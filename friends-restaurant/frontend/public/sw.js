const CACHE_NAME = 'friends-menu-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/friends-official-logo.png',
  '/assets/friends-official-logo-white.png',
  '/assets/friends-logo-couch.png',
  '/assets/friends-logo-couch-black.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache warning (non-fatal):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Navigation requests (scanning QR code, opening app): ALWAYS Network-First
  // This guarantees fresh index.html with latest hashed bundle references
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback: return cached index.html ignoring query params (?scan=qr)
          const cached = await caches.match('/index.html', { ignoreSearch: true }) ||
                         await caches.match('/', { ignoreSearch: true });
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><body style="background:#050505;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>Mereba Friends Garden</h2><p>Please check your connection and reload.</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#FFBD18;color:#000;border:none;border-radius:20px;font-weight:bold;cursor:pointer;">Reload</button></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. API Requests: Network-First with Cache-Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Network offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // 3. Static Assets: Cache-First with Network-Fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (response && response.status === 200 && (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg'))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return response;
      });
    }).catch(() => {
      // In case of any network failure, allow standard browser handling
      return fetch(req);
    })
  );
});
