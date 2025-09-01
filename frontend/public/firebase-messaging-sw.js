// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAZKl1t8YCk3m6dnmJSEGHNydNxamtZEIw",
  authDomain: "mediride-f1621.firebaseapp.com",
  projectId: "mediride-f1621",
  storageBucket: "mediride-f1621.firebasestorage.app",
  messagingSenderId: "482783627268",
  appId: "1:482783627268:web:9937a9dc077b8012c34d51",
  measurementId: "G-SJ1M4EN7NJ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]