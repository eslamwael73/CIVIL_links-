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
    // التحقق من الـ payload
    if (!payload) {
      console.error('[firebase-messaging-sw.js] ❌ Payload is null or undefined');
      return;
    }
    // دعم صيغ متعددة: notification أو data من send-daily-push
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
      self.registration.showNotification(notificationTitle, notificationOptions);
      console.log('[firebase-messaging-sw.js] ✅ Background notification displayed:', notificationBody);
    } catch (error) {
      console.error('[firebase-messaging-sw.js] ❌ Error displaying background notification:', error);
    }
  });

  // معالجة النقر على الإشعار
  self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked:', event.action, JSON.stringify(event.notification.data, null, 2));
    event.notification.close();
    const notificationData = event.notification.data || {};
    if (event.action === 'close') {
      console.log('[firebase-messaging-sw.js] ❌ Notification dismissed by user');
      return;
    } else if (event.action === 'later') {
      console.log('[firebase-messaging-sw.js] ⏰ Scheduling reminder notification');
      scheduleReminderNotification(notificationData);
      return;
    }
    const urlToOpen = notificationData.url || 'https://eslamwael73.github.io/CIVIL_links-/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        console.log(`[firebase-messaging-sw.js] 🔍 Found ${windowClients.length} window clients`);
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
        console.log('[firebase-messaging-sw.js] 🆕 Opening new window:', urlToOpen);
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen).then((windowClient) => {
            if (windowClient) {
              setTimeout(() => {
                windowClient.postMessage({
                  type: 'CIVIL_FILES_NOTIFICATION',
                  data: {
                    message: notificationData.message,
                    title: notificationData.title,
                    timestamp: notificationData.timestamp,
                    source: 'notification_click'
                  }
                });
                console.log('[firebase-messaging-sw.js] 📨 Message sent to new window');
              }, 2000);
            }
            return windowClient;
          });
        }
      })
    );
  });

  // دالة جدولة التذكير
  function scheduleReminderNotification(data) {
    console.log('[firebase-messaging-sw.js] ⏰ Scheduling reminder for 1 hour later');
    setTimeout(() => {
      self.registration.showNotification('Civil Files - تذكير', {
        body: data.message || 'لا تنس مراجعة الرسالة اليومية!',
        icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        tag: 'civil-files-reminder',
        vibrate: [200, 100, 200],
        data: { ...data, isReminder: true }
      });
      console.log('[firebase-messaging-sw.js]bas: '✅ Reminder notification shown');
    }, 60 * 60 * 1000); // ساعة واحدة
  }

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
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error);
}