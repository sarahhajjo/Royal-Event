import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService";
// 👑 تم إزالة axios بالكامل

// دالة الـ Thunk لجلب بيانات واجهة التفاصيل
export const fetchServiceDetails = createAsyncThunk(
    "serviceDetails/fetchById",
    async (serviceId, thunkAPI) => {
        try {
            const response = await freelancerOfferService.getListingById(serviceId);
            return response.data !== undefined ? response.data : response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "حدث خطأ أثناء جلب التفاصيل"
            );
        }
    }
);

// 👑 دالة الـ Thunk لجلب بيانات واجهة التعديل (تم تنظيفها لتستخدم الخدمة)
export const fetchServiceForEdit = createAsyncThunk(
    'services/fetchForEdit',
    async (id, { rejectWithValue }) => {
        try {
            // نستخدم الخدمة الموحدة بدلاً من الرابط المباشر والتوكن اليدوي
            const response = await freelancerOfferService.getListingById(id);
            return response.data !== undefined ? response.data : response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل جلب بيانات الخدمة");
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
                state.serviceData = action.payload.data ? action.payload.data : action.payload;
            })
            .addCase(fetchServiceDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // -----------------------------------------------------
            .addCase(fetchServiceForEdit.pending, (state) => {
                state.isLoading = true; // نوحد حالة الـ loading
                state.error = null;
            })
            .addCase(fetchServiceForEdit.fulfilled, (state, action) => {
                state.isLoading = false;
                // بما أننا وحدنا طريقة الجلب، يمكننا تخزينها كـ serviceData
                // وسيتم معالجتها داخل الـ Page كما برمجتيها بذكاء مسبقاً
                state.serviceData = action.payload.data ? action.payload.data : action.payload;
            })
            .addCase(fetchServiceForEdit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearServiceDetails } = ServiceDetailsSlice.actions;
export default ServiceDetailsSlice.reducer;