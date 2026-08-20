import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import freelancerProfileService from "../../services/freelancerService/freelancerProfileService.js";
// 👑 استيراد الخدمة بدلاً من axios

// جلب بيانات بروفايل الفريلانسر
export const fetchMyProfile = createAsyncThunk(
    'freelancerProfile/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await freelancerProfileService.getMyProfile();
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load profile');
        }
    }
);

// 💡 Thunk لجلب رابط الـ QR
export const fetchFreelancerQrCode = createAsyncThunk(
    'freelancerProfile/fetchFreelancerQrCode',
    async (_, { rejectWithValue }) => {
        try {
            const response = await freelancerProfileService.getFreelancerQrCode();
            return response.data || response;
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
            // التوكن والفورم داتا أصبحت تُعالج داخل الـ Service مباشرة!
            const response = await freelancerProfileService.uploadFreelancerQrCode(file);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload QR Code');
        }
    }
);

// تحديث البروفايل
export const updateMyProfile = createAsyncThunk(
    'freelancerProfile/updateMyProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await freelancerProfileService.updateMyProfile(formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const freelancerProfileSlice = createSlice({
    name: 'freelancerProfile',
    initialState: {
        profileData: null,
        qrCodeUrl: null,
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
            // استقبال بيانات الـ QR
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