// Filename: send-daily-push.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const fetch = require('node-fetch');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://eslam-api-5a47a.firebaseio.com'
});

exports.handler = async (event, context) => {
  try {
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    const messageData = await messageResponse.json();
    const dailyMessage = messageData.text;

    const notificationPayload = {
      notification: {
        title: "ملفات مدني",
        body: dailyMessage,
        icon: "https://eslamwael-api-arbic.netlify.app/icon.png", // هنا تضع رابط الأيقونة
        badge: "https://eslamwael-api-arbic.netlify.app/badge.png"  // هنا تضع رابط الأيقونة الصغيرة (اختياري)
      },
      topic: 'all_users'
    };

    const response = await getMessaging().send(notificationPayload);
    console.log('Successfully sent message:', response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent successfully", response: response })
    };

  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send notification", details: error.message })
    };
  }
};