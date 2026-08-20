import axios from 'axios';

// 👑 قراءة وضع البيئة مع قيم افتراضية قوية لمنع خطأ الـ 404
const mode = import.meta.env.VITE_ENV_MODE || 'ngrok';

const activeApiUrl = mode === 'ngrok'
    ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
    : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

// للطباعة في الكونسول للتأكد من أن الرابط صحيح 100%
console.log("🚀 Active API URL is:", activeApiUrl);

// إنشاء نسخة مخصصة من axios
const api = axios.create({
    baseURL: activeApiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420'
    }
});

// 1. معترض الطلبات (إضافة التوكن)
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

// 2. معترض الاستجابات (طرد المستخدم 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expired or invalid. Logging out...");
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;