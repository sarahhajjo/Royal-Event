import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// رفع الصورة للحصول على الاسم
const uploadImage = async (file) => {
    // 👑 يجب تعريف الـ token هنا لجلبها من الـ localStorage
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(API_URL + "uploads/temp", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    });

    // 👑 تأكدي من اسم المفتاح في الـ Response (هل هو image أم temp_path؟)
    // بناءً على آخر رسالة أرسلتِها، الـ API يعيد temp_path و path
    return response.data;
};

// إنشاء الخدمة
const createListing = async (serviceData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL + "listings", serviceData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
const deleteListing = async (listingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}listings/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
const getCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL + "categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    // استخراج المصفوفة بشكل صحيح ومضمون
    const res = response.data;
    if (Array.isArray(res)) return res;
    return res.data || res.categories || [];
};

const getDistricts = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL + "districts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    // استخراج المصفوفة بشكل صحيح ومضمون
    const res = response.data;
    if (Array.isArray(res)) return res;
    return res.data || res.districts || [];
};
const getListingById = async (listingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}listings/${listingId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    // إعادة البيانات الصافية
    return response.data.data || response.data;
};

const freelancerOfferService = {
    createListing,
    uploadImage,
    getCategories,
    getDistricts,
    getListingById,
    deleteListing
};

export default freelancerOfferService;