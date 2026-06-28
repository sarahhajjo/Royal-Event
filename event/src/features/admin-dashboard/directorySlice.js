import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { adminService } from "../../services/adminService/adminService.js";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchAllProviders = createAsyncThunk('directory/fetchAll', async () => {
    const response = await api.get('/admin/providers');
    return response.data.data;
});

export const fetchAllFreelancers = createAsyncThunk('directory/fetchAllFreelancers', async () => {
    const response = await api.get('/admin/providers');
    return response.data.data;
});

export const fetchCompanyById = createAsyncThunk('directory/fetchCompanyById', async (id, thunkAPI) => {
    try {
        return await adminService.getProviderById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchFreelancerById = createAsyncThunk('directory/fetchFreelancerById', async (id, thunkAPI) => {
    try {
        return await adminService.getFreelancerById(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

export const updateProviderStatus = createAsyncThunk('directory/updateStatus', async ({ id, status, reason }) => {
    const response = status === 'approved' ? await adminService.approveProvider(id) : await adminService.rejectProvider(id, reason);
    return response.data?.data || response.data;
});

export const updateFreelancerStatus = createAsyncThunk('directory/updateFreelancerStatus', async ({ id, status, reason }) => {
    const response = status === 'approved' ? await adminService.approveFreelancer(id) : await adminService.rejectFreelancer(id, reason);
    return response.data?.data || response.data;
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
        selectedCompany: null,
        selectedFreelancer: null,
        loading: false,
        companyLoading: false,
        freelancerLoading: false,
        updateLoading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // ── Providers (Companies)
            .addCase(fetchAllProviders.fulfilled, (state, action) => {
                state.allProviders = action.payload;
                state.companies = splitByStatus(action.payload, 'company');
            })
            .addCase(fetchCompanyById.pending, (state) => { state.companyLoading = true; })
            .addCase(fetchCompanyById.fulfilled, (state, action) => {
                state.companyLoading = false;
                state.selectedCompany = action.payload;
            })
            .addCase(updateProviderStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.allProviders.findIndex(p => p.id === updated.id);
                if (idx !== -1) state.allProviders[idx] = { ...state.allProviders[idx], ...updated };
                if (state.selectedCompany?.id === updated.id) state.selectedCompany = { ...state.selectedCompany, ...updated };
                state.companies = splitByStatus(state.allProviders, 'company');
            })

            // ── Freelancers
            .addCase(fetchAllFreelancers.fulfilled, (state, action) => {
                state.allFreelancers = action.payload;
                state.freelancers = splitByStatus(action.payload, 'freelancer');
            })
            .addCase(fetchFreelancerById.pending, (state) => { state.freelancerLoading = true; })
            .addCase(fetchFreelancerById.fulfilled, (state, action) => {
                state.freelancerLoading = false;
                state.selectedFreelancer = action.payload;
            })
            .addCase(updateFreelancerStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.allFreelancers.findIndex(f => f.id === updated.id);
                if (idx !== -1) state.allFreelancers[idx] = { ...state.allFreelancers[idx], ...updated };
                if (state.selectedFreelancer?.id === updated.id) state.selectedFreelancer = { ...state.selectedFreelancer, ...updated };
                state.freelancers = splitByStatus(state.allFreelancers, 'freelancer');
            });
    },
});

export default directorySlice.reducer;