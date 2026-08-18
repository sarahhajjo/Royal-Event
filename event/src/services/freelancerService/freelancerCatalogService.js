import axios from "axios";

// الأساسي للـ API العام
const BASE_URL = "http://127.0.0.1:8000/api/";

const getMyListings = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(BASE_URL + "listings/provider/my-services", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || response.data;
};

const getListingImages = async (listingId) => {
    const token = localStorage.getItem("token");
    // 👑 التصحيح هنا: استخدام الرابط الصحيح المتطابق مع لارافيل listings/{id}/images
    const response = await axios.get(`${BASE_URL}listings/${listingId}/images`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || response.data;
};

const freelancerCatalogService = {
    getMyListings,
    getListingImages
};

export default freelancerCatalogService;