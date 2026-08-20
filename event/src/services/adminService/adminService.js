import adminApi from './AdminApi';

// 👑 قراءة الرابط الصحيح (النيغروك أو المحلي) للطلبات الاستثنائية
const mode = import.meta.env.VITE_ENV_MODE || 'ngrok';
const base = mode === 'ngrok'
    ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
    : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

const cleanApiBase = `${base.replace(/\/api\/?$/, '')}/api`;

export const adminService = {
    get: (url, config = {}) => adminApi.get(url, config),
    put: (url, data = {}, config = {}) => adminApi.put(url, data, config),
    post: (url, data = {}, config = {}) => adminApi.post(url, data, config),

    // ─── Users & Organizers ──────────────────────────────────────────
    getAdminUsers: async () => {
        const response = await adminApi.get('/users');
        return response.data.data || response.data;
    },

    getOrganizerById: async (id) => {
        const response = await adminApi.get(`/Organzier/${id}`);
        return response.data.data || response.data;
    },

    // ─── Providers (Companies / Freelancers) ─────────────────────────
    getProviderById: async (id) => {
        const response = await adminApi.get(`/providers/${id}`);
        return response.data.data || response.data;
    },
    getAllProviders: async (params = {}) => {
        const response = await adminApi.get('/providers', { params });
        return response.data.data || response.data;
    },

    // ⚠️ مسارات عامة لا تتبع للإدمن (نستخدم baseURL: cleanApiBase)
    getDistricts: async () => {
        const response = await adminApi.get('/districts', { baseURL: cleanApiBase });
        return response.data.data || response.data;
    },

    getCategories: async () => {
        const response = await adminApi.get('/categories', { baseURL: cleanApiBase });
        return response.data?.data || response.data || [];
    },

    approveProvider: (id) =>
        adminApi.put(`/providers/${id}/approve`),

    rejectProvider: (id, reason) =>
        adminApi.put(`/providers/${id}/reject`, { rejection_reason: reason }),

    // ─── Listings ────────────────────────────────────────────────────
    approveListing: (id) =>
        adminApi.put(`/listings/${id}/approve`),

    rejectListing: (id, reason) =>
        adminApi.put(`/listings/${id}/reject`, { rejection_reason: reason }),

    getListings: async (page = 1) => {
        const response = await adminApi.get('/pending-listings', { params: { page } });
        return response.data;
    },

    // ─── Bookings ───────────────────────────────────────────────────
    getBookingById: async (id) => {
        const response = await adminApi.get(`/bookings/${id}`);
        return response.data.data || response.data;
    },

    approveBooking: (id) =>
        adminApi.put(`/bookings/${id}/approve`),

    rejectBooking: (id, reason) =>
        adminApi.put(`/bookings/${id}/reject`, { rejection_reason: reason }),

    // ─── Job Offers ──────────────────────────────────────────────────
    getPendingJobOffers: async (page = 1) => {
        const response = await adminApi.get('/job-offers/pending', { params: { page } });
        return response.data;
    },

    getJobOfferById: async (id) => {
        const response = await adminApi.get(`/job-offers/${id}`, { baseURL: cleanApiBase });
        return response.data.data || response.data;
    },

    approveJobOffer: (id) =>
        adminApi.put(`/job-offers/${id}/approve`),

    rejectJobOffer: (id, reason) =>
        adminApi.put(`/job-offers/${id}/reject`, { rejection_reason: reason }),

    // ─── Payments ──────────────────────────────────────────────────────
    getPayments: async (params = {}) => {
        const response = await adminApi.get('/payments', { params });
        return response.data;
    },

    getPaymentView: async (paymentId) => {
        const response = await adminApi.get(`/payments/${paymentId}/view`);
        return response.data.data || response.data;
    },

    // ─── Dashboard Stats ───────────────────────────────────────────────
    getDashboardStats: async () => {
        const response = await adminApi.get('/dashboard-stats');
        return response.data.data;
    },

    getTopListings: async () => {
        const response = await adminApi.get('/topListings');
        return response.data.data || [];
    },

    confirmPayment: (paymentId) =>
        adminApi.put(`/payments/${paymentId}/confirm`),

    rejectPayment: (paymentId, note) =>
        adminApi.put(`/payments/${paymentId}/reject`, null, { params: { note } }),
};

export default adminService;