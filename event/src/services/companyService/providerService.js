import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const getProviderProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/provider/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const getNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// 💡 1. جلب خدمات الشركة
const getCompanyServicesData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    return response.data; // بناءً على البوستمان، يرجع مصفوفة مباشرة
};

// 💡 2. إضافة خدمة جديدة
const addCompanyService = async (data) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/services`, data, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    return response.data;
};

// 💡 3. تعديل خدمة
const updateCompanyService = async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/services/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    return response.data;
};

// 💡 4. حذف خدمة
const deleteCompanyService = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    return response.data;
};
const uploadCompanyQrCode = async (file) => {
    const token = localStorage.getItem('token');

    // يجب استخدام FormData لأننا نرسل ملف (صورة)
    const formData = new FormData();
    formData.append('qr_image', file); // نفس الاسم الموجود في Postman

    const response = await axios.post(`${API_URL}/provider/upload-qr`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // ضروري جداً للملفات
        }
    });
    return response.data;
};
const providerService = {
    getProviderProfile,
    getNotifications,
    getCompanyServicesData,
    addCompanyService,
    updateCompanyService,
    deleteCompanyService,
    uploadCompanyQrCode // 💡 لا تنسي تصديرها هنا
};

export default providerService;