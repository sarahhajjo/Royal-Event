// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBHbYvLgb_JZC0TkkOs54jTU_i9DISCTiQ",
    projectId: "royal-event-app",
    messagingSenderId: "607459927963",
    appId: "1:607459927963:web:9c45a3957ea5b7bd1fe33e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});