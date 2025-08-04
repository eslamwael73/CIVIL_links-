const CACHE_NAME = 'civilfiles-cache-v1';
const urlsToCache = [
  '/CIVIL_links-/',
  '/CIVIL_links-/index.html',
  '/CIVIL_links-/style.css',
  '/CIVIL_links-/main.js',
  'https://unpkg.com/lucide@0.441.0/dist/umd/lucide.min.js',
  'https://cdn.jsdelivr.net/npm/toastify-js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js',
  'https://cdn.jsdelivr.net/npm/moment-hijri@2.1.2/moment-hijri.min.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  'https://i.postimg.cc/Y9LHL2xH/Picsart-25-07-22-18-01-32-565.png',
  'https://i.postimg.cc/sgH7KDLb/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
