// Filename: send-daily-push.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const fetch = require('node-fetch');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
}

if (serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://eslam-api-5a47a.firebaseio.com'
  });
}

exports.handler = async (event, context) => {
  if (!serviceAccount) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid." })
    };
  }
  
  try {
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    const messageData = await messageResponse.json();
    const dailyMessage = messageData.text;

    const notificationPayload = {
      notification: {
        title: "Civil Files",
        body: dailyMessage,
      },
      webpush: {
        notification: {
          icon: "https://eslamwael-api-arbic.netlify.app/icon.png",
          // تمت إزالة سطر badge.png
        }
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