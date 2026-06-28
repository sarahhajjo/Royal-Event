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

    // 💡 الدالة الجديدة لجلب التنسيقات (Packages)
    getMyArrangements: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/arrangements/provider/my-arrangements`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        return response.data.data;
    }
};

export default myCatalogService;