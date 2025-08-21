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
  console.log('[firebase-messaging-sw.js] ✅ Firebase initialized successfully');
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error);
}

const messaging = firebase.messaging();

// معالجة الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 📩 Received background message:', JSON.stringify(payload, null, 2));

  const notificationTitle = payload.notification?.title || 'Civil Files';
  const notificationOptions = {
    body: payload.notification?.body || 'إشعار جديد',
    icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open_site',
        title: 'فتح الموقع'
      }
    ],
    data: payload.data || {}
  };

  try {
    self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[firebase-messaging-sw.js] ✅ Notification displayed successfully');
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Failed to display notification:', error);
  }
});

// معالجة النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked:', event);
  event.notification.close();

  const urlToOpen = 'https://eslamwael73.github.io/CIVIL_links-/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// معالجة تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker installed');
  self.skipWaiting();
});

// معالجة تفعيل الـ Service Worker
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// معالجة أخطاء عامة
self.addEventListener('error', (error) => {
  console.error('[firebase-messaging-sw.js] ❌ Service Worker error:', error);
});