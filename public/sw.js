const CACHE_NAME = 'serenity-forest-cache-v1';
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// 1. Install Event: Cache pre-cache list and skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Serenity Forest Service Worker] Pre-caching static skeleton');
      return cache.addAll(PRE_CACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Serenity Forest Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Handle cache & dynamic fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Avoid caching Chrome extensions, Firestore WebSockets, or remote authentication channels
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/__/auth') ||
    url.pathname.includes('firestore.googleapis.com')
  ) {
    return;
  }

  // Navigation requests (HTML SPA Routing fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response and cache it
          const cleanResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cleanResponse);
          });
          return response;
        })
        .catch(() => {
          // If offline, serve cached index.html
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Asset/API caching (Vite compiled chunks, images, sounds)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache, but update cache with fresh network request in background (stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore background sync errors when offline
          });
        return cachedResponse;
      }

      // Fetch from network and save to cache dynamically
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for offline images or assets (if available)
        if (request.destination === 'image') {
          return caches.match('/icon-192.png');
        }
      });
    })
  );
});
