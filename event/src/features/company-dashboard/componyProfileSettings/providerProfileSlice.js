import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import providerService from '../../../services/companyService/providerService'; // تأكدي من صحة مسار ملف الخدمة أعلاه

// Thunk لجلب البيانات بشكل غير متزامن (Asynchronous)
export const fetchProviderProfile = createAsyncThunk(
    'providerProfile/fetch',
    async (_, thunkAPI) => {
        try {
            return await providerService.getProviderProfile();
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'فشل جلب بيانات الحساب';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const providerProfileSlice = createSlice({
    name: 'providerProfile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        // يمكنك إضافة reducers عادية هنا إذا لزم الأمر (مثل تفريغ الستيت عند تسجيل الخروج)
        clearProfileState: (state) => {
            state.profile = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProviderProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviderProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload; // تخزين الـ JSON القادم من الباك إند
            })
            .addCase(fetchProviderProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfileState } = providerProfileSlice.actions;
export default providerProfileSlice.reducer;