
// This is a minimal service worker that caches the app shell and key assets
const CACHE_NAME = 'adapty-ai-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/placeholder.svg'
];

// Install service worker and cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Implement a network-first strategy for API requests and a cache-first for static assets
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // For API requests, try the network first, then fall back to cache
  if (url.pathname.startsWith('/api') || url.pathname.includes('openrouter.ai')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } 
  // For static assets, try the cache first, then the network
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request).then(networkResponse => {
            // Clone the response before caching
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          });
        })
    );
  }
});

// Handle push notifications (can be implemented in the future)
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Adapty AI', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
