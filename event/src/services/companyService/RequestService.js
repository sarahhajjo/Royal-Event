import axios from 'axios';

const GET_API_URL = 'http://127.0.0.1:8000/api/provider/bookings';
const ACTION_API_URL = 'http://127.0.0.1:8000/api/bookings';

const RequestService = {
    getAll: async () => {
        const token = localStorage.getItem('token');
        return axios.get(GET_API_URL, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
    },

    getById: async (id) => {
        const token = localStorage.getItem('token');
        return axios.get(`${GET_API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
    },

    // 💡 تم إضافة reason وإرساله كـ cancellation_reason
    updateStatus: async (id, status, reason = null) => {
        const token = localStorage.getItem('token');

        let endpointAction = status;
        if (status === 'waiting' || status === 'accepted') endpointAction = 'accept';
        if (status === 'rejected') endpointAction = 'reject';
        if (status === 'completed') endpointAction = 'complete';
        if (status === 'cancelled') endpointAction = 'cancel';

        // تجهيز البيانات لإرسالها
        const payload = reason ? { cancellation_reason: reason } : {};

        return axios.put(`${ACTION_API_URL}/${id}/${endpointAction}`, payload, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
    },
};

export default RequestService;