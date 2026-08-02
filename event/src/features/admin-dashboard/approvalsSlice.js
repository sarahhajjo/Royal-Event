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

// ⚠️ عدّلي أسماء الحقول لتطابق شكل الـ response الحقيقي من /admin/bookings
function normalizeBooking(raw) {
    return {
        id: raw.id,
        type: raw.type ?? raw.booking_type, // service | hall | product | arrangement
        title: raw.title ?? raw.name ?? raw.listing?.title ?? "Untitled",
        badge: (raw.type ?? raw.booking_type ?? "").toString().toUpperCase(),
        image: raw.image ?? raw.photo ?? raw.listing?.image ?? null,
        submittedBy: raw.submitted_by ?? raw.provider_name ?? raw.company_name ?? raw.user?.name ?? "—",
        timeLabel: formatRelativeTime(raw.created_at),
        status: raw.status ?? "pending",
        raw,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────────────────────────────────────

// GET /admin/bookings?status=pending&booking_type=...&date_from=...&date_to=...&per_page=...&page=...
export const fetchApprovals = createAsyncThunk(
    "approvals/fetchApprovals",
    async (_, { getState, rejectWithValue }) => {
        const { activeFilter, dateFrom, dateTo, page, perPage } = getState().approvals;
        try {
            const data = await adminService.getBookings({
                status: "pending",
                booking_type: activeFilter === "all" ? undefined : activeFilter,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                per_page: perPage,
                page,
            });
            // ⚠️ شكل الـ pagination هون مبني على استجابة Laravel القياسية (data / current_page / last_page / total)
            // عدّلي حسب شكل الـ response الفعلي عندك إذا كان مختلف
            const list = Array.isArray(data) ? data : data.data ?? data.bookings ?? [];
            return {
                items: list.map(normalizeBooking),
                currentPage: data.current_page ?? page,
                lastPage: data.last_page ?? 1,
                total: data.total ?? list.length,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل تحميل الطلبات");
        }
    }
);

export const approveRequest = createAsyncThunk(
    "approvals/approveRequest",
    async (id, { rejectWithValue }) => {
        try {
            await adminService.approveBooking(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل قبول الطلب");
        }
    }
);

// رفض — لازم سبب إلزامي (rejection_reason)
export const rejectRequest = createAsyncThunk(
    "approvals/rejectRequest",
    async ({ id, reason }, { rejectWithValue }) => {
        if (!reason || !reason.trim()) {
            return rejectWithValue("سبب الرفض مطلوب");
        }
        try {
            await adminService.rejectBooking(id, reason);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل رفض الطلب");
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

        activeFilter: "all",   // all | service | hall | product | arrangement
        dateFrom: null,        // "YYYY-MM-DD" أو null
        dateTo: null,

        page: 1,
        perPage: 20,
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
