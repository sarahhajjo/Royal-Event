import api from '../api'; // 💡 نستخدم النسخة المجهزة بدلاً من axios الخام

const myCatalogService = {
    getMyProducts: async () => {
        const response = await api.get(`/provider/my-products`);
        return response.data.data;
    },

    getMyServices: async () => {
        const response = await api.get(`/listings/provider/my-services`);
        return response.data.data;
    },

    getMyArrangements: async () => {
        const response = await api.get(`/arrangements/provider/my-arrangements`);
        return response.data.data;
    },

    getProviderBookings: async () => {
        const response = await api.get(`/provider/bookings`);
        return response.data.data;
    },

    getCompanyFreelancers: async () => {
        const response = await api.get(`/company/applicants`);
        return response.data.data;
    },

    deleteCatalogItem: async (id) => {
        const response = await api.delete(`/listings/${id}`);
        return response.data;
    }
};

export default myCatalogService;