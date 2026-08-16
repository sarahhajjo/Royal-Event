import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import providerService from '../../../services/companyService/providerService';

// 💡 دالة مساعدة لالتقاط رسائل الأخطاء بدقة (مثل تكرار الاسم أو ارتباط بوظيفة)
const extractErrorMessage = (error) => {
    if (error.response?.data?.errors) {
        return Object.values(error.response.data.errors).flat().join('\n');
    }
    return error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
};

export const fetchProviderProfile = createAsyncThunk('providerProfile/fetch', async (_, thunkAPI) => {
    try { return await providerService.getProviderProfile(); }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

// ─── Thunks الخاصة بالخدمات ───
export const fetchServicesThunk = createAsyncThunk('providerProfile/fetchServices', async (_, thunkAPI) => {
    try { return await providerService.getCompanyServicesData(); }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

export const addServiceThunk = createAsyncThunk('providerProfile/addService', async (data, thunkAPI) => {
    try { return await providerService.addCompanyService(data); }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

export const updateServiceThunk = createAsyncThunk('providerProfile/updateService', async ({ id, data }, thunkAPI) => {
    try { return await providerService.updateCompanyService(id, data); }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

export const deleteServiceThunk = createAsyncThunk('providerProfile/deleteService', async (id, thunkAPI) => {
    try {
        await providerService.deleteCompanyService(id);
        return id; // نرجع الـ ID لنحذفه من الواجهة
    }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

const providerProfileSlice = createSlice({
    name: 'providerProfile',
    initialState: {
        profile: null,
        companyServices: [], // 💡 لتخزين الخدمات
        loading: false,
        error: null,
    },
    reducers: {
        clearProfileState: (state) => {
            state.profile = null;
            state.companyServices = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // جلب البروفايل
            .addCase(fetchProviderProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProviderProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
            .addCase(fetchProviderProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // جلب الخدمات
            .addCase(fetchServicesThunk.fulfilled, (state, action) => { state.companyServices = action.payload; })

            // إضافة خدمة
            .addCase(addServiceThunk.fulfilled, (state, action) => { state.companyServices.unshift(action.payload); })

            // تعديل خدمة
            .addCase(updateServiceThunk.fulfilled, (state, action) => {
                const index = state.companyServices.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.companyServices[index] = action.payload;
            })

            // حذف خدمة
            .addCase(deleteServiceThunk.fulfilled, (state, action) => {
                state.companyServices = state.companyServices.filter(s => s.id !== action.payload);
            });
    },
});

export const { clearProfileState } = providerProfileSlice.actions;
export default providerProfileSlice.reducer;