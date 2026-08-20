import axios from 'axios';

// 👑 إضافة القيم الافتراضية لمنع ظهور كلمة undefined نهائياً
const mode = import.meta.env.VITE_ENV_MODE || 'ngrok';
const activeApiUrl = mode === 'ngrok'
    ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
    : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

// إنشاء نسخة axios خاصة بطلبات الإدمن فقط
const adminApi = axios.create({
    baseURL: `${activeApiUrl}/admin`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 🚀 السطر السحري لتخطي شاشة تحذير النيغروك
        'ngrok-skip-browser-warning': '69420'
    }
});

// معترض الطلبات (Interceptor) لحقن التوكن تلقائياً
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default adminApi;