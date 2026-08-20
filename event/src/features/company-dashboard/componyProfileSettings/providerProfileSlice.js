import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import providerService from '../../../services/companyService/providerService';
import { fixImageUrl } from '../../../utils/imageUrlHelper';
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

// 💡 Thunk تحديث البروفايل
export const updateProviderProfileThunk = createAsyncThunk('providerProfile/updateProfile', async (data, thunkAPI) => {
    try {
        const response = await providerService.updateProviderProfile(data);
        // نقوم بإعادة جلب البروفايل لتحديث كافة البيانات في التطبيق
        thunkAPI.dispatch(fetchProviderProfile());
        return response;
    }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

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
        return id;
    }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

export const fetchQrCodeThunk = createAsyncThunk('providerProfile/fetchQrCode', async (_, thunkAPI) => {
    try { return await providerService.getCompanyQrCode(); }
    catch (error) { return thunkAPI.rejectWithValue(extractErrorMessage(error)); }
});

const providerProfileSlice = createSlice({
    name: 'providerProfile',
    initialState: {
        profile: null,
        companyServices: [],
        qrCodeUrl: null,
        loading: false,
        updateLoading: false, // 💡 حالة تحميل لزر الحفظ
        error: null,
    },
    reducers: {
        clearProfileState: (state) => {
            state.profile = null;
            state.companyServices = [];
            state.qrCodeUrl = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProviderProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProviderProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
            .addCase(fetchProviderProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // 💡 حالات تحديث البروفايل
            .addCase(updateProviderProfileThunk.pending, (state) => { state.updateLoading = true; state.error = null; })
            .addCase(updateProviderProfileThunk.fulfilled, (state) => { state.updateLoading = false; })
            .addCase(updateProviderProfileThunk.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload; })

            .addCase(fetchServicesThunk.fulfilled, (state, action) => { state.companyServices = action.payload; })
            .addCase(addServiceThunk.fulfilled, (state, action) => { state.companyServices.unshift(action.payload); })
            .addCase(updateServiceThunk.fulfilled, (state, action) => {
                const index = state.companyServices.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.companyServices[index] = action.payload;
            })
            .addCase(deleteServiceThunk.fulfilled, (state, action) => {
                state.companyServices = state.companyServices.filter(s => s.id !== action.payload);
            })
            .addCase(fetchQrCodeThunk.fulfilled, (state, action) => {
                // 💡 نمرر الرابط الخام عبر fixImageUrl ليتحول تلقائياً لدومين الـ ngrok الصحيح
                // بدل ما يضل بالدومين المحلي (127.0.0.1:8000) اللي رجعه الباك إند
                state.qrCodeUrl = fixImageUrl(action.payload?.data?.qr_url) || null;
            });
    },
});

export const { clearProfileState } = providerProfileSlice.actions;
export default providerProfileSlice.reducer;