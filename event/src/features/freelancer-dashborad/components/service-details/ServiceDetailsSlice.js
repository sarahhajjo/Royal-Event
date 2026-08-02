import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// تأكدي من مسار ملف السيرفيس لديك
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService";

// دالة الـ Thunk لجلب البيانات
export const fetchServiceDetails = createAsyncThunk(
    "serviceDetails/fetchById",
    async (serviceId, thunkAPI) => {
        try {
            return await freelancerOfferService.getListingById(serviceId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "حدث خطأ أثناء جلب التفاصيل"
            );
        }
    }
);

const ServiceDetailsSlice = createSlice({
    name: "serviceDetails",
    initialState: {
        serviceData: null,
        isLoading: true,
        error: null,
    },
    reducers: {
        // دالة لتنظيف البيانات القديمة عند الخروج من الصفحة
        clearServiceDetails: (state) => {
            state.serviceData = null;
            state.error = null;
            state.isLoading = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServiceDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServiceDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.serviceData = action.payload; // تخزين البيانات القادمة من الباك إند
            })
            .addCase(fetchServiceDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearServiceDetails } = ServiceDetailsSlice.actions;
export default ServiceDetailsSlice.reducer;