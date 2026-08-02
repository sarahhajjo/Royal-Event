import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// تأكدي من مسار ملف السيرفس
import freelancerJobService from "../../../../services/freelancerService/freelancerJobService.js";

export const fetchJobOffers = createAsyncThunk(
    "jobOffers/fetchAll",
    async (_, thunkAPI) => {
        try {
            return await freelancerJobService.getJobOffers();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "حدث خطأ أثناء جلب الوظائف"
            );
        }
    }
);
export const fetchJobById = createAsyncThunk(
    "jobOffers/fetchById",
    async (id, thunkAPI) => {
        try {
            return await freelancerJobService.getJobOfferById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "خطأ في جلب تفاصيل الوظيفة");
        }
    }
);
const JobOffersSlice = createSlice({
    name: "jobOffers",
    initialState: {
        jobs: [],
        isLoading: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobOffers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchJobOffers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobs = action.payload; // تخزين الوظائف
            })
            .addCase(fetchJobOffers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
           .addCase(fetchJobById.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedJob = action.payload; // نحتاج إضافة selectedJob في الـ initialState
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});
// في ملف JobOffersSlice.js


// داخل الـ extraReducers في نفس الملف:


export default JobOffersSlice.reducer;