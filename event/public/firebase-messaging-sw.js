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

// 💡 القاموس الشامل لترجمة الإشعارات في الخلفية (تم مطابقة المفاتيح مع الباك إند)
const notificationDictionary = {
    'security_alert': { title: 'Security Alert 🔒', body: 'New login detected on your account. If this wasn\'t you, please secure your account.' },
    'open_home': { title: 'Welcome to Aura Events! 🎉', body: 'Your account has been created and verified successfully. Welcome aboard!' },

    'new_booking': { title: 'New Booking Request! 📅', body: 'You have a new booking request. Please check your dashboard.' },
    'booking_cancelled': { title: 'Booking Cancelled ❌', body: 'A booking has been cancelled successfully.' },

    // 💡 تم تصحيح هذه المفاتيح لتطابق ما يرسله الباك إند بالضبط
    'booking_accepted_confirmation': { title: 'Action Successful ✅', body: 'You have successfully accepted the booking request. Waiting for client payment.' },
    'booking_completed_provider': { title: 'Booking Completed 🏁', body: 'You have successfully marked the booking as completed.' },
    'booking_rejected_confirmation': { title: 'Booking Rejected ❌', body: 'You have rejected the booking request successfully.' },
    'booking_confirmed_provider': { title: 'Payment Confirmed! 💳', body: 'The payment has been verified. The booking is now Confirmed and ready to be processed.' },

    'payment_accepted_client': { title: 'Payment Successful ✅', body: 'Your payment was approved and your booking is now confirmed.' },
    'payment_rejected_client': { title: 'Payment Rejected ❌', body: 'Your payment receipt was rejected. Please re-upload a valid proof.' },

    'booking_accepted': { title: 'Booking Accepted! 🎉', body: 'The service provider has accepted your booking request.' },
    'booking_completed': { title: 'Booking Completed ✅', body: 'Your booking has been completed successfully. Thank you!' },
    'booking_rejected': { title: 'Booking Update ⚠️', body: 'Sorry, your booking request was rejected.' },
    'booking_payment_due': { title: 'Payment Reminder ⏳', body: 'Please complete your payment within 3 days.' }
};

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const action = payload.data?.action;

    const notificationTitle = (action && notificationDictionary[action])
        ? notificationDictionary[action].title
        : payload.notification?.title || 'Aura Events Notification';

    const notificationBody = (action && notificationDictionary[action])
        ? notificationDictionary[action].body
        : payload.notification?.body || '';

    const notificationOptions = {
        body: notificationBody,
        icon: '/logo.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});