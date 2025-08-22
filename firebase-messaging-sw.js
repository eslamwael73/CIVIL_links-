// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

// Firebase configuration (نفس الكونفيجريشن بتاعك)
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

// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

// Firebase configuration (نفس الكونفيجريشن بتاعك)
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

console.log('🔧 Firebase messaging service worker initialized');

// Handle background messages (لما التاب مش مفتوح)
messaging.onBackgroundMessage((payload) => {
  console.log('📩 Received background message:', JSON.stringify(payload, null, 2));
  
  // استخراج البيانات حسب الـ structure من send-daily-push.js
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
      },
      {
        action: 'close',
        title: 'إغلاق'
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
  // عرض الإشعار
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks (لما المستخدم يدوس على الإشعار)
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action, JSON.stringify(event.notification.data, null, 2));
  
  // إخفاء الإشعار
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  if (event.action === 'close') {
    // لو دوس على إغلاق
    console.log('❌ Notification dismissed by user');
    return;
  } else if (event.action === 'later') {
    // لو دوس على تذكيرني لاحقاً
    console.log('⏰ Scheduling reminder notification');
    scheduleReminderNotification(notificationData);
    return;
  }
  
  // فتح الموقع (الـ action الافتراضي أو لو دوس open_site)
  console.log('🌐 Opening website...');
  const urlToOpen = notificationData.url || 'https://eslamwael73.github.io/CIVIL_links-/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        console.log(`🔍 Found ${windowClients.length} window clients`);
        
        // لو الموقع مفتوح بالفعل، ركز عليه
        for (const client of windowClients) {
          if (client.url.includes('eslamwael73.github.io/CIVIL_links-/') && 'focus' in client) {
            console.log('✅ Focusing existing window:', client.url);
            // إرسال بيانات الرسالة للصفحة المفتوحة
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
        
        // لو مش مفتوح، افتح تاب جديد
        console.log('🆕 Opening new window:', urlToOpen);
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen).then(windowClient => {
            if (windowClient) {
              console.log('✅ New window opened successfully');
              // إرسال البيانات للنافذة الجديدة بعد التحميل
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
                console.log('📨 Message sent to new window');
              }, 2000);
            }
            return windowClient;
          });
        }
      })
      .catch(error => {
        console.error('❌ Error handling notification click:', error);
      })
  );
});

// دالة جدولة تذكير لاحق
function scheduleReminderNotification(data) {
  console.log('⏰ Scheduling reminder for 1 hour later');
  // جدولة إشعار تذكير بعد ساعة واحدة
  setTimeout(() => {
    self.registration.showNotification('Civil Files - تذكير', {
      body: data.message || 'لا تنس مراجعة الرسالة اليومية!',
      icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
      tag: 'civil-files-reminder',
      vibrate: [200, 100, 200],
      data: {
        ...data,
        isReminder: true
      }
    });
    console.log('🔔 Reminder notification shown');
  }, 60 * 60 * 1000); // ساعة واحدة
}

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notification closed:', event.notification.tag);
  // يمكنك إضافة analytics هنا لو عايز تتبع إغلاق الإشعارات
});

// Service worker installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service worker installing...');
  self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log('✅ Service worker activated');
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('🎯 Service worker claimed all clients');
    })
  );
});

// Handle service worker messages from main thread
self.addEventListener('message', (event) => {
  console.log('📨 Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});