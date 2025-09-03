const admin = require("../config/firebaseAdmin");

async function sendPushNotification(token, title, body, data = {}) {
  try {
    const message = {
      data: {
        title,
        body,
        ...data, // e.g. rideId
      },
      token,
    };

    console.log("📤 Sending push payload:", JSON.stringify(message, null, 2));
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    return response;
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    throw err;
  }
}

module.exports = { sendPushNotification };
