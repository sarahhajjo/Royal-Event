import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService.js";

// 1. إنشاء الخدمة (Create)
export const createService = createAsyncThunk(
    'freelancerOffer/createService',
    async (serviceData, thunkAPI) => {
        try {
            return await freelancerOfferService.createListing(serviceData);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 👑 2. تحديث الخدمة (Update) - (جديد)
export const updateService = createAsyncThunk(
    'freelancerOffer/updateService',
    async ({ id, payload }, thunkAPI) => {
        try {
            // نمرر الـ ID والبيانات لخدمة التحديث
            return await freelancerOfferService.updateListing(id, payload);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// 👑 3. حذف الخدمة (Delete) - (جديد)
export const deleteService = createAsyncThunk(
    'freelancerOffer/deleteService',
    async (id, thunkAPI) => {
        try {
            await freelancerOfferService.deleteListing(id);
            return id; // نعيد الـ ID لنتمكن من حذفه من الـ State إذا لزم الأمر
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const servicesSlice = createSlice({
    name: 'freelancerOffer',
    initialState: {
        listing: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // ------ حالات الإنشاء (Create) ------
            .addCase(createService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listing = action.payload;
            })
            .addCase(createService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // 👑 ------ حالات التحديث (Update) ------
            .addCase(updateService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listing = action.payload; // تحديث بيانات الخدمة في الـ state
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // 👑 ------ حالات الحذف (Delete) ------
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.listing = null; // تفريغ الخدمة بعد حذفها
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = servicesSlice.actions;
export default servicesSlice.reducer;