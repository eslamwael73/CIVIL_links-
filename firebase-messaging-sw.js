// firebase-messaging-sw.js
try {
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');
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
    if (!payload) {
      console.error('[firebase-messaging-sw.js] ❌ Payload is null or undefined');
      return;
    }
    // تنفيذ فكرتك: معالجة الإشعار بنفس طريقة الـ foreground
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Civil Files';
    const notificationBody = payload.notification?.body || payload.data?.dailyMessage || 'إشعار جديد';
    const notificationOptions = {
      body: notificationBody,
      icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      tag: 'civil-files-notification',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open_site', title: 'فتح الموقع' },
        { action: 'later', title: 'تذكيرني لاحقًا' },
        { action: 'close', title: 'إغلاق' }
      ],
      data: {
        url: payload.webpush?.fcm_options?.link || payload.data?.url || 'https://eslamwael73.github.io/CIVIL_links-/',
        message: notificationBody,
        title: notificationTitle,
        timestamp: Date.now(),
        ...payload.data
      }
    };
    try {
      // عرض الإشعار في الخلفية بنفس طريقة الـ foreground
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
    const notificationData = event.notification.data || {};
    if (event.action === 'close') {
      console.log('[firebase-messaging-sw.js] ❌ Notification dismissed');
      return;
    } else if (event.action === 'later') {
      console.log('[firebase-messaging-sw.js] ⏰ Scheduling reminder');
      setTimeout(() => {
        self.registration.showNotification('Civil Files - تذكير', {
          body: notificationData.message || 'لا تنس مراجعة الرسالة اليومية!',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          tag: 'civil-files-reminder',
          vibrate: [200, 100, 200],
          data: { ...notificationData, isReminder: true }
        });
        console.log('[firebase-messaging-sw.js] ✅ Reminder notification shown');
      }, 60 * 60 * 1000); // ساعة واحدة
      return;
    }
    const urlToOpen = notificationData.url || 'https://eslamwael73.github.io/CIVIL_links-/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes('eslamwael73.github.io/CIVIL_links-/') && 'focus' in client) {
            console.log('[firebase-messaging-sw.js] ✅ Focusing existing window:', client.url);
            client.postMessage({
              type: 'CIVIL_FILES_NOTIFICATION',
              data: {
                message: notificationData.message,
                title: notificationData.title,
                timestamp: notificationData.timestamp,
                source: 'notification_click'
              }
            });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          console.log('[firebase-messaging-sw.js] 🆕 Opening new window:', urlToOpen);
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });

  // معالجة إغلاق الإشعار
  self.addEventListener('notificationclose', (event) => {
    console.log('[firebase-messaging-sw.js] 🔕 Notification closed:', event.notification.tag);
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

  // معالجة الرسائل من الصفحة الرئيسية
  self.addEventListener('message', (event) => {
    console.log('[firebase-messaging-sw.js] 📨 Message received:', event.data);
    if (event.data?.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error);
}
// معالجة الرسائل من index.html
self.addEventListener('message', (event) => {
  console.log('[firebase-messaging-sw.js] 📨 Message received from index.html:', event.data);
  if (event.data?.type === 'CHECK_BACKGROUND_NOTIFICATIONS') {
    console.log('[firebase-messaging-sw.js] ✅ Checking background notifications for topic:', event.data.data.topic);
    event.source.postMessage({
      type: 'BACKGROUND_NOTIFICATION_STATUS',
      status: 'Service Worker is ready for background notifications'
    });
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});