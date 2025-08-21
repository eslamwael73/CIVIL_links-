// sw.js - Service Worker للتخزين المؤقت
const CACHE_NAME = 'civil-files-v1';
const urlsToCache = [
  '/CIVIL_links-/',
  '/CIVIL_links-/index.html',
  '/CIVIL_links-/style.css',
  '/CIVIL_links-/main.js',
  'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
  'https://i.postimg.cc/Y9LHL2xH/Picsart-25-07-22-18-01-32-565.png',
  'https://unpkg.com/lucide@0.441.0/dist/umd/lucide.min.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
  'https://cdn.jsdelivr.net/npm/toastify-js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js',
  'https://cdn.jsdelivr.net/npm/moment-hijri@2.1.2/moment-hijri.min.js'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا وجد الملف في الذاكرة المؤقتة، نعيده
        if (response) {
          return response;
        }

        // إذا لم نجده، نحمله من الشبكة
        return fetch(event.request).then((response) => {
          // تحقق من أننا تلقينا ردًا صالحًا
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // ننسخ الرد لتخزينه في الذاكرة المؤقتة
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // في حالة فشل الاتصال بالشبكة، يمكننا إعادة صفحة بديلة
          if (event.request.mode === 'navigate') {
            return caches.match('/CIVIL_links-/index.html');
          }
        });
      })
  );
});