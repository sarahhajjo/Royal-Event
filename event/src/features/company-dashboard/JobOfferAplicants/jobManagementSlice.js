import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobApplicantsService, toggleJobActiveService } from '../../../services/companyService/jobService.js'; // تأكدي من مسارك

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
            return response.data; // الباك إند يرجع تفاصيل الوظيفة المحدثة في data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
        }
    }
);
const jobManagementSlice = createSlice({
    name: 'jobManagement',
    initialState: {
        jobs: [],
        loading: false,
        error: null,

        // 💡 إضافة الفريلانسر المحدد هنا
        selectedFreelancer: null,
    },
    reducers: {
        // 💡 إضافة الـ Reducers الخاصة بالـ Profile
        setSelectedFreelancer: (state, action) => {
            state.selectedFreelancer = action.payload;
        },
        clearSelectedFreelancer: (state) => {
            state.selectedFreelancer = null;
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
            // البحث عن الوظيفة التي تم تعديلها وتحديث حالتها في الواجهة
            const updatedJob = action.payload;
            const index = state.jobs.findIndex(job => job.id === updatedJob.id);
            if (index !== -1) {
                state.jobs[index].is_active = updatedJob.is_active;
            }
        });
    }
});

// 💡 لا تنسي تصدير الأكشنز الجديدة
export const { setSelectedFreelancer, clearSelectedFreelancer } = jobManagementSlice.actions;

export default jobManagementSlice.reducer;