import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService/adminService.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatRelativeTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
}

// 👑 دالة تطبيع البيانات المعدلة خصيصاً لتتعامل مع حالة الـ pending والـ job بدقة
const normalizeListing = (item) => {
    const isJob = item.type === 'job' || item.job_title !== undefined;

    if (isJob) {
        let rawStatus = item.moderation_status || item.status || "pending";

        return {
            id: item.id,
            title: item.job_title || "Untitled Job",
            type: "job",
            status: rawStatus === "pending" ? "pending_approval" : rawStatus,
            category: item.service?.name || item.event_type || "Job Offer",
            submittedBy: item.provider?.brand_name || item.provider?.name || "—",
            created_at: item.created_at,
            raw: item,
        };
    }

    // التطبيع الخاص بالخدمات العادية (Listings)
    return {
        id: item.id,
        title: item.title || "Untitled",
        type: item.type || "service",
        status: item.status || "pending_approval",
        category: item.category?.name || "General",
        submittedBy: item.provider?.brand_name || item.provider?.name || "—",
        created_at: item.created_at,
        raw: item,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────────────────────────────────────
export const fetchApprovals = createAsyncThunk(
    "approvals/fetchApprovals",
    async (_, { getState, rejectWithValue }) => {
        const { activeFilter, page } = getState().approvals;
        try {
            // جلب الليستنغات والوظائف بالتوازي
            const [listingsData, jobOffersData] = await Promise.all([
                adminService.getListings(page),
                adminService.getPendingJobOffers(page).catch(() => [])
            ]);

            let listingsList = Array.isArray(listingsData)
                ? listingsData
                : listingsData.data?.data || listingsData.data || [];

            let jobOffersList = Array.isArray(jobOffersData)
                ? jobOffersData
                : jobOffersData.data?.data || jobOffersData.data || [];

            // توحيد هيكل الوظائف وضمان قراءة الحالة الصحيحة
            const normalizedJobs = jobOffersList.map(job => ({
                ...job,
                type: "job",
                status: job.moderation_status || job.status || "pending"
            }));

            // دمج القائمتين معاً
            let combinedList = [...listingsList, ...normalizedJobs];

            // 👑 تطبيق الفلاتر بدقة حسب التبويب النشط في واجهة المستخدم
            if (activeFilter === "company") {
                // يعرض كل ما عدا خدمات الفريلانسر والوظائف (مثل Halls وغيرها)
                combinedList = combinedList.filter(item => item.type !== "service" && item.type !== "job");
            } else if (activeFilter === "freelancer") {
                // يعرض خدمات الفريلانسر حصرياً
                combinedList = combinedList.filter(item => item.type === "service");
            } else if (activeFilter === "job") {
                // يعرض الوظائف حصرياً في تبويب الـ Job Offers
                combinedList = combinedList.filter(item => item.type === "job");
            }

            combinedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return {
                items: combinedList.map(normalizeListing),
                currentPage: listingsData.meta?.current_page || listingsData.data?.current_page || page,
                lastPage: listingsData.meta?.last_page || listingsData.data?.last_page || 1,
                total: combinedList.length,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل تحميل الطلبات");
        }
    }
);

export const approveRequest = createAsyncThunk(
    "approvals/approveRequest",
    async (payload, { rejectWithValue }) => {
        try {
            // دعم استلام الكائن كاملاً أو المعرف مباشرة مع النوع
            const id = typeof payload === 'object' ? payload.id : payload;
            const type = typeof payload === 'object' ? payload.type : 'service';

            if (type === 'job') {
                await adminService.approveJobOffer(id);
            } else {
                await adminService.approveListing(id);
            }
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل القبول");
        }
    }
);

export const rejectRequest = createAsyncThunk(
    "approvals/rejectRequest",
    async ({ id, reason, type }, { rejectWithValue }) => {
        if (!reason || !reason.trim()) {
            return rejectWithValue("سبب الرفض مطلوب");
        }
        try {
            if (type === 'job') {
                await adminService.rejectJobOffer(id, reason);
            } else {
                await adminService.rejectListing(id, reason);
            }
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل الرفض");
        }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────
const approvalsSlice = createSlice({
    name: "approvals",
    initialState: {
        items: [],

        activeFilter: "all",   // all | company | freelancer | job
        dateFrom: null,
        dateTo: null,

        page: 1,
        perPage: 15,
        lastPage: 1,
        total: 0,

        status: "idle",        // idle | loading | succeeded | failed
        actionStatus: {},
        error: null,
    },
    reducers: {
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
            state.page = 1;
        },
        setDateRange: (state, action) => {
            state.dateFrom = action.payload.dateFrom ?? null;
            state.dateTo = action.payload.dateTo ?? null;
            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovals.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchApprovals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.page = action.payload.currentPage;
                state.lastPage = action.payload.lastPage;
                state.total = action.payload.total;
            })
            .addCase(fetchApprovals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // approve
            .addCase(approveRequest.pending, (state, action) => {
                const targetId = typeof action.meta.arg === 'object' ? action.meta.arg.id : action.meta.arg;
                state.actionStatus[targetId] = "approving";
            })
            .addCase(approveRequest.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                delete state.actionStatus[action.payload];
            })
            .addCase(approveRequest.rejected, (state, action) => {
                const targetId = typeof action.meta.arg === 'object' ? action.meta.arg.id : action.meta.arg;
                delete state.actionStatus[targetId];
                state.error = action.payload;
            })

            // reject
            .addCase(rejectRequest.pending, (state, action) => {
                state.actionStatus[action.meta.arg.id] = "rejecting";
            })
            .addCase(rejectRequest.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                delete state.actionStatus[action.payload];
            })
            .addCase(rejectRequest.rejected, (state, action) => {
                delete state.actionStatus[action.meta.arg.id];
                state.error = action.payload;
            });
    },
});

export const { setActiveFilter, setDateRange, setPage } = approvalsSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────
export const selectApprovalItems   = (state) => state.approvals.items;
export const selectApprovalStatus  = (state) => state.approvals.status;
export const selectActiveFilter    = (state) => state.approvals.activeFilter;
export const selectActionStatus    = (state) => state.approvals.actionStatus;
export const selectApprovalError   = (state) => state.approvals.error;

export const selectApprovalPagination = (state) => state.approvals.page;
export const selectApprovalLastPage   = (state) => state.approvals.lastPage;
export const selectApprovalTotal      = (state) => state.approvals.total;
export const selectApprovalPerPage    = (state) => state.approvals.perPage;

export const selectDateRange = (state) => ({
    dateFrom: state.approvals.dateFrom,
    dateTo: state.approvals.dateTo,
});

export default approvalsSlice.reducer;