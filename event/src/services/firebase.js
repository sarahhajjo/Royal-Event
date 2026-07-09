// services/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
    apiKey: "AIzaSyBHbYvLgb_JZC0TkkOs54jTU_i9DISCTiQ",
    authDomain: "royal-event-app.firebaseapp.com",
    projectId: "royal-event-app",
    storageBucket: "royal-event-app.firebasestorage.app",
    messagingSenderId: "607459927963",
    appId: "1:607459927963:web:9c45a3957ea5b7bd1fe33e",
    measurementId: "G-9T8CZ9BPJM"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// دالة لطلب التوكن من المتصفح
// services/firebase.js
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
                await axios.post('http://127.0.0.1:8000/api/device-token',
                    { device_token: currentToken }, // هذا هو الـ body
                    {
                        headers: {
                            // ضروري جداً إرسال التوكن ليتعرف السيرفر على المستخدم
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
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
// دالة الاستماع للإشعارات في المقدمة
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });