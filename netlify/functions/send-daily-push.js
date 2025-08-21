const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const fetch = require('node-fetch');

let serviceAccount = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✅ تم تحميل service account من JSON string');
  } catch (parseError) {
    console.error('❌ فشل في تحليل JSON لـ FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
  }
}

exports.handler = async (event) => {
  // Headers للـ CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://eslamwael73.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // معالجة طلبات OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (!serviceAccount) {
    console.error('❌ لم يتم العثور على مفتاح service account صالح');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid.',
        details: 'Check environment variables in Netlify.'
      })
    };
  }

  try {
    // تهيئة Firebase
    const app = initializeApp({ credential: cert(serviceAccount) }, 'send-daily-push');
    const messaging = getMessaging(app);
    console.log('✅ تم تهيئة Firebase Admin بنجاح');

    // جلب الجملة العشوائية
    const messageResponse = await fetch('https://eslamwael-api-arbic.netlify.app/.netlify/functions/random-message');
    if (!messageResponse.ok) {
      throw new Error(`Failed to fetch random message: ${messageResponse.status}`);
    }
    const messageData = await messageResponse.json();
    const dailyMessage = messageData.text;

    // إعداد الإشعار
    const notificationPayload = {
      notification: {
        title: 'Civil Files',
        body: dailyMessage,
        icon: 'https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png', // استخدام نفس الأيقونة المستخدمة في index.html
      },
      webpush: {
        fcm_options: {
          link: 'https://eslamwael73.github.io/CIVIL_links-/' // رابط يفتح الموقع عند النقر
        }
      },
      topic: 'all_users'
    };

    // إرسال الإشعار
    const response = await messaging.send(notificationPayload);
    console.log('✅ تم إرسال الإشعار بنجاح:', response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Notification sent successfully',
        response,
        dailyMessage
      })
    };
  } catch (error) {
    console.error('❌ خطأ في إرسال الإشعار:', error.message, error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send notification',
        details: error.message
      })
    };
  }
};