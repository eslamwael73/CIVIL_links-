// استيراد مكتبات Firebase بإصدار متوافق
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// إعدادات Firebase
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
    const messaging = firebase.messaging();
    console.log('✅ Firebase initialized in Service Worker');

    // التعامل مع الإشعارات في الخلفية
    messaging.onBackgroundMessage((payload) => {
        console.log('📥 Received background message:', payload);
        const notificationTitle = payload.notification?.title || 'Civil Files';
        const notificationOptions = {
            body: payload.notification?.body || 'New notification',
            icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
            badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
            data: payload.data || {}
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // التعامل مع النقر على الإشعارات
    self.addEventListener('notificationclick', (event) => {
        console.log('🔔 Notification clicked:', event.notification);
        event.notification.close();
        if (event.notification.data && event.notification.data.url) {
            event.waitUntil(clients.openWindow(event.notification.data.url));
        } else {
            event.waitUntil(clients.openWindow('https://eslamwael73.github.io/CIVIL_links-/'));
        }
    });

} catch (error) {
    console.error('❌ Error initializing Firebase in Service Worker:', error);
}