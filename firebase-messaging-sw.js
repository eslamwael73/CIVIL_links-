// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAADlFaE-Qmp19P2wIsnZdjWhDmkjEJm8A",
  authDomain: "eslam-api-5a47a.firebaseapp.com",
  projectId: "eslam-api-5a47a",
  storageBucket: "eslam-api-5a47a.firebasestorage.app",
  messagingSenderId: "1001488651880",
  appId: "1:1001488651880:web:2ca301f5ea7e23e0c38ddd",
  measurementId: "G-4TMM1SBG3B"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // يمكنك تغيير الأيقونة هنا
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});