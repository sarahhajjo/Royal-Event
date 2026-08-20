import freelancerApi from './FreelancerApi'; // 👈 استيراد الكلاس المستقل

// رفع الصورة للحصول على الاسم المؤقت
const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    // نحدد Content-Type لتكون multipart/form-data، بينما التوكن سيتم إضافته تلقائياً من الكلاس
    const response = await freelancerApi.post('/uploads/temp', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

// إنشاء الخدمة
const createListing = async (serviceData) => {
    const response = await freelancerApi.post('/listings', serviceData);
    return response.data;
};

// حذف الخدمة
const deleteListing = async (listingId) => {
    const response = await freelancerApi.delete(`/listings/${listingId}`);
    return response.data;
};

// جلب التصنيفات
const getCategories = async () => {
    const response = await freelancerApi.get('/categories');
    const res = response.data;
    if (Array.isArray(res)) return res;
    return res.data || res.categories || [];
};
const updateListing = async (listingId, serviceData) => {
    const response = await freelancerApi.put(`/listings/${listingId}`, serviceData);
    return response.data;
};

// جلب المناطق/الأحياء
const getDistricts = async () => {
    const response = await freelancerApi.get('/districts');
    const res = response.data;
    if (Array.isArray(res)) return res;
    return res.data || res.districts || [];
};

// جلب خدمة محددة بالمعرف
const getListingById = async (listingId) => {
    const response = await freelancerApi.get(`/listings/${listingId}`);
    return response.data.data || response.data;
};

const freelancerOfferService = {
    createListing,
    uploadImage,
    getCategories,
    getDistricts,
    getListingById,
    deleteListing,
    updateListing
};

export default freelancerOfferService;