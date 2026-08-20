import axios from 'axios';

// 👑 قراءة الرابط ديناميكياً
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const cleanApiBase = `${baseURL.replace(/\/api\/?$/, '')}/api`;

const apiClient = axios.create({
    baseURL: cleanApiBase,
    headers: { 'Accept': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const paymentService = {
    uploadProof: (bookingId, file) => {
        const formData = new FormData();
        formData.append('proof_file', file);
        formData.append('booking_id', bookingId);
        return apiClient.post('/payments/upload-proof', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default paymentService;