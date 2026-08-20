import axios from 'axios';

// 👑 قراءة الرابط ديناميكياً من ملف الـ .env (مع دعم Ngrok)
const base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const cleanApiBase = `${base.replace(/\/api\/?$/, '')}/api`;

class FreelancerApi {
    constructor() {
        this.BASE_URL = cleanApiBase; // 👈 استخدام الرابط الديناميكي هنا

        this.instance = axios.create({
            baseURL: this.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // إعدادات التوكن
        this.instance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        });

        // إعدادات الـ 401
        this.instance.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        );
    }

    // دوال عامة لاستخدامها داخل ملفات الخدمات
    async get(url, config = {}) { return this.instance.get(url, config); }
    async post(url, data = {}, config = {}) { return this.instance.post(url, data, config); }
    async put(url, data = {}, config = {}) { return this.instance.put(url, data, config); }
    async delete(url, config = {}) { return this.instance.delete(url, config); }
}

const freelancerApi = new FreelancerApi();
export default freelancerApi;