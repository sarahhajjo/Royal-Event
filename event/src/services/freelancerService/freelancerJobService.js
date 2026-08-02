import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// دالة جلب الوظائف المتاحة
const getJobOffers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL + "job-offers", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    // إعادة مصفوفة البيانات (حسب شكل الاستجابة من الباك إند)
    return response.data.data || response.data;
};


const getJobOfferById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}job-offers/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data.data; // نرجع الـ data مباشرة
};
const applyForJob = async (id) => {
    const token = localStorage.getItem("token");
    // نرسل POST request، ونرسل كائن فارغ {} كبيانات إذا كان الباك إند لا يطلب بيانات إضافية في الـ body
    const response = await axios.post(`${API_URL}job-offers/${id}/apply`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
const getMyAppliedJobs = async () => {
    // 1. جلب التوكن يدوياً بدلاً من استخدام authHeaders غير المعرفة
    const token = localStorage.getItem("token");

    // 2. إرسال الطلب (تأكدي أن الرابط هنا يطابق الرابط المخصص لجلب وظائف الفريلانسر في الباك إند)
    const response = await axios.get(`${API_URL}my-applied-jobs`, {
        headers: {
            Authorization: `Bearer ${token}` // 👈 إرسال التوكن بهذا الشكل
        }
    });

    // 3. إرجاع البيانات
    return response.data.data;
};
const freelancerJobService = {
    getJobOffers,
    getJobOfferById,
    applyForJob,
    getMyAppliedJobs,
};

export default freelancerJobService;