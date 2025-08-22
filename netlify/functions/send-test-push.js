const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const fetch = require('node-fetch');

let serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://eslamwael73.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let app;
    if (!getApps().some((app) => app.name === 'send-test-push')) {
      app = initializeApp({ credential: cert(serviceAccount) }, 'send-test-push');
    } else {
      app = getApps().find((app) => app.name === 'send-test-push');
    }

    const messaging = getMessaging(app);
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    const messageData = await messageResponse.json();
    const randomMessage = messageData.text;

    const notificationPayload = {
      notification: {
        title: 'Civil Files - اختبار',
        body: randomMessage
      },
      data: {
        title: 'Civil Files - اختبار',
        body: randomMessage,
        click_action: 'https://eslamwael73.github.io/CIVIL_links-/'
      },
      webpush: {
        notification: {
          icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          badge: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png',
          vibrate: [200, 100, 200],
          actions: [
            { action: 'open_site', title: 'فتح الموقع' },
            { action: 'dismiss', title: 'تجاهل' }
          ]
        },
        fcm_options: {
          link: 'https://eslamwael73.github.io/CIVIL_links-/'
        }
      },
      topic: 'all_users'
    };

    const response = await messaging.send(notificationPayload);
    console.log('✅ تم إرسال إشعار اختبار:', response);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Test notification sent', dailyMessage: randomMessage })
    };
  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار اختبار:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send test notification', details: error.message })
    };
  }
};