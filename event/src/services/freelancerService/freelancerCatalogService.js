import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/listings";

const getMyListings = async () => {
    // نجلب التوكن من الـ localStorage (أو أي مكان تخزنين فيه التوكن)
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || response.data;
};
const getListingImages = async (listingId) => {
    const token = localStorage.getItem("token");
    // المسار المطلوب: http://127.0.0.1:8000/api/listings/{id}/images
    const response = await axios.get(`${API_URL}/${listingId}/images`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    // نفترض أن الباك إند يعيد مصفوفة الصور مباشرة أو داخل مفتاح data
    return response.data.data || response.data;
};

const freelancerCatalogService = {
    getMyListings,
    getListingImages // لا تنسي تصدير التابع الجديد هنا
};

export default freelancerCatalogService;