// firebase-messaging-sw.js - Fixed version
console.log('🔧 Loading Firebase messaging service worker...');

// Import Firebase scripts with error handling
try {
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');
  console.log('✅ Firebase scripts loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Firebase scripts:', error);
  // Fallback - continue without Firebase
}

// Check if Firebase is available
if (typeof firebase !== 'undefined') {
  try {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCXX_kt4-3J_ocNKYAegNTar4Bd9OIgA2k",
      authDomain: "eslam-website.firebaseapp.com",
      projectId: "eslam-website",
      storageBucket: "eslam-website.firebasestorage.app",
      messagingSenderId: "626111073932",
      appId: "1:626111073932:web:f7137bc90e139e822675a9",
      measurementId: "G-3DD9VGDC46"
    };

    // Initialize Firebase in service worker
    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase messaging
    const messaging = firebase.messaging();
    console.log('✅ Firebase messaging initialized successfully');

    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log('📩 Received background message:', JSON.stringify(payload, null, 2));
      
      const notificationTitle = payload.notification?.title || 'Civil Files';
      const notificationBody = payload.notification?.body || 'لديك رسالة جديدة';
      
      const notificationOptions = {
        body: notificationBody,
        icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        tag: 'civil-files-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open_site',
            title: 'فتح الموقع'
          },
          {
            action: 'later',
            title: 'تذكيرني لاحقاً'
          }
        ],
        data: {
          url: payload.webpush?.fcm_options?.link || 'https://eslamwael73.github.io/CIVIL_links-/',
          message: notificationBody,
          title: notificationTitle,
          timestamp: Date.now(),
          ...payload.data
        }
      };

      console.log('🔔 Showing background notification:', notificationTitle);
      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (firebaseError) {
    console.error('❌ Firebase initialization failed:', firebaseError);
  }
} else {
  console.warn('⚠️ Firebase not available in service worker');
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  if (event.action === 'later') {
    // Schedule reminder
    setTimeout(() => {
      self.registration.showNotification('Civil Files - تذكير', {
        body: notificationData.message || 'لا تنس مراجعة الرسالة!',
        icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
        tag: 'civil-files-reminder',
        data: notificationData
      });
    }, 60 * 60 * 1000); // 1 hour
    return;
  }
  
  // Open website
  const urlToOpen = notificationData.url || 'https://eslamwael73.github.io/CIVIL_links-/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes('eslamwael73.github.io/CIVIL_links-/') && 'focus' in client) {
          client.postMessage({
            type: 'CIVIL_FILES_NOTIFICATION',
            data: notificationData
          });
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notification closed');
});

// Service worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('🔧 Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🎯 Service worker script loaded completely');
