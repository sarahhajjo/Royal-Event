import api from '../api'; // 💡 الاعتماد على api المركزي

const RequestService = {
    getAll: async () => {
        return api.get(`/provider/bookings`);
    },

    getById: async (id) => {
        return api.get(`/provider/bookings/${id}`);
    },

    updateStatus: async (id, status, reason = null) => {
        let endpointAction = status;
        if (status === 'waiting' || status === 'accepted') endpointAction = 'accept';
        if (status === 'rejected') endpointAction = 'reject';
        if (status === 'completed') endpointAction = 'complete';
        if (status === 'cancelled') endpointAction = 'cancel';

        const payload = reason ? { cancellation_reason: reason } : {};

        return api.put(`/bookings/${id}/${endpointAction}`, payload);
    },

    getListingDetails: async (listingId) => {
        return api.get(`/listings/${listingId}`);
    },

    getPaymentReceipt: async (paymentId) => {
        // 💡 استخدام api المركزي لضمان مرور رأسية التوكن والـ ngrok، مع تحديد نوع الرد كـ blob
        return api.get(`/admin/payments/${paymentId}/view`, {
            responseType: 'blob'
        });
    },
};

export default RequestService;