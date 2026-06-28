
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/admin';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
    }
});

export const adminService = {

    // ✅ استخدام الـ endpoint المباشر بدل جلب الكل وفلترة
    getProviderById: async (id) => {
        const response = await axios.get(`${API_URL}/providers/${id}`, getAuthHeaders());
        // الـ API يرجع { status: "success", data: { id, name, brand_name, ... } }
        return response.data.data;
    },

    approveProvider: (id) =>
        axios.put(`${API_URL}/providers/${id}/approve`, {}, getAuthHeaders()),

    rejectProvider: (id, reason) =>
        axios.put(`${API_URL}/providers/${id}/reject`, { rejection_reason: reason }, getAuthHeaders()),

    approveListing: (id) =>
        axios.put(`${API_URL}/listings/${id}/approve`, {}, getAuthHeaders()),

    rejectListing: (id, reason) =>
        axios.put(`${API_URL}/listings/${id}/reject`, { rejection_reason: reason }, getAuthHeaders()),

    approveFreelancer: (id) =>
        axios.put(`${API_URL}/freelancers/${id}/approve`, {}, getAuthHeaders()),

    rejectFreelancer: (id, reason) =>
        axios.put(`${API_URL}/freelancers/${id}/reject`, { rejection_reason: reason }, getAuthHeaders()),
};