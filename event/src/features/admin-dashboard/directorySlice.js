import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { adminService } from "../../services/adminService/adminService.js";

// ── Thunks ────────────────────────────────────────────────────────────────────

// 1. جلب كل المستخدمين للإدارة
export const fetchAdminUsers = createAsyncThunk('directory/fetchAdminUsers', async (_, thunkAPI) => {
    try {
        return await adminService.getAdminUsers();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// 2. جلب بروفايل مستخدم واحد بالـ ID
export const fetchUserProfileById = createAsyncThunk('directory/fetchUserProfileById', async (id, thunkAPI) => {
    try {
        return await adminService.getOrganizerById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// 3. جلب كل الشركات (Providers)
export const fetchAllProviders = createAsyncThunk('directory/fetchAll', async () => {
    const response = await api.get('/admin/providers');
    return response.data.data;
});

// 4. جلب كل الفريلانسرز
export const fetchAllFreelancers = createAsyncThunk('directory/fetchAllFreelancers', async () => {
    const response = await api.get('/admin/providers');
    return response.data.data;
});

// 5. جلب شركة محددة بالـ ID
export const fetchCompanyById = createAsyncThunk('directory/fetchCompanyById', async (id, thunkAPI) => {
    try {
        return await adminService.getProviderById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// 6. جلب فريلانسر محدد بالـ ID
export const fetchFreelancerById = createAsyncThunk('directory/fetchFreelancerById', async (id, thunkAPI) => {
    try {
        return await adminService.getProviderById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// 7. تحديث حالة الشركة
export const updateProviderStatus = createAsyncThunk('directory/updateStatus', async ({ id, status, reason }) => {
    const response = status === 'approved'
        ? await adminService.approveProvider(id)
        : await adminService.rejectProvider(id, reason);
    return response.data?.data || response.data;
});

// 8. تحديث حالة الفريلانسر
export const updateFreelancerStatus = createAsyncThunk('directory/updateFreelancerStatus', async ({ id, status, reason }) => {
    const response = status === 'approved'
        ? await adminService.approveProvider(id)
        : await adminService.rejectProvider(id, reason);
    return response.data?.data || response.data;
});

// 🚀 9. جلب QR Code الخاص بمزود الخدمة (للأدمن)
export const fetchAdminFreelancerQr = createAsyncThunk('directory/fetchAdminFreelancerQr', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/admin/providers/${id}/qr-code`);
        return response.data?.qr_url || response.data?.data?.qr_url || null;
    } catch (error) {
        // نمرر الخطأ كالمعتاد لكن سنتجاهله في الـ extraReducers
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const splitByStatus = (arr, type) => ({
    pending:  arr.filter(p => p.provider_type === type && p.moderation_status === 'pending'),
    accepted: arr.filter(p => p.provider_type === type && p.moderation_status === 'approved'),
    rejected: arr.filter(p => p.provider_type === type && p.moderation_status === 'rejected'),
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const directorySlice = createSlice({
    name: 'directory',
    initialState: {
        allProviders: [],
        companies: { pending: [], accepted: [], rejected: [] },

        allFreelancers: [],
        freelancers: { pending: [], accepted: [], rejected: [] },

        users: [],
        usersLoading: false,

        selectedUser: null,
        userProfileLoading: false,

        selectedCompany: null,
        selectedFreelancer: null,

        // متغيرات الـ QR الخاصة بالأدمن
        adminQrUrl: null,
        qrLoading: false,

        loading: false,
        companyLoading: false,
        freelancerLoading: false,
        updateLoading: false,
        error: null,
    },
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearAdminQr: (state) => {
            state.adminQrUrl = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Admin Users ──
            .addCase(fetchAdminUsers.pending, (state) => {
                state.usersLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload;
            })

            // ── User Profile ──
            .addCase(fetchUserProfileById.pending, (state) => {
                state.userProfileLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfileById.fulfilled, (state, action) => {
                state.userProfileLoading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserProfileById.rejected, (state, action) => {
                state.userProfileLoading = false;
                state.error = action.payload;
            })

            // ── Providers (Companies) ──
            .addCase(fetchAllProviders.fulfilled, (state, action) => {
                state.allProviders = action.payload;
                state.companies = splitByStatus(action.payload, 'company');
            })
            .addCase(fetchCompanyById.pending, (state) => {
                state.companyLoading = true;
                state.error = null;
            })
            .addCase(fetchCompanyById.fulfilled, (state, action) => {
                state.companyLoading = false;
                state.selectedCompany = action.payload;
            })
            .addCase(fetchCompanyById.rejected, (state, action) => {
                state.companyLoading = false;
                state.error = action.payload;
            })
            .addCase(updateProviderStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.allProviders.findIndex(p => p.id === updated.id);
                if (idx !== -1) state.allProviders[idx] = { ...state.allProviders[idx], ...updated };
                if (state.selectedCompany?.id === updated.id) state.selectedCompany = { ...state.selectedCompany, ...updated };
                state.companies = splitByStatus(state.allProviders, 'company');
            })

            // ── Freelancers ──
            .addCase(fetchAllFreelancers.fulfilled, (state, action) => {
                state.allFreelancers = action.payload;
                state.freelancers = splitByStatus(action.payload, 'freelancer');
            })
            .addCase(fetchFreelancerById.pending, (state) => {
                state.freelancerLoading = true;
                state.error = null;
            })
            .addCase(fetchFreelancerById.fulfilled, (state, action) => {
                state.freelancerLoading = false;
                state.selectedFreelancer = action.payload;
            })
            .addCase(fetchFreelancerById.rejected, (state, action) => {
                state.freelancerLoading = false;
                state.error = action.payload; // هنا نعرض الخطأ لأن بيانات الفريلانسر أساسية
            })

            // 🚀 ── Admin QR Code ──
            .addCase(fetchAdminFreelancerQr.pending, (state) => {
                state.qrLoading = true;
                state.adminQrUrl = null;
                // ⚠️ لا نضع state.error = null هنا كي لا نمسح أخطاء سابقة بالخطأ
            })
            .addCase(fetchAdminFreelancerQr.fulfilled, (state, action) => {
                state.qrLoading = false;
                state.adminQrUrl = action.payload;
            })
            .addCase(fetchAdminFreelancerQr.rejected, (state) => {
                state.qrLoading = false;
                state.adminQrUrl = null;
                // 👑 السر هنا: لا نكتب state.error = action.payload
                // نتجاهل الخطأ بصمت لتبقى الصفحة تعمل ويظل مربع الـ QR فارغاً
            });
    },
});

export const { clearSelectedUser, clearAdminQr } = directorySlice.actions;
export default directorySlice.reducer;