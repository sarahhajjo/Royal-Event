import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBlockedDatesService, blockDateService, deleteBlockedDateService } from '../../../services/companyService/CalenderSevice';

// Thunk لجلب الأيام
export const fetchBlockedDates = createAsyncThunk(
    'myCalendar/fetchBlockedDates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchBlockedDatesService();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load blocked dates');
        }
    }
);

// Thunk لإضافة الأيام المغلقة
export const blockDate = createAsyncThunk(
    'myCalendar/blockDate',
    async (payload, { rejectWithValue }) => {
        try {
            if (payload.isAllDay || payload.shifts.length === 0) {
                const data = {
                    dates: [payload.date],
                    note: payload.note,
                    start_time: null,
                    end_time: null
                };
                const res = await blockDateService(data);
                return res;
            } else {
                const promises = payload.shifts.map(shift => {
                    const data = {
                        dates: [payload.date],
                        note: payload.note,
                        start_time: shift.start,
                        end_time: shift.end
                    };
                    return blockDateService(data);
                });

                const results = await Promise.all(promises);
                return results.flat();
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to block date');
        }
    }
);

// 💡 Thunk جديد لحذف حجز/يوم مغلق
export const deleteBlockedDate = createAsyncThunk(
    'myCalendar/deleteBlockedDate',
    async (id, { rejectWithValue }) => {
        try {
            await deleteBlockedDateService(id);
            return id; // نعيد الـ id لنقوم بمسحه من الـ State
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete blocked date');
        }
    }
);

const myCalendarSlice = createSlice({
    name: 'myCalendar',
    initialState: {
        blockedDates: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Dates
            .addCase(fetchBlockedDates.pending, (state) => { state.loading = true; })
            .addCase(fetchBlockedDates.fulfilled, (state, action) => {
                state.loading = false;
                state.blockedDates = action.payload;
            })
            .addCase(fetchBlockedDates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Block Date
            .addCase(blockDate.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
            .addCase(blockDate.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Time blocked successfully!';
                state.blockedDates = [...state.blockedDates, ...action.payload];
            })
            .addCase(blockDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 💡 Delete Blocked Date (الحالات الجديدة للحذف)
            .addCase(deleteBlockedDate.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
            .addCase(deleteBlockedDate.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Time block removed successfully!';
                // نقوم بفلترة المصفوفة لإزالة العنصر المحذوف بناءً على الـ ID
                state.blockedDates = state.blockedDates.filter(b => b.id !== action.payload);
            })
            .addCase(deleteBlockedDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearMessages } = myCalendarSlice.actions;
export default myCalendarSlice.reducer;