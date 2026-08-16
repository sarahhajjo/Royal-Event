import api from '../api'; // تأكدي من مسار الاستيراد الخاص بملف api لديكِ

// جلب الأيام المغلقة للفريلانسر
export const fetchBlockedDatesService = async () => {
    const response = await api.get('/freelancer/blocked-dates');
    return response.data;
};

// إضافة يوم/أوقات مغلقة للفريلانسر
export const blockDateService = async (payload) => {
    const response = await api.post('/freelancer/blocked-dates', payload);
    return response.data;
};

// حذف يوم مغلق للفريلانسر
export const deleteBlockedDateService = async (id) => {
    const response = await api.delete(`/freelancer/blocked-dates/${id}`);
    return response.data;
};