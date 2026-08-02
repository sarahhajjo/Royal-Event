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

const getCategories = async () => {
    const response = await axios.get(API_URL + "categories");
    return response.data.data || response.data;
};

const getDistricts = async () => {
    const response = await axios.get(API_URL + "districts");
    return response.data.data || response.data;
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
    getListingById
};

export default freelancerOfferService;