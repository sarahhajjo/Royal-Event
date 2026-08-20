import api from '../api';

// ── Job Offers Service ────────────────────────────────────────────────────────

export const createJobOfferService = async (payload) => {
    // 💡 تم حذف http://127.0.0.1:8000/api من جميع الطلبات
    const response = await api.post('/job-offers', payload);
    return response.data;
};

export const getCompanyServicesForJob = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const fetchJobApplicantsService = async () => {
    const response = await api.get('/company/applicants');
    return response.data;
};

export const fetchCompanyContractsService = async (page = 1) => {
    const response = await api.get(`/company/contracts?status=active&per_page=15&page=${page}`);
    return response.data;
};

export const acceptApplicationService = async (applicationId) => {
    const response = await api.put(`/contracts/${applicationId}/status`, {
        status: 'active'
    });
    return response.data;
};

export const toggleJobActiveService = async (jobId) => {
    const response = await api.patch(`/job-offers/${jobId}/toggle-active`);
    return response.data;
};

export const fetchFreelancerBlockedDatesService = async (freelancerId) => {
    const response = await api.get(`/freelancers/${freelancerId}/blocked-dates`);
    return response.data;
};