// استيراد مكتبات Firebase
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
    const notificationTitle = payload.notification?.title || 'Civil Files';
    const notificationOptions = {
      body: payload.notification?.body || 'إشعار جديد',
      icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      vibrate: [200, 100, 200],
      actions: [{ action: 'open_site', title: 'فتح الموقع' }],
      data: { url: 'https://eslamwael73.github.io/CIVIL_links-/' }
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[firebase-messaging-sw.js] ✅ Notification displayed');
  });

  // معالجة النقر على الإشعار
  self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] 🖱️ Notification clicked:', event.action);
    event.notification.close();
    if (event.action === 'open_site') {
      event.waitUntil(clients.openWindow('https://eslamwael73.github.io/CIVIL_links-/'));
    }
  });
} catch (error) {
  console.error('[firebase-messaging-sw.js] ❌ Failed to initialize Firebase:', error);
}