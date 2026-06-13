import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// إنشاء نسخة مخصصة من axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 1. معترض الطلبات (إضافة التوكن تلقائياً لأي طلب يخرج من النظام)
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

// 2. معترض الاستجابات (طرد المستخدم إذا انتهى التوكن 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expired or invalid. Logging out...");
            localStorage.removeItem('token');
            // يحول المستخدم لصفحة تسجيل الدخول (عدلي الرابط إذا كان مختلفاً عندك)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;