import api from '../api';

// ── Job Offers Service ────────────────────────────────────────────────────────

export const createJobOfferService = async (payload) => {
    const response = await api.post('http://127.0.0.1:8000/api/job-offers', payload);
    return response.data;
};

// دالة جديدة لجلب الخدمات المرتبطة بالشركة الحالية
export const getCompanyServicesForJob = async () => {
    const response = await api.get('http://127.0.0.1:8000/api/services');
    return response.data;
};

export const fetchJobApplicantsService = async () => {
    // الرابط الذي ناقشناه لجلب كل الوظائف والمتقدمين
    const response = await api.get('http://127.0.0.1:8000/api/company/applicants');
    return response.data;
};

export const fetchCompanyContractsService = async (page = 1) => {
    // نجلب الموظفين المقبولين فقط (status=active) مع دعم الصفحات
    const response = await api.get(`/company/contracts?status=active&per_page=15&page=${page}`);
    return response.data;
};

// 💡 الدالة المحدثة بعد تصحيح الرابط والـ Method والـ Body
export const acceptApplicationService = async (applicationId) => {
    // استخدمنا PUT بدلاً من POST
    // أضفنا الرابط الصحيح مع تمرير الـ ID
    // أرسلنا الـ Body المطلوب: { status: 'active' }
    const response = await api.put(`http://127.0.0.1:8000/api/contracts/${applicationId}/status`, {
        status: 'active'
    });
    return response.data;
};
// 💡 دالة تفعيل/تعطيل عرض العمل
export const toggleJobActiveService = async (jobId) => {
    // بناءً على صورتك، الرابط يستخدم PATCH
    const response = await api.patch(`http://127.0.0.1:8000/api/job-offers/${jobId}/toggle-active`);
    return response.data;
};