import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import RequestService from '../../../services/companyService/RequestService';

export const STATUS_TABS = ['pending', 'accepted', 'confirmed', 'completed', 'cancelled', 'rejected'];

export const fetchRequests = createAsyncThunk(
    'requests/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            const res = await RequestService.getAll();
            const rawData = res.data.data || [];

            return rawData.map(booking => ({
                id: booking.id,
                status: booking.status,
                orderId: booking.id.substring(0, 8).toUpperCase(),
                timeAgo: booking.created_at_human || '',
                customerName: booking.customer?.name || 'Unknown Client',
                phone: booking.customer?.phone || 'No phone',
                email: booking.customer?.email || '',
                avatarUrl: null,
                date: booking.booked_date || 'Flexible Date',
                booked_date: booking.booked_date,
                shift: booking.day_schedule?.shifts?.[0] || null,
                eventType: booking.listing?.title || 'Booking',
                offerLabel: 'Total Price',
                offerValue: `${parseFloat(booking.price || 0).toLocaleString()} ${booking.currency || 'SYP'}`,

                listing: booking.listing,

                // 💡 [السر هنا] يجب تمرير هذين الحقلين لكي يراهم الكرت ويعرض المنتجات والفاتورة
                variant: booking.variant,
                payment_id: booking.payment_id,

                quantity: booking.quantity,
                total_price: booking.price,
                currency: booking.currency || 'SYP'
            }));
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const updateRequestStatus = createAsyncThunk(
    'requests/updateRequestStatus',
    async ({ id, status, reason }, { rejectWithValue }) => {
        try {
            await RequestService.updateStatus(id, status, reason);
            return { id, status, reason };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchListingDetails = createAsyncThunk(
    'requests/fetchListingDetails',
    async (listingId, { rejectWithValue, getState }) => {
        const state = getState().requests;
        if (state.listingsCache && state.listingsCache[listingId]) {
            return { id: listingId, data: state.listingsCache[listingId], cached: true };
        }
        try {
            const res = await RequestService.getListingDetails(listingId);
            return { id: listingId, data: res.data?.data || res.data, cached: false };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const fetchPaymentReceipt = createAsyncThunk(
    'requests/fetchPaymentReceipt',
    async (paymentId, { rejectWithValue, getState }) => {
        const state = getState().requests;
        if (state.receiptsCache && state.receiptsCache[paymentId]) {
            return { id: paymentId, data: state.receiptsCache[paymentId], cached: true };
        }
        try {
            const res = await RequestService.getPaymentReceipt(paymentId);
            const imageUrl = URL.createObjectURL(res.data);

            // 💡 السر هنا: نكتشف نوع الملف مباشرة من الاستجابة
            const isPdf = res.data.type === 'application/pdf';

            // نخزن الرابط مع نوعه
            return { id: paymentId, data: { url: imageUrl, isPdf: isPdf }, cached: false };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        activeTab: 'pending',
        items: [],
        listingsCache: {},
        receiptsCache: {},
        status: 'idle',
        error: null,
    },
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(fetchRequests.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
            .addCase(fetchRequests.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                const { id, status, reason } = action.payload;
                const item = state.items.find((r) => r.id === id);
                if (item) {
                    item.status = status;
                    if (reason) item.reason = reason;
                }
            })
            .addCase(fetchListingDetails.fulfilled, (state, action) => {
                if (!action.payload.cached) {
                    state.listingsCache[action.payload.id] = action.payload.data;
                }
            })
            .addCase(fetchPaymentReceipt.fulfilled, (state, action) => {
                if (!action.payload.cached) {
                    state.receiptsCache[action.payload.id] = action.payload.data; // 💡 نمرر الداتا كاملة
                }
            });
    },
});

export const { setActiveTab } = requestSlice.actions;

export const selectActiveTab = (state) => state.requests.activeTab;
export const selectAllRequests = (state) => state.requests.items;
export const selectRequestsLoadingStatus = (state) => state.requests.status;
export const selectRequestsError = (state) => state.requests.error;

export const selectListingDetailsById = (state, listingId) => state.requests.listingsCache[listingId];
export const selectReceiptById = (state, paymentId) => state.requests.receiptsCache[paymentId];

export const selectFilteredRequests = createSelector(
    [selectAllRequests, selectActiveTab],
    (items, activeTab) => items.filter((r) => r.status === activeTab)
);

export default requestSlice.reducer;