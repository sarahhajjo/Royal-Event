import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const fetchCategories = createAsyncThunk('auth/fetchCategories', async (_, thunkAPI) => {
    try {
        return await authService.getCategories();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});
export const fetchDistricts = createAsyncThunk('auth/fetchDistricts', async (_, thunkAPI) => {
    try {
        return await authService.getDistricts();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch districts');
    }
});
export const verifyOTPUser = createAsyncThunk('auth/verifyOTP', async (data, thunkAPI) => {
    try {
        return await authService.verifyOTP(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
});
// التعديل: استقبلي وسيطاً واحداً فقط وهو profileData
export const setupProfile = createAsyncThunk('auth/setupProfile', async (profileData, thunkAPI) => {
    try {
        const response = await authService.setupProfile(profileData);
        // نُرجع البيانات فقط (data) وليس الاستجابة كاملة (response)
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Profile setup failed');
    }
});
// في authSlice.js
export const setupfreelancerProfile = createAsyncThunk('auth/setupFreelancerProfile', async (profileData, thunkAPI) => {
    try {
        const response = await authService.setupfreelancerProfile(profileData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Profile setup failed');
    }
});
export const verifyOTPEmail = createAsyncThunk('auth/verifyEmailOTP', async (data, thunkAPI) => {
    try {
        return await authService.verifyEmailOTP(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Email OTP failed');
    }
});
// في extraReducers

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
        message: null,
        categories: [],
        districts: []
        },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.access_token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data; // تخزين الفئات
            })
            .addCase(fetchDistricts.fulfilled, (state, action) => {
                state.districts = action.payload.data;
            })
            .addCase(verifyOTPUser.fulfilled, (state, action) => {
                state.loading = false;
                // تخزين التوكن إذا كان يعود هنا أيضاً
                state.token = action.payload.data.access_token;
            })
            .addCase(verifyOTPEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.access_token;
            })
            .addCase(setupProfile.fulfilled, (state, action) => {
                state.loading = false;
                // يمكننا هنا تحديث بيانات المستخدم في الـ state إذا لزم الأمر
            })
            .addCase(setupfreelancerProfile.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(setupfreelancerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;