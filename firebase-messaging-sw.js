// Filename: firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

// قم بتهيئة تطبيق Firebase هنا باستخدام بيانات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyAADlFaE-Qmp19P2wIsnZdjWhDmkjEJm8A",
  authDomain: "eslam-api-5a47a.firebaseapp.com",
  projectId: "eslam-api-5a47a",
  storageBucket: "eslam-api-5a47a.firebasestorage.app",
  messagingSenderId: "1001488651880",
  appId: "1:1001488651880:web:2ca301f5ea7e23e0c38ddd"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// **هذا هو مفتاحك الصحيح الذي قمت بإرساله**
messaging.usePublicVapidKey("BHhUWghDf41__sveHRV2PBEAQi-J2SfYo0emn-3Ma1Ev7yEpE47_iL4_v-oWwEIJ6AKyzCOpFC8_JdLy55Y7kno");

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://eslamwael-api-arbic.netlify.app/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});