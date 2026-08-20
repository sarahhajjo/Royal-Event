import axios from 'axios';

// 👑 قراءة الرابط من ملف البيئة لتسهيل النشر لاحقاً
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// إنشاء نسخة axios خاصة بطلبات الإدمن فقط
const adminApi = axios.create({
    baseURL: `${baseURL}/api/admin`, // 👈 لاحظي أننا أضفنا /admin هنا لاختصار الروابط
    headers: {
        'Content-Type': 'application/json'
    }
});

// معترض الطلبات (Interceptor) لحقن التوكن تلقائياً
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // أو المكان الذي تحفظين فيه التوكن
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default adminApi;