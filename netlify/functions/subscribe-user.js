// Filename: subscribe-user.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

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
    const { token } = JSON.parse(event.body);

    await getMessaging().subscribeToTopic(token, 'all_users');
    
    console.log('Successfully subscribed token to topic:', token);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscription successful!" })
    };
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to subscribe to topic", details: error.message })
    };
  }
};