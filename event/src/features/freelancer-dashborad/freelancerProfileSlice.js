import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // أو استخدمي apiClient تبعك

// Thunk لجلب بيانات بروفايل الفريلانسر المسجل دخوله
export const fetchMyProfile = createAsyncThunk(
    'freelancerProfile/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            // ⚠️ استبدلي الرابط بالمسار الصحيح للباك إند الخاص بجلب بروفايل الفريلانسر
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

const freelancerProfileSlice = createSlice({
    name: 'freelancerProfile',
    initialState: {
        profileData: null,
        status: 'idle', // idle | loading | succeeded | failed
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
            });
    },
});

export default freelancerProfileSlice.reducer;