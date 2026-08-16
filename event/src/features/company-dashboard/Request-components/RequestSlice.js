import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import RequestService from '../../../services/companyService/RequestService';

// 💡 تحديث التبويبات لتطابق تماماً الـ Enum الموجود في الـ Migration
export const STATUS_TABS = ['pending', 'accepted', 'confirmed', 'completed', 'cancelled', 'rejected'];

export const fetchRequests = createAsyncThunk(
    'requests/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            const res = await RequestService.getAll();
            const rawData = res.data.data || [];

            return rawData.map(booking => ({
                id: booking.id,
                status: booking.status, // pending, accepted, confirmed, completed, cancelled, rejected
                orderId: booking.id.substring(0, 8).toUpperCase(),
                timeAgo: booking.created_at_human || '',
                customerName: booking.customer?.name || 'Unknown Client',
                phone: booking.customer?.phone || 'No phone',
                avatarUrl: null,
                date: booking.booked_date || 'Flexible Date',

                // 💡 [الحل هنا] تمرير حقلي التاريخ والشفت لكي يتعرف عليهما RequestCard
                booked_date: booking.booked_date,
                shift: booking.shift,

                eventType: booking.listing?.title?.ar || booking.listing?.title?.en || 'Booking',
                offerLabel: 'Total Price',
                // 💡 دعم total_price القادم من الـ Migration أو price من الريسبونس
                offerValue: `${parseFloat(booking.total_price || booking.price || 0).toLocaleString()} ${booking.currency || 'SYP'}`,
                listing: booking.listing,
            }));
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
export const updateRequestStatus = createAsyncThunk(
    'requests/updateRequestStatus',
    // 💡 أضفنا reason هنا
    async ({ id, status, reason }, { rejectWithValue }) => {
        try {
            await RequestService.updateStatus(id, status, reason);
            return { id, status, reason };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        activeTab: 'pending',
        items: [],
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
            .addCase(fetchRequests.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                const { id, status, reason } = action.payload;
                const item = state.items.find((r) => r.id === id);
                if (item) {
                    item.status = status;
                    if (reason) item.reason = reason; // 💡 تحديث السبب محلياً ليظهر مباشرة
                }
            });
    },
});

export const { setActiveTab } = requestSlice.actions;

export const selectActiveTab = (state) => state.requests.activeTab;
export const selectAllRequests = (state) => state.requests.items;
export const selectRequestsLoadingStatus = (state) => state.requests.status;
export const selectRequestsError = (state) => state.requests.error;

export const selectFilteredRequests = createSelector(
    [selectAllRequests, selectActiveTab],
    (items, activeTab) => items.filter((r) => r.status === activeTab)
);

export default requestSlice.reducer;