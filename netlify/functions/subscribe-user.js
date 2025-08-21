const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const headers = {
  'Access-Control-Allow-Origin': 'https://eslamwael73.github.io',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

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
    // التحقق إذا كان التطبيق مهيأ بالفعل
    let app;
    if (!getApps().some((app) => app.name === 'subscribe-user')) {
      app = initializeApp({ credential: cert(serviceAccount) }, 'subscribe-user');
      console.log('✅ تم تهيئة Firebase Admin بنجاح');
    } else {
      app = getApps().find((app) => app.name === 'subscribe-user');
      console.log('✅ استخدام تطبيق Firebase موجود');
    }

    const messaging = getMessaging(app);

    let body = event.body;
    if (event.isBase64Encoded) {
      body = Buffer.from(body, 'base64').toString('utf-8');
    }

    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is empty.' })
      };
    }

    const parsedBody = JSON.parse(body);
    const { token } = parsedBody;

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Token is missing in the request body.' })
      };
    }

    const result = await messaging.subscribeToTopic(token, 'all_users');
    console.log('✅ تم الاشتراك بنجاح في topic:', token, result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Subscription successful!',
        token,
        result
      })
    };
  } catch (error) {
    console.error('❌ خطأ في تسجيل الـ token في topic:', error.message, error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to subscribe to topic',
        details: error.message
      })
    };
  }
};