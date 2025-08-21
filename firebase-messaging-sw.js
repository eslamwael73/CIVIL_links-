importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCXX_kt4-3J_ocNKYAegNTar4Bd9OIgA2k",
  authDomain: "eslam-website.firebaseapp.com",
  projectId: "eslam-website",
  storageBucket: "eslam-website.firebasestorage.app",
  messagingSenderId: "626111073932",
  appId: "1:626111073932:web:f7137bc90e139e822675a9"
};

// تهيئة Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('[firebase-messaging-sw.js] ✅ Firebase initialized at', new Date().toISOString());
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error.message, error);
}

const messaging = firebase.messaging();

// معالجة تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker installing at', new Date().toISOString());
  self.skipWaiting();
});

// معالجة تفعيل الـ Service Worker
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker activated at', new Date().toISOString());
  event.waitUntil(self.clients.claim());
});

// معالجة الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 📩 Received background message at', new Date().toISOString(), JSON.stringify(payload, null, 2));

  // التحقق من وجود notification أو data
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Civil Files';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'إشعار جديد',
    icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    vibrate: [200, 100, 200],
    tag: 'civil-files-notification',
    renotify: true,
    requireInteraction: false,
    silent: false,
    actions: [
      { action: 'open_site', title: 'فتح الموقع' },
      { action: 'dismiss', title: 'تجاهل' }
    ],
    data: payload.data || {}
  };

  try {
    self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[firebase-messaging-sw.js] ✅ Notification displayed at', new Date().toISOString());
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Failed to display notification:', error.message, error);
  }
});

// معالجة النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked at', new Date().toISOString(), event);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = 'https://eslamwael73.github.io/CIVIL_links-/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('eslamwael73.github.io/CIVIL_links-') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Failed to handle notification click:', error.message, error);
    })
  );
});

// معالجة أي إشعار push
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] 📬 Push event received at', new Date().toISOString());
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[firebase-messaging-sw.js] 📬 Push data:', JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error('[firebase-messaging-sw.js] ❌ Error parsing push data:', error.message, error);
    }
  } else {
    console.log('[firebase-messaging-sw.js] ℹ️ Push event has no data');
  }
});

// معالجة أخطاء عامة
self.addEventListener('error', (event) => {
  console.error('[firebase-messaging-sw.js] ❌ Service Worker error:', event.message, event);
});

console.log('[firebase-messaging-sw.js] 🔄 Service Worker script loaded at', new Date().toISOString());