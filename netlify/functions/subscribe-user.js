const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// معالجة مفتاح Firebase Service Account
let serviceAccount = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('✅ تم تحميل service account من JSON string');
  } catch (parseError) {
    console.error('❌ فشل في تحليل JSON:', parseError.message);
  }
}

if (!serviceAccount) {
  try {
    serviceAccount = require('./eslam-website-firebase-adminsdk.json');
    console.log('✅ تم تحميل service account من ملف محلي');
  } catch (fileError) {
    console.error('❌ فشل في تحميل الملف المحلي:', fileError.message);
  }
}

exports.handler = async (event) => {
  // إضافة headers للـ CORS هنا
  const headers = {
    'Access-Control-Allow-Origin': 'https://eslamwael73.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // معالجة طلبات OPTIONS للـ CORS
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
        details: 'Check environment variables in Netlify or provide a valid service account file.'
      })
    };
  }

  try {
    const app = initializeApp({ credential: cert(serviceAccount) }, 'subscribe-user');
    const messaging = getMessaging(app);
    console.log('✅ تم تهيئة Firebase Admin بنجاح');

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
    console.error('❌ Error subscribing to topic:', error.message, error);
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