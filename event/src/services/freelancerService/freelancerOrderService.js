import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// جلب حجوزات الفريلانسر
const getProviderBookings = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(API_URL + "provider/bookings", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
};
const getListingImages = async (listingId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}listings/${listingId}/images`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`فشل جلب صور الخدمة ${listingId}`, error);
        return []; // في حال فشل الجلب نرجع مصفوفة فارغة كي لا يتوقف الموقع
    }
};

// قبول الحجز
const acceptBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    // ملاحظة: استخدمت PUT، إذا كان الباك إند يستخدم POST بدليها لـ axios.post
    const response = await axios.put(`${API_URL}bookings/${bookingId}/accept`, {}, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
};

// رفض الحجز
const rejectBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}bookings/${bookingId}/reject`, {}, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
};

const getBookingDetails = async (bookingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}book/${bookingId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
};

// لا تنسي إضافتها داخل الكائن المصدر:
const freelancerOrderService = {
    getProviderBookings,
    getListingImages,
    acceptBooking,
    rejectBooking,
    getBookingDetails // 🔥 أضيفيها هنا
};

export default freelancerOrderService;