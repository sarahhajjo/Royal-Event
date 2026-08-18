import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// جلب بيانات بروفايل الفريلانسر
export const fetchMyProfile = createAsyncThunk(
    'freelancerProfile/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/provider/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load profile');
        }
    }
);

// 💡 Thunk جديد لجلب رابط الـ QR من الـ Endpoint المخصص
export const fetchFreelancerQrCode = createAsyncThunk(
    'freelancerProfile/fetchFreelancerQrCode',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/provider/qr', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch QR Code');
        }
    }
);

// Thunk لرفع الـ QR Code
export const uploadFreelancerQrCode = createAsyncThunk(
    'freelancerProfile/uploadFreelancerQrCode',
    async (file, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('qr_image', file);

            const response = await axios.post('http://127.0.0.1:8000/api/provider/upload-qr', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload QR Code');
        }
    }
);
export const updateMyProfile = createAsyncThunk(
    'freelancerProfile/updateMyProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token'); // أو حسب طريقة جلب التوكن لديك
            const response = await axios.put('http://127.0.0.1:8000/api/provider/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const freelancerProfileSlice = createSlice({
    name: 'freelancerProfile',
    initialState: {
        profileData: null,
        qrCodeUrl: null, // 💡 حفظ رابط الـ QR هنا بشكل مستقل
        status: 'idle',
        isUploadingQr: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profileData = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // 💡 استقبال بيانات الـ QR عند جلبها من الـ Endpoint الجديد
            .addCase(fetchFreelancerQrCode.fulfilled, (state, action) => {
                const res = action.payload;
                state.qrCodeUrl = res?.qr_url || res?.qr_code_url || res?.url || res?.path || res;
            })
            .addCase(uploadFreelancerQrCode.pending, (state) => {
                state.isUploadingQr = true;
            })
            .addCase(uploadFreelancerQrCode.fulfilled, (state, action) => {
                state.isUploadingQr = false;
                const resData = action.payload;
                const qrUrl = resData?.qr_url || resData?.qr_code_url || resData?.url || resData?.path;
                if (qrUrl) {
                    state.qrCodeUrl = qrUrl;
                }
            })
            .addCase(uploadFreelancerQrCode.rejected, (state, action) => {
                state.isUploadingQr = false;
                state.error = action.payload;
            });
    },
});

export default freelancerProfileSlice.reducer;