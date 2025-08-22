// firebase-messaging-sw.js
try {
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js');
  console.log('[firebase-messaging-sw.js] ✅ Firebase scripts imported successfully');
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to import Firebase scripts:', error);
}

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXX_kt4-3J_ocNKYAegNTar4Bd9OIgA2k",
  authDomain: "eslam-website.firebaseapp.com",
  projectId: "eslam-website",
  storageBucket: "eslam-website.firebasestorage.app",
  messagingSenderId: "626111073932",
  appId: "1:626111073932:web:f7137bc90e139e822675a9",
  measurementId: "G-3DD9VGDC46"
};

// تهيئة Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  console.log('[firebase-messaging-sw.js] ✅ Firebase initialized successfully');

  // معالجة الإشعارات في الخلفية
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] 📩 Received background message:', JSON.stringify(payload, null, 2));
    // التحقق من الـ payload
    if (!payload) {
      console.error('[firebase-messaging-sw.js] ❌ Payload is null or undefined');
      return;
    }
    // دعم صيغ متعددة: notification أو data من send-daily-push
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Civil Files';
    const notificationBody = payload.notification?.body || payload.data?.dailyMessage || payload.data?.body || 'إشعار جديد';
    const notificationOptions = {
      body: notificationBody,
      icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open_site', title: 'فتح الموقع' },
        { action: 'later', title: 'تذكيرني لاحقًا' }
      ],
      data: {
        url: payload.data?.url || 'https://eslamwael73.github.io/CIVIL_links-/',
        message: notificationBody,
        title: notificationTitle,
        timestamp: Date.now()
      }
    };
    try {
      self.registration.showNotification(notificationTitle, notificationOptions);
      console.log('[firebase-messaging-sw.js] ✅ Background notification displayed:', notificationBody);
    } catch (error) {
      console.error('[firebase-messaging-sw.js] ❌ Error displaying background notification:', error);
    }
  });

  // معالجة النقر على الإشعار
  self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked:', event.action);
    event.notification.close();
    if (event.action === 'later') {
      // جدولة تذكير بعد ساعة
      setTimeout(() => {
        self.registration.showNotification('Civil Files - تذكير', {
          body: event.notification.data?.message || 'لا تنس مراجعة الرسالة!',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          tag: 'civil-files-reminder',
          data: event.notification.data
        });
      }, 60 * 60 * 1000); // 1 hour
      return;
    }
    // فتح الموقع
    const urlToOpen = event.notification.data?.url || 'https://eslamwael73.github.io/CIVIL_links-/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('eslamwael73.github.io/CIVIL_links-/') && 'focus' in client) {
            client.postMessage({
              type: 'CIVIL_FILES_NOTIFICATION',
              data: event.notification.data
            });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });

  // معالجة إغلاق الإشعار
  self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] 🔕 Notification closed');
  });

  // دورة حياة الـ Service Worker
  self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] 🔧 Service worker installing...');
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] ✅ Service worker activated');
    event.waitUntil(self.clients.claim());
  });
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error);
}
