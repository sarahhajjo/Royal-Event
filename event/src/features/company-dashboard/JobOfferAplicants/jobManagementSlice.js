import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchJobApplicantsService,
    toggleJobActiveService,
    fetchFreelancerBlockedDatesService // 💡 استيراد دالة التقويم
} from '../../../services/companyService/jobService.js'; // تأكدي من مسارك

export const fetchJobsWithApplications = createAsyncThunk(
    'jobManagement/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchJobApplicantsService();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch data');
        }
    }
);

export const toggleJobStatus = createAsyncThunk(
    'jobManagement/toggleStatus',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await toggleJobActiveService(jobId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
        }
    }
);

// 💡 Thunk جديد لجلب التواريخ المحجوزة للفريلانسر المحدد
export const fetchFreelancerBlockedDates = createAsyncThunk(
    'jobManagement/fetchBlockedDates',
    async (freelancerId, { rejectWithValue }) => {
        try {
            const response = await fetchFreelancerBlockedDatesService(freelancerId);
            return response.data; // سيرجع مصفوفة الأيام من الباك إند
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch blocked dates');
        }
    }
);

const jobManagementSlice = createSlice({
    name: 'jobManagement',
    initialState: {
        jobs: [],
        loading: false,
        error: null,
        selectedFreelancer: null,

        // 💡 مخزن بيانات التقويم
        blockedDates: [],
        blockedDatesLoading: false,
    },
    reducers: {
        setSelectedFreelancer: (state, action) => {
            state.selectedFreelancer = action.payload;
        },
        clearSelectedFreelancer: (state) => {
            state.selectedFreelancer = null;
            state.blockedDates = []; // 💡 تصفير التواريخ عند إغلاق البروفايل
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobsWithApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobsWithApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchJobsWithApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleJobStatus.fulfilled, (state, action) => {
                const updatedJob = action.payload;
                const index = state.jobs.findIndex(job => job.id === updatedJob.id);
                if (index !== -1) {
                    state.jobs[index].is_active = updatedJob.is_active;
                }
            })
            // 💡 الحالات الخاصة بجلب التقويم
            .addCase(fetchFreelancerBlockedDates.pending, (state) => {
                state.blockedDatesLoading = true;
            })
            .addCase(fetchFreelancerBlockedDates.fulfilled, (state, action) => {
                state.blockedDatesLoading = false;
                state.blockedDates = action.payload || [];
            })
            .addCase(fetchFreelancerBlockedDates.rejected, (state) => {
                state.blockedDatesLoading = false;
            });
    }
});

export const { setSelectedFreelancer, clearSelectedFreelancer } = jobManagementSlice.actions;

export default jobManagementSlice.reducer;