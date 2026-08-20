import freelancerApi from './FreelancerApi';

const getMyListings = async () => {
    const response = await freelancerApi.get('/listings/provider/my-services');
    return response.data.data || response.data;
};

const getListingImages = async (listingId) => {
    const response = await freelancerApi.get(`/listings/${listingId}/images`);
    return response.data.data || response.data;
};

// 👑 التابع الجديد لجلب مراجعات المزود حسب الـ ID الخاص به
const getProviderReviews = async (providerId) => {
    const response = await freelancerApi.get(`/providers/${providerId}/reviews`);
    return response.data; // نرجع البيانات كاملة لنتعامل مع الـ Pagination
};

const freelancerCatalogService = {
    getMyListings,
    getListingImages,
    getProviderReviews // 👈 قمنا بتصدير التابع الجديد
};

export default freelancerCatalogService;