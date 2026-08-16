import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Accept': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const paymentService = {
    // POST /payments/upload-proof — form-data: proof_file (File), booking_id (Text)
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
