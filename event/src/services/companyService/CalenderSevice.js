import api from '../api'; // تأكدي من مسار الاستيراد الخاص بملف api لديكِ

// جلب الأيام المغلقة
export const fetchBlockedDatesService = async () => {
    const response = await api.get('/company/blocked-dates');
    return response.data;
};

// إضافة يوم/أوقات مغلقة
export const blockDateService = async (payload) => {
    const response = await api.post('/company/blocked-dates', payload);
    return response.data;
};

// حذف يوم مغلق (للاستخدام المستقبلي إذا أردتي إضافتها بالواجهة)
export const deleteBlockedDateService = async (id) => {
    const response = await api.delete(`/company/blocked-dates/${id}`);
    return response.data;
};