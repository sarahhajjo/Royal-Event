import api from '../api'; // 💡 الاعتماد على api المركزي بدلاً من axios الخام

const getProviderProfile = async () => {
    const response = await api.get(`/provider/profile`);
    return response.data;
};

const updateProviderProfile = async (data) => {
    const response = await api.put(`/provider/profile`, data);
    return response.data;
};

const getNotifications = async () => {
    const response = await api.get(`/notifications`);
    return response.data;
};

const getCompanyServicesData = async () => {
    const response = await api.get(`/services`);
    return response.data;
};

const addCompanyService = async (data) => {
    const response = await api.post(`/services`, data);
    return response.data;
};

const updateCompanyService = async (id, data) => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
};

const deleteCompanyService = async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
};

const uploadCompanyQrCode = async (file) => {
    const formData = new FormData();
    formData.append('qr_image', file);

    const response = await api.post(`/provider/upload-qr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const getCompanyQrCode = async () => {
    const response = await api.get(`/provider/qr`);
    return response.data;
};

const providerService = {
    getProviderProfile,
    updateProviderProfile,
    getNotifications,
    getCompanyServicesData,
    addCompanyService,
    updateCompanyService,
    deleteCompanyService,
    uploadCompanyQrCode,
    getCompanyQrCode
};

export default providerService;