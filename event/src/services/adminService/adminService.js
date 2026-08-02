import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// إنشاء Axios Instance احترافي
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Interceptor لتمرير التوكن
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const adminService = {
    get: (url, config = {}) => apiClient.get(url, config),
    put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
    post: (url, data = {}, config = {}) => apiClient.post(url, data, config),

    // ─── Users & Organizers ──────────────────────────────────────────
    getAdminUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data.data || response.data;
    },

    getOrganizerById: async (id) => {
        // تنويه: تأكدي إذا كان الباك إند يكتبها Organzier أم Organizer
        const response = await apiClient.get(`/admin/Organzier/${id}`);
        return response.data.data || response.data;
    },

    // ─── Providers (Companies / Freelancers) ─────────────────────────
    getProviderById: async (id) => {
        const response = await apiClient.get(`/admin/providers/${id}`);
        return response.data.data || response.data;
    },
    getDistricts: async () => {
        const response = await apiClient.get('/districts');
        return response.data.data || response.data;
    },

    getCategories: async () => {
        const response = await apiClient.get('/categories'); // تأكدي أن هذا هو الرابط الصحيح لديك
        return response.data?.data || response.data || [];
    },
    approveProvider: (id) =>
        apiClient.put(`/admin/providers/${id}/approve`),

    rejectProvider: (id, reason) =>
        apiClient.put(`/admin/providers/${id}/reject`, { rejection_reason: reason }),

    // ─── Listings ────────────────────────────────────────────────────
    approveListing: (id) =>
        apiClient.put(`/admin/listings/${id}/approve`),

    rejectListing: (id, reason) =>
        apiClient.put(`/admin/listings/${id}/reject`, { rejection_reason: reason }),

    // ─── Bookings (صفحة Pending Approvals + Payment Approvals) ───────
    // ⚠️ جديد — أضفتها لتغطية GET /admin/bookings يلي عطيتيني ياه، بنفس
    // نمط باقي الميثودز عندك (PUT + rejection_reason). تأكدي المسار مطابق
    // تماماً لما يجهز الباك اند عندك، وبدّلي approve/reject إذا كانوا مختلفين.
    getPayments: async (params = {}) => {
        const response = await apiClient.get('/admin/payments', { params });
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await apiClient.get(`/admin/bookings/${id}`);
        return response.data.data || response.data;
    },

    approveBooking: (id) =>
        apiClient.put(`/admin/bookings/${id}/approve`),

    rejectBooking: (id, reason) =>
        apiClient.put(`/admin/bookings/${id}/reject`, { rejection_reason: reason }),

    // ─── Payments ──────────────────────────────────────────────────────
    // ⚠️ جديد — مبني حرفياً على الـ Postman collection يلي بعتيتيها:
    //   GET  /admin/payments/{id}/view      → تفاصيل الدفعة + ملف الإثبات
    //   PUT  /admin/{id}/confirm            → تأكيد الدفعة (لاحظي: بدون /payments/ بالمسار)
    //   PUT  /admin/{id}/reject?note=...    → رفض الدفعة، السبب query param اسمه "note"
    getPaymentView: async (paymentId) => {
        const response = await apiClient.get(`/admin/payments/${paymentId}/view`);
        return response.data.data || response.data;
    },

    confirmPayment: (paymentId) =>
        apiClient.put(`/admin/${paymentId}/confirm`),

    rejectPayment: (paymentId, note) =>
        apiClient.put(`/admin/${paymentId}/reject`, null, { params: { note } }),
};

export default adminService;
