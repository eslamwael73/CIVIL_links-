// Filename: subscribe-user.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

// معالجة مفتاح Firebase Service Account
let serviceAccount = null;

// الطريقة الأولى: إذا كان environment variable عبارة عن JSON string
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        console.log("✅ تم تحميل service account من JSON string");
    } catch (parseError) {
        console.error("❌ فشل في تحليل JSON:", parseError);
        
        // الطريقة الثانية: إذا كان المفتاح محفوظ ك stringified object
        try {
            const fixedJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
                .replace(/'/g, '"') // استبدال single quotes ب double quotes
                .replace(/\\"/g, '"') // إصلاح escaped quotes
                .replace(/(\w+:)|(\w+ :)/g, function(matched) {
                    return '"' + matched.replace(':', '') + '":';
                }); // إضافة quotes حول keys
            
            serviceAccount = JSON.parse(fixedJson);
            console.log("✅ تم تحميل service account من JSON معدل");
        } catch (fixError) {
            console.error("❌ فشل في التحليل بعد الإصلاح:", fixError);
        }
    }
}

// إذا فشل كل شيء، جرب الطريقة الثالثة (للتطوير المحلي)
if (!serviceAccount) {
    try {
        serviceAccount = require('./service-account-key.json');
        console.log("✅ تم تحميل service account من ملف محلي");
    } catch (fileError) {
        console.error("❌ فشل في تحميل الملف المحلي:", fileError);
    }
}

// تهيئة Firebase Admin
if (serviceAccount) {
    try {
        initializeApp({
            credential: cert(serviceAccount)
        });
        console.log("✅ تم تهيئة Firebase Admin بنجاح");
    } catch (initError) {
        console.error("❌ فشل في تهيئة Firebase Admin:", initError);
    }
} else {
    console.error("❌ لم يتم العثور على مفتاح service account صالح");
}

exports.handler = async (event, context) => {
    // إذا لم يتم تهيئة Firebase بشكل صحيح
    if (!serviceAccount) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid.",
                details: "تحقق من environment variables في Netlify"
            })
        };
    }
    
    try {
        // معالجة request body
        let body = event.body;
        if (event.isBase64Encoded) {
            body = Buffer.from(body, 'base64').toString('utf-8');
        }

        if (!body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Request body is empty." })
            };
        }

        const parsedBody = JSON.parse(body);
        const { token } = parsedBody;

        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Token is missing in the request body." })
            };
        }

        // الاشتراك في Topic
        await getMessaging().subscribeToTopic(token, 'all_users');
        
        console.log('✅ تم الاشتراك بنجاح في topic:', token);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: "Subscription successful!",
                token: token
            })
        };
        
    } catch (error) {
        console.error("❌ Error subscribing to topic:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Failed to subscribe to topic",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};