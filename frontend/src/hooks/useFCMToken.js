// src/hooks/useFCMToken.js
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const useFCMToken = (role) => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const registerToken = async () => {
      console.log("Requesting notification permission...");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Permission denied for push notifications");
        alert("Notification permission is required for push notifications.");
        return;
      }

      try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (token) {
          console.log("FCM Token:", token);
          setFcmToken(token);

          await axios.post(
            `${BASE_URL}/api/push/register-token`,
            { token, role }, // role = "user" | "captain"
            { withCredentials: true }
          );

          console.log("Token registered successfully for", role);
        } else {
          console.warn("No registration token available.");
        }
      } catch (err) {
        console.error("FCM registration error:", err);
      }
    };

    // 🔹 Run once on mount
    registerToken();

    // 🔹 Re-run periodically in case token rotates (e.g. every 24h)
    const interval = setInterval(registerToken, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [role]);

  // 🔹 Foreground message listener
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // You can trigger UI here (toast, snackbar, etc.)
      if (payload?.notification) {
        alert(
          `${payload.notification.title}\n${payload.notification.body}`
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return fcmToken;
};

export default useFCMToken;
