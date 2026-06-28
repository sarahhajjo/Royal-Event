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

// 💡 [جديد] الدالة المسؤولة عن إرسال التنسيق الجاهز
const createArrangement = async (arrangementData) => {
    const response = await api.post(`/arrangements`, arrangementData);
    return response.data;
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
    createArrangement // 👈 لا تنسي التصدير
};
export default additionService;