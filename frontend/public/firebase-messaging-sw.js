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
  storageBucket: "mediride-f1621.appspot.com",
  messagingSenderId: "482783627268",
  appId: "1:482783627268:web:9937a9dc077b8012c34d51",
  measurementId: "G-SJ1M4EN7NJ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/firebase-logo.png",
    data: payload.data, // keep rideId etc. for click actions
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle notification click (open ride details page)
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event.notification.data);
  event.notification.close();

  const url = `/ride/${event.notification.data.rideId}`;
  event.waitUntil(
    clients.openWindow(url) // deep link into app
  );
});
