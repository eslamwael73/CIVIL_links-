// Filename: send-daily-push.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const fetch = require('node-fetch');

// قم بتهيئة Firebase Admin SDK باستخدام مفتاح حساب الخدمة
// ستحتاج إلى إضافة مفتاح حساب الخدمة الخاص بك كمتغير بيئة في Netlify
// اسمه FIREBASE_SERVICE_ACCOUNT_KEY
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://eslam-api-5a47a.firebaseio.com' // تأكد من أن هذا الرابط صحيح
});

exports.handler = async (event, context) => {
  try {
    // 1. جلب رسالة عشوائية من الـ API الخاص بك
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    const messageData = await messageResponse.json();
    const dailyMessage = messageData.text;

    // 2. إعداد حمولة الإشعار (Notification Payload) لـ Firebase
    const notificationPayload = {
      notification: {
        title: "ملفات مدني",
        body: dailyMessage
      },
      topic: 'all_users' // سيتم إرسال الإشعار لجميع المشتركين في هذا الـ topic
    };

    // 3. إرسال الإشعار عبر Firebase Admin SDK
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