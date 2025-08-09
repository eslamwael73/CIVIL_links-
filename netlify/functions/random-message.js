const messages = require('./messages.json');

exports.handler = async (event) => {
  try {
    const { index } = event.queryStringParameters || {};
    // هنجيب العدد الكلي للجمل مرة واحدة ونخزنه
    const totalMessages = messages.length;

    // لو التطبيق طلب جملة برقم معين
    if (index !== undefined) {
      const messageIndex = parseInt(index, 10);
      if (!isNaN(messageIndex) && messageIndex >= 0 && messageIndex < totalMessages) {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            text: messages[messageIndex].text, // نرجع الـ text
            totalMessages: totalMessages        // ونرجع العدد الكلي كمان
          }),
        };
      }
    }

    // لو التطبيق طلب جملة عشوائية (افتراضياً)
    const randomIndex = Math.floor(Math.random() * totalMessages);
    const randomMessage = messages[randomIndex];

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        text: randomMessage.text,  // نرجع الـ text
        totalMessages: totalMessages // ونرجع العدد الكلي كمان
      }),
    };
  } catch (error) {
    console.error("Error fetching message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "حدث خطأ داخلي." }),
    };
  }
};