importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE_NAME = 'civilfiles-cache-v1';
const urlsToCache = [
  '/CIVIL_links-/',
  '/CIVIL_links-/index.html',
  '/CIVIL_links-/style.css',
  '/CIVIL_links-/main.js',
  '/CIVIL_links-/js/lucide.min.js',
  '/CIVIL_links-/js/toastify.min.js',
  '/CIVIL_links-/css/toastify.min.css',
  '/CIVIL_links-/js/moment.min.js',
  '/CIVIL_links-/js/moment-hijri.min.js',
  '/CIVIL_links-/icon.png',
  '/CIVIL_links-/images/Picsart-25-07-22-18-01-32-565.png',
  '/CIVIL_links-/images/Picsart-25-07-20-16-04-51-889.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.log('Failed to cache some resources:', error);
        });
      })
  );
  self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return caches.match('/CIVIL_links-/index.html'); // Fallback to index.html if offline
        });
      })
  );
});