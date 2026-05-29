import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🚀 هذا هو الـ Thunk الذي سيعدله فريق الباك إند لاحقاً لربط الـ API الفعلي
export const fetchCompanyDashboardData = createAsyncThunk(
    'companyDashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            // هنا سيتم استدعاء الـ API الحقيقي عبر axios كمثال:
            // const response = await axios.get('/api/company/dashboard');
            // return response.data;

            // مؤقتاً نرجع مصفوفة فارغة لحين جاهزية السيرفر
            return {};
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching palace data');
        }
    }
);

const initialState = {
    stats: null,       // كروت الإحصائيات الأربعة
    approvals: null,   // موافقات الأدمن التكرارية
    activities: null,  // الأنشطة الأخيرة للباك إند
    topServices: null, // الخدمات الأعلى أداءً
    loading: false,
    error: null
};

const companyDashboardSlice = createSlice({
    name: 'companyDashboard',
    initialState,
    reducers: {
        // هنا يمكنكِ إضافة synchronous actions مستقبلاً إذا احتجتِ لتنظيف البيانات عند تسجيل الخروج
        clearDashboardState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                // الباك إند سيقوم بتحديث هذه البيانات بناءً على الـ Response القادم من السيرفر
                state.stats = action.payload.stats || null;
                state.approvals = action.payload.approvals || null;
                state.activities = action.payload.activities || null;
                state.topServices = action.payload.topServices || null;
            })
            .addCase(fetchCompanyDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearDashboardState } = companyDashboardSlice.actions;
export default companyDashboardSlice.reducer;