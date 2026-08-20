// استبدلي المسار حسب مكان ملف الـ FreelancerApi بالنسبة لهذا الملف
import freelancerApi from './FreelancerApi';

// جلب الأيام المغلقة للفريلانسر
export const fetchBlockedDatesService = async () => {
    const response = await freelancerApi.get('/freelancer/blocked-dates');
    return response.data;
};

// إضافة يوم/أوقات مغلقة للفريلانسر
export const blockDateService = async (payload) => {
    const response = await freelancerApi.post('/freelancer/blocked-dates', payload);
    return response.data;
};

// حذف يوم مغلق للفريلانسر
export const deleteBlockedDateService = async (id) => {
    const response = await freelancerApi.delete(`/freelancer/blocked-dates/${id}`);
    return response.data;
};