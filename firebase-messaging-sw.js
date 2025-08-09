// Filename: firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js');

// قم بتهيئة تطبيق Firebase هنا باستخدام بيانات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyAADlFaE-Qmp19P2wIsnZdjWhDmkjEJm8A",
  authDomain: "eslam-api-5a47a.firebaseapp.com",
  projectId: "eslam-api-5a47a",
  storageBucket: "eslam-api-5a47a.firebasestorage.app",
  messagingSenderId: "1001488651880",
  appId: "1:1001488651880:web:2ca301f5ea7e23e0c38ddd",
  measurementId: "G-4TMM1SBG3B"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://eslamwael-api-arbic.netlify.app/icon.png' // تم تحديث الرابط ليكون مباشرًا
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});