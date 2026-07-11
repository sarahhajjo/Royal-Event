import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService.js";
// 👑 التعديل هنا: استيراد ملف freelancerOfferService

// إنشاء الـ Async Thunk
export const createService = createAsyncThunk(
    'freelancerOffer/createService', // يمكنك تغيير الاسم ليتناسب مع الملف
    async (serviceData, thunkAPI) => {
        try {
            // 👑 التعديل هنا: استخدام الخدمة الجديدة
            return await freelancerOfferService.createListing(serviceData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const servicesSlice = createSlice({
    name: 'freelancerOffer', // تعديل الاسم هنا أيضاً ليتوافق
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
            });
    },
});

export const { reset } = servicesSlice.actions;
export default servicesSlice.reducer;