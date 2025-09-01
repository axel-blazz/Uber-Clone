const admin = require("../config/firebaseAdmin");

async function sendPushNotification(token, payload) {
  if (!token) return;
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

module.exports = { sendPushNotification };
