import api from '../api'; // 👈 تأكدي من مسار ملف الـ interceptor

// ── Job Offers Service ────────────────────────────────────────────────────────

/**
 * إنشاء عرض عمل جديد (مطابق للبوستمان)
 */
export const createJobOfferService = async (payload) => {
    const response = await api.post('http://127.0.0.1:8000/api/job-offers', payload);
    return response.data;
};