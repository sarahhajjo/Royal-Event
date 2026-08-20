import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore"; // 🌟 استيراد الداتابيز للشات
import api from './api'; // 💡 استيراد api المركزي للروابط الديناميكية

// 💡 إعدادات فايربيز (محدثة لتتطابق تماماً مع فريق الفلتر)
const firebaseConfig = {
    apiKey: "AIzaSyBHbYvLgb_JZC0TkkOs54jTU_i9DISCTiQ",
    authDomain: "royal-event-app.firebaseapp.com",
    projectId: "royal-event-app",
    storageBucket: "royal-event-app.firebasestorage.app",
    messagingSenderId: "607459927963",
    appId: "1:607459927963:web:9c45a3957ea5b7bd1fe33e",
    measurementId: "G-XE3V1D2YRZ"
};

// تهيئة خدمات فايربيز
const app = initializeApp(firebaseConfig);

// 🌟 تصدير الخدمات لنستخدمها في باقي أجزاء النظام
export const messaging = getMessaging(app); // للإشعارات
export const db = getFirestore(app);        // للشات (Firestore)

// ============================================================================
// 🔔 قسم الإشعارات (Notifications)
// ============================================================================

// القاموس الشامل لترجمة الإشعارات (مطابق للباك إند)
const notificationDictionary = {
    'security_alert': { title: 'Security Alert 🔒', body: 'New login detected on your account. If this wasn\'t you, please secure your account.' },
    'open_home': { title: 'Welcome to Aura Events! 🎉', body: 'Your account has been created and verified successfully. Welcome aboard!' },

    'new_booking': { title: 'New Booking Request! 📅', body: 'You have a new booking request. Please check your dashboard.' },
    'booking_cancelled': { title: 'Booking Cancelled ❌', body: 'A booking has been cancelled successfully.' },

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

// 1. طلب تصريح الإشعارات وإرسال التوكن للباك إند
export const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        const currentToken = await getToken(messaging, {
            vapidKey: 'BHnF-NeHhsHPk3dMXYJ7M-hx9e0SIUeg2Jq02j9llUy-IyskpCut1cngU41bVY-5YFXZvTD1ZzSzVYUfhoENF8A'
        });

        if (currentToken) {
            console.log('✅ FCM Token:', currentToken);

            try {
                // نستخدم api المركزي لإرسال التوكن بشكل صحيح وموثق
                await api.post('/device-token', { device_token: currentToken });
                console.log('تم حفظ التوكن في السيرفر بنجاح!');
            } catch (backendErr) {
                console.log('فشل حفظ التوكن في السيرفر:', backendErr);
            }

            return currentToken;
        }
    } catch (err) {
        console.error('❌ Error getting token:', err);
    }
};
// 2. الاستماع للإشعارات في واجهة المستخدم (Foreground)
    export const onMessageListener = () =>
        new Promise((resolve) => {
            onMessage(messaging, (payload) => {
                const action = payload.data?.action;

                let displayTitle = payload.notification?.title;
                let displayBody = payload.notification?.body;

                if (action && notificationDictionary[action]) {
                    displayTitle = notificationDictionary[action].title;
                    displayBody = notificationDictionary[action].body;
                }

                const translatedPayload = {
                    ...payload,
                    notification: {
                        ...payload.notification,
                        title: displayTitle,
                        body: displayBody
                    }
                };

                resolve(translatedPayload);
            });
        });