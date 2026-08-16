import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const myCatalogService = {
    getMyProducts: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/provider/my-products`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    },

    getMyServices: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/listings/provider/my-services`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    },

    getMyArrangements: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/arrangements/provider/my-arrangements`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    },

    getProviderBookings: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/provider/bookings`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    },

    // 💡 إضافة دالة جلب الفريلانسرز هنا
    getCompanyFreelancers: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/company/applicants`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    },
    deleteCatalogItem: async (id) => {
        const token = localStorage.getItem('token');
        // 💡 استخدام الرابط الموحد لكل المعروضات (منتج، صالة، تنسيق)
        const response = await axios.delete(`${API_URL}/listings/${id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data;
    }
};

export default myCatalogService;