import api from '../api'; // 👈 استيراد المعترض المركزي من المجلد السابق

const getCategories = async () => {
    const response = await api.get(`/categories`);
    return response.data.data;
};

const getDistricts = async () => {
    const response = await api.get(`/districts`);
    return response.data.data;
};

const createListing = async (listingData) => {
    // التوكن والهيدرز تضاف تلقائياً الآن!
    const response = await api.post(`/listings`, listingData);
    return response.data;
};

const createHall = async (hallData) => {
    const response = await api.post(`/listings`, hallData);
    return response.data;
};

const getMyListings = async () => {
    const response = await api.get(`/listings`);
    console.log("البيانات الخام من السيرفر:", response.data.data);
    return response.data.data;
};

const uploadTempImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // نغير الـ Content-Type هنا فقط لكي ندعم رفع الصور
    const response = await api.post(`/uploads/temp`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const additionService = { getCategories, getDistricts, createListing, createHall, getMyListings, uploadTempImage };
export default additionService;