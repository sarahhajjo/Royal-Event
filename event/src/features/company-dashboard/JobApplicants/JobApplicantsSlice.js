import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
// 💡 استيراد الدالة من ملف السيرفس الجديد الذي أنشأناه
import { fetchCompanyContractsService } from '../../../services/companyService/jobService.js';

export const fetchContracts = createAsyncThunk(
    'jobApplicants/fetchContracts',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await fetchCompanyContractsService(page);
            return response; // نرجع الاستجابة كاملة للتعامل معها في الأسفل
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
        }
    }
);

const initialState = {
    contracts: [],
    pagination: { currentPage: 1, lastPage: 1, total: 0, perPage: 15 },
    loading: false,
    error: null,
};

const jobApplicantsSlice = createSlice({
    name: 'jobApplicants',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.loading = false;

                // 💡 التعديل هنا: الداتا الفعلية للعقود موجودة داخل data.data بناءً على البوستمان
                state.contracts = action.payload?.data?.data || [];

                // 💡 قراءة معلومات الصفحات
                state.pagination = {
                    currentPage: action.payload?.data?.current_page || 1,
                    lastPage: action.payload?.data?.last_page || 1,
                    total: action.payload?.data?.total || 0,
                    perPage: action.payload?.data?.per_page || 15,
                };
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'حدث خطأ أثناء تحميل العقود';
            });
    },
});

export default jobApplicantsSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectContracts = (state) => state.jobApplicants.contracts;
export const selectContractsLoading = (state) => state.jobApplicants.loading;
export const selectContractsError = (state) => state.jobApplicants.error;
export const selectContractsPagination = (state) => state.jobApplicants.pagination;

// تجميع العقود حسب الوظيفة (job_offer)
export const selectContractsGroupedByJob = createSelector([selectContracts], (contracts) => {
    const groups = new Map();
    contracts.forEach((contract) => {
        const job = contract.job_offer; // 💡 اسم الحقل متطابق 100% مع البوستمان
        const key = job?.id || 'unknown';
        if (!groups.has(key)) {
            groups.set(key, { job, contracts: [] });
        }
        groups.get(key).contracts.push(contract);
    });
    return Array.from(groups.values());
});