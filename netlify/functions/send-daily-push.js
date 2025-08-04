// Filename: send-daily-push.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // 1. Fetch a random message from your API
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    const messageData = await messageResponse.json();
    // تم تعديل السطر ده عشان يأخذ قيمة الـ "text" من الـ API
    const dailyMessage = messageData.text;

    // 2. Set up OneSignal configuration
    const oneSignalAppId = "5d382686-0e60-4504-8d76-b645e9b4601b";
    const oneSignalApiKey = "4hzt3yz5suhqfgdtotrie3tzw";
    
    // 3. Prepare the notification payload
    const notificationPayload = {
      app_id: oneSignalAppId,
      included_segments: ["Subscribed Users"],
      contents: { "en": dailyMessage, "ar": dailyMessage },
      headings: { "en": "Civil Files", "ar": "ملفات مدني" }
    };

    // 4. Send the notification via OneSignal API
    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${oneSignalApiKey}`
      },
      body: JSON.stringify(notificationPayload)
    });

    const responseData = await oneSignalResponse.json();

    console.log("Notification sent successfully:", responseData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent successfully" })
    };

  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send notification" })
    };
  }
};