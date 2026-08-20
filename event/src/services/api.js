import axios from 'axios';

// 💡 1. قراءة وضع البيئة والرابط المناسب من ملف .env
const mode = import.meta.env.VITE_ENV_MODE || 'local';
const API_URL = mode === 'ngrok'
    ? import.meta.env.VITE_API_NGROK
    : import.meta.env.VITE_API_LOCAL;

// 💡 2. إنشاء نسخة مخصصة من axios بالرابط الديناميكي
const api = axios.create({
    baseURL: API_URL || 'http://127.0.0.1:8000/api', // الرابط الاحتياطي
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'ngrok-skip-browser-warning': 'true'
    }
});

// 1. معترض الطلبات (إضافة التوكن تلقائياً)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. معترض الاستجابات
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 💡 التعديل السحري: نُنفذ تسجيل الخروج فقط إذا لم يكن الطلب من صفحة الـ login!
            if (!error.config.url.includes('/login')) {
                console.error("Token expired or invalid. Logging out...");
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;