import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const getProviderProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/provider/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// 💡 إضافة دالة جلب الإشعارات (تعمل للشركة والفريلانسر معاً)
const getNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // سيرجع كائن يحتوي على { data: [...] } بسبب الـ pagination
};

const providerService = {
    getProviderProfile,
    getNotifications, // تصدير الدالة الجديدة
};

export default providerService;