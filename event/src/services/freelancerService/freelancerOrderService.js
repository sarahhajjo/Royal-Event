import freelancerApi from './FreelancerApi'; // 👈 استيراد الكلاس المستقل

// جلب حجوزات الفريلانسر
const getProviderBookings = async () => {
    const response = await freelancerApi.get('/provider/bookings');
    return response.data;
};

// جلب صور الخدمة مع معالجة الأخطاء
const getListingImages = async (listingId) => {
    try {
        const response = await freelancerApi.get(`/listings/${listingId}/images`);
        return response.data;
    } catch (error) {
        console.error(`فشل جلب صور الخدمة ${listingId}`, error);
        return []; // في حال فشل الجلب نرجع مصفوفة فارغة كي لا يتوقف الموقع
    }
};

// قبول الحجز
const acceptBooking = async (bookingId) => {
    const response = await freelancerApi.put(`/bookings/${bookingId}/accept`, {});
    return response.data;
};

// رفض الحجز
const rejectBooking = async (bookingId) => {
    const response = await freelancerApi.put(`/bookings/${bookingId}/reject`, {});
    return response.data;
};

// جلب تفاصيل الحجز
const getBookingDetails = async (bookingId) => {
    const response = await freelancerApi.get(`/book/${bookingId}`);
    return response.data;
};

const getProviderWallet = async () => {
    const response = await freelancerApi.get('/provider/wallet');
    return response.data.data || response.data;
};
const freelancerOrderService = {
    getProviderBookings,
    getListingImages,
    acceptBooking,
    rejectBooking,
    getBookingDetails,
    getProviderWallet
};

export default freelancerOrderService;