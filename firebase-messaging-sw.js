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
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error.message, error);
}

const messaging = firebase.messaging();

// معالجة الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 📩 Received background message:', JSON.stringify(payload, null, 2));

  // التحقق من وجود notification في الـ payload
  if (!payload.notification) {
    console.error('[firebase-messaging-sw.js] ❌ No notification data in payload:', payload);
    return;
  }

  const notificationTitle = payload.notification.title || 'Civil Files';
  const notificationOptions = {
    body: payload.notification.body || 'إشعار جديد',
    icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
    vibrate: [200, 100, 200],
    tag: 'civil-files-notification',
    renotify: true,
    requireInteraction: false,
    silent: false,
    actions: [
      {
        action: 'open_site',
        title: 'فتح الموقع'
      },
      {
        action: 'dismiss',
        title: 'تجاهل'
      }
    ],
    data: payload.data || {}
  };

  try {
    return self.registration.showNotification(notificationTitle, notificationOptions);
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Failed to display notification:', error.message, error);
  }
});

// معالجة النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = 'https://eslamwael73.github.io/CIVIL_links-/';
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then((windowClients) => {
      // البحث عن تبويب مفتوح بالفعل
      for (let client of windowClients) {
        if (client.url.includes('eslamwael73.github.io/CIVIL_links-') && 'focus' in client) {
          return client.focus();
        }
      }
      // فتح تبويب جديد إذا لم يوجد
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// معالجة تثبيت الـ Service Worker
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker installing...');
  // تخطي مرحلة الانتظار لتنشيط SW الجديد فوراً
  self.skipWaiting();
});

// معالجة تفعيل الـ Service Worker
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker activated');
  // التحكم في جميع الصفحات فوراً
  event.waitUntil(self.clients.claim());
});

// معالج Push للتأكد من استقبال الإشعارات
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] 📬 Push event received:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[firebase-messaging-sw.js] 📬 Push data:', payload);
      
      // إذا لم يتم معالجة الإشعار بواسطة Firebase، معالجته يدوياً
      if (payload.notification) {
        const notificationTitle = payload.notification.title || 'Civil Files';
        const notificationOptions = {
          body: payload.notification.body || 'إشعار جديد',
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          vibrate: [200, 100, 200],
          tag: 'civil-files-push',
          data: payload.data || {}
        };

        event.waitUntil(
          self.registration.showNotification(notificationTitle, notificationOptions)
        );
      }
    } catch (error) {
      console.error('[firebase-messaging-sw.js] ❌ Error parsing push data:', error);
    }
  } else {
    console.log('[firebase-messaging-sw.js] ℹ️ Push event has no data');
  }
});

// تتبع إظهار الإشعارات
self.addEventListener('notificationshow', (event) => {
  console.log('[firebase-messaging-sw.js] 📣 Notification displayed:', event.notification);
});

// معالجة إغلاق الإشعارات
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] 🚫 Notification closed:', event.notification);
});

// معالجة أخطاء عامة
self.addEventListener('error', (error) => {
  console.error('[firebase-messaging-sw.js] ❌ Service Worker error:', error.message, error);
});

// معالجة الأخطاء غير المتوقعة
self.addEventListener('unhandledrejection', (event) => {
  console.error('[firebase-messaging-sw.js] ❌ Unhandled promise rejection:', event.reason);
});

console.log('[firebase-messaging-sw.js] 🔄 Service Worker script loaded and ready');