import api from '../api';

const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data.data;
};

const getDistricts = async () => {
    const response = await api.get(`/districts`);
    return response.data.data;
};

const createListing = async (listingData) => {
    const response = await api.post(`/listings`, listingData);
    return response.data;
};

const createHall = async (hallData) => {
    const response = await api.post(`/listings`, hallData);
    return response.data;
};

const getMyListings = async () => {
    const response = await api.get(`/listings`);
    return response.data.data;
};

const uploadTempImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/uploads/temp`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const getMyProducts = async () => {
    const response = await api.get(`/provider/my-products`);
    return response.data.data;
};

const getListingById = async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data.data;
};

const createArrangement = async (arrangementData) => {
    const response = await api.post(`/arrangements`, arrangementData);
    return response.data;
};

// 💡 [تمت الإضافة] دالة التعديل (PUT) الخاصة بالتنسيقات
const updateArrangement = async (id, arrangementData) => {
    const response = await api.put(`/arrangements/${id}`, arrangementData);
    return response.data;
};

const updateListing = async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
};

const getCompanyFreelancers = async () => {
    // 💡 استخدام رابط العقود مع فلتر active وجلب عدد كبير لتجنب مشاكل الصفحات
    const response = await api.get(`/company/contracts?status=active&per_page=100`);

    // 💡 بما أن لارافيل يستخدم paginate، الداتا الفعلية تكون داخل data.data
    return response.data?.data?.data || response.data?.data || [];
};

const additionService = {
    getCategories,
    getDistricts,
    createListing,
    createHall,
    getMyListings,
    uploadTempImage,
    getMyProducts,
    getListingById,
    createArrangement,
    updateArrangement, // 👈 تم تصدير الدالة هنا
    updateListing,
    getCompanyFreelancers
};

export default additionService;