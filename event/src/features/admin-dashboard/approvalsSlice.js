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

// 👑 تحديث دالة التهيئة لتتطابق مع هيكل الـ Listing العائد من الـ API
function normalizeListing(raw) {
    return {
        id: raw.id,
        // التعامل مع العناوين متعددة اللغات أو النص المباشر
        title: raw.title?.en || raw.title?.ar || raw.title || "Untitled",
        type: raw.type || "service", // service, hall, physical_product, package
        badge: (raw.type || "UNKNOWN").replace('_', ' ').toUpperCase(),
        image: raw.images?.[0]?.url || raw.images?.[0]?.path || null,
        submittedBy: raw.provider?.name || "—",
        timeLabel: formatRelativeTime(raw.created_at),
        status: raw.status ?? "pending_approval",
        category: raw.category?.name || "—",
        raw,
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchApprovals = createAsyncThunk(
    "approvals/fetchApprovals",
    async (_, { getState, rejectWithValue }) => {
        const { activeFilter, page } = getState().approvals;
        try {
            const data = await adminService.getListings(page);

            let list = Array.isArray(data) ? data : data.data || [];

            // 1. استبعاد الوظائف
            list = list.filter(item => item.type !== "job");

            // 2. تطبيق فلتر الشركة والفريلانسر
            if (activeFilter === "company") {
                list = list.filter(item => item.type !== "service");
            } else if (activeFilter === "freelancer") {
                list = list.filter(item => item.type === "service");
            }

            // 👑 3. الترتيب (إعطاء الأولوية للطلبات المعلقة)
            list.sort((a, b) => {
                // إذا كان a معلق و b غير معلق، نضع a في البداية
                if (a.status === "pending_approval" && b.status !== "pending_approval") return -1;

                // إذا كان b معلق و a غير معلق، نضع b في البداية
                if (a.status !== "pending_approval" && b.status === "pending_approval") return 1;

                // إذا كان الاثنين نفس الحالة، نرتبهم من الأحدث للأقدم بناءً على تاريخ الإنشاء
                return new Date(b.created_at) - new Date(a.created_at);
            });

            return {
                items: list.map(normalizeListing),
                currentPage: data.meta?.current_page || page,
                lastPage: data.meta?.last_page || 1,
                total: data.meta?.total || list.length,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل تحميل الخدمات");
        }
    }
);
export const approveRequest = createAsyncThunk(
    "approvals/approveRequest",
    async (id, { rejectWithValue }) => {
        try {
            // استخدام التابع الخاص بقبول الـ Listing
            await adminService.approveListing(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل قبول الخدمة");
        }
    }
);

export const rejectRequest = createAsyncThunk(
    "approvals/rejectRequest",
    async ({ id, reason }, { rejectWithValue }) => {
        if (!reason || !reason.trim()) {
            return rejectWithValue("سبب الرفض مطلوب");
        }
        try {
            // استخدام التابع الخاص برفض الـ Listing
            await adminService.rejectListing(id, reason);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل رفض الخدمة");
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

        activeFilter: "all",   // all | service | hall | physical_product | package
        dateFrom: null,
        dateTo: null,

        page: 1,
        perPage: 15,
        lastPage: 1,
        total: 0,

        status: "idle",        // idle | loading | succeeded | failed
        actionStatus: {},      // { [id]: "approving" | "rejecting" }
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
                state.actionStatus[action.meta.arg] = "approving";
            })
            .addCase(approveRequest.fulfilled, (state, action) => {
                // إزالة العنصر من القائمة بعد قبوله
                state.items = state.items.filter((item) => item.id !== action.payload);
                delete state.actionStatus[action.payload];
            })
            .addCase(approveRequest.rejected, (state, action) => {
                delete state.actionStatus[action.meta.arg];
                state.error = action.payload;
            })

            // reject
            .addCase(rejectRequest.pending, (state, action) => {
                state.actionStatus[action.meta.arg.id] = "rejecting";
            })
            .addCase(rejectRequest.fulfilled, (state, action) => {
                // إزالة العنصر من القائمة بعد رفضه
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
export const selectApprovalPagination = (state) => ({
    page: state.approvals.page,
    lastPage: state.approvals.lastPage,
    total: state.approvals.total,
    perPage: state.approvals.perPage,
});
export const selectDateRange = (state) => ({
    dateFrom: state.approvals.dateFrom,
    dateTo: state.approvals.dateTo,
});

export default approvalsSlice.reducer;