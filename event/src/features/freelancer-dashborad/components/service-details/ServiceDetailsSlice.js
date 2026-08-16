import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // تأكدي من استيراد axios
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService";

// دالة الـ Thunk لجلب بيانات واجهة التفاصيل
export const fetchServiceDetails = createAsyncThunk(
    "serviceDetails/fetchById",
    async (serviceId, thunkAPI) => {
        try {
            const response = await freelancerOfferService.getListingById(serviceId);
            // الداتا غالباً بترجع بقلب response.data، وإذا كانت بـ data.data بناخدها
            return response.data !== undefined ? response.data : response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "حدث خطأ أثناء جلب التفاصيل"
            );
        }
    }
);

// دالة الـ Thunk لجلب بيانات واجهة التعديل
export const fetchServiceForEdit = createAsyncThunk(
    'services/fetchForEdit',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:8000/api/listings/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل جلب بيانات الخدمة");
        }
    }
);

const ServiceDetailsSlice = createSlice({
    name: "serviceDetails",
    initialState: {
        serviceData: null,
        isLoading: true, // 👈 بيبدأ true
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
            // 🔥 الحل هنا: أضفنا الحالات تبع التفاصيل لفك التعليقة!
            .addCase(fetchServiceDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServiceDetails.fulfilled, (state, action) => {
                state.isLoading = false; // 👈 هاد السطر رح يطفي اللودينغ ويفتح الواجهة
                // استخراج الداتا (إذا كانت الباك إند بترجعها ضمن data)
                state.serviceData = action.payload.data ? action.payload.data : action.payload;
            })
            .addCase(fetchServiceDetails.rejected, (state, action) => {
                state.isLoading = false; // 👈 وإذا فشل كمان بيطفي اللودينغ
                state.error = action.payload;
            })

            // -----------------------------------------------------
            // حالات جلب بيانات الخدمة للتعديل (التي أضفتيها مسبقاً)
            .addCase(fetchServiceForEdit.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchServiceForEdit.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const serviceData = action.payload;

                // 🔥 الحل: نخزن الكائن كامل أو الحقول بنفس البنية التي تتوقعها مكونات الإضافة
                state.title = serviceData.title || { en: "", ar: "" };
                state.description = serviceData.description || { en: "", ar: "" };
                state.category_id = serviceData.category_id || "";
                state.district_id = serviceData.district_id || "";
                state.material_composition = serviceData.material_composition || "";

                if (serviceData.variants && serviceData.variants.length > 0) {
                    const mainVariant = serviceData.variants[0];
                    state.variant_name = mainVariant.variant_name || { en: "", ar: "" };
                    state.price = mainVariant.price || "";
                    state.currency = mainVariant.currency || "SYP";
                    state.price_type = mainVariant.price_type || "fixed";
                }

                state.images = serviceData.images || [];
                state.cancel_before_acceptance = serviceData.cancel_before_acceptance || false;
                state.cancel_after_acceptance = serviceData.cancel_after_acceptance || false;
                state.cancelBeforePayment = serviceData.cancel_before_payment || false;
            })
            .addCase(fetchServiceForEdit.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { clearServiceDetails } = ServiceDetailsSlice.actions;
export default ServiceDetailsSlice.reducer;