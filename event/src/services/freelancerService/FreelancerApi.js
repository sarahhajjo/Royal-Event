import axios from 'axios';

// 👑 1. قراءة وضع البيئة (جعلنا الافتراضي local ليكون آمناً عند التطوير)
const mode = import.meta.env.VITE_ENV_MODE || 'local';
const activeApiUrl = mode === 'ngrok'
    ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
    : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

// للتأكد من الرابط في الكونسول
console.log("🚀 Freelancer API URL is:", activeApiUrl);

class FreelancerApi {
    constructor() {
        this.BASE_URL = activeApiUrl;

        this.instance = axios.create({
            baseURL: this.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 🚀 السطر السحري لتخطي شاشة تحذير النيغروك
                'ngrok-skip-browser-warning': '69420'
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
                    // 💡 التعديل السحري: نمنع التحديث إذا كان الخطأ قادماً من صفحة الـ login
                    if (!err.config.url.includes('/login')) {
                        console.error("Freelancer Token expired or invalid. Logging out...");
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
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