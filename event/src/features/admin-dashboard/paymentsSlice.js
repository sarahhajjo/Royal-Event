import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService/adminService.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function normalizeReceipt(raw) {
    return {
        id: raw.id,
        paymentId: raw.id,
        bookingId: `#BK-${(raw.booking_id || "").substring(0, 8)}`,
        customerName: raw.booking?.user ? `${raw.booking.user.first_name} ${raw.booking.user.last_name}` : "—",
        customerAvatar: null,
        providerName: raw.booking?.provider?.brand_name || "—",
        expectedAmount: parseFloat(raw.amount || 0),
        receiptUrl: null,
        status: raw.status || "pending",
        raw,
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("ar-SY", {
        style: "currency",
        currency: "SYP",
    }).format(amount ?? 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchPaymentReceipts = createAsyncThunk(
    "payments/fetchPaymentReceipts",
    async (
        {
            page = 1,
            per_page = 20,
            status = "pending",
            search = ""
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = { page, per_page, status };
            if (search) params.search = search;

            const response = await adminService.getPayments(params);
            const payload = response.data !== undefined ? response.data : response;
            const paginationObj = payload.data || {};
            const list = Array.isArray(paginationObj.data) ? paginationObj.data : (Array.isArray(paginationObj) ? paginationObj : []);

            return {
                items: list.map(normalizeReceipt),
                currentPage: paginationObj.current_page ?? page,
                lastPage: paginationObj.last_page ?? 1,
                total: paginationObj.total ?? list.length,
            };
        } catch (err) {
            console.error("Fetch Error:", err);
            return rejectWithValue(err.response?.data?.message || "فشل تحميل المدفوعات");
        }
    }
);

export const fetchPaymentSummary = createAsyncThunk(
    "payments/fetchPaymentSummary",
    async (_, { rejectWithValue }) => {
        try {
            const data = await adminService.getPaymentSummary();
            const payload = data.data !== undefined ? data.data : data;
            return {
                pendingReview: payload.pending_review ?? 0,
                awaitingClarification: payload.awaiting_clarification ?? 0,
                totalVerifiedMTD: payload.total_verified_mtd ?? 0,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل تحميل الملخص");
        }
    }
);

export const fetchPaymentProofUrl = createAsyncThunk(
    "payments/fetchPaymentProofUrl",
    async (paymentId, { rejectWithValue }) => {
        try {
            const response = await adminService.getViewPaymentProof(paymentId);
            const data = response.data !== undefined ? response.data : response;
            const fileUrl = typeof data === 'string' ? data : (data.url || data.path || data.file_url);

            if (!fileUrl) {
                throw new Error("لم يتم العثور على رابط الملف في استجابة السيرفر");
            }

            return { paymentId, url: fileUrl };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل جلب ملف الإثبات");
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "payments/verifyPayment",
    async (paymentId, { rejectWithValue }) => {
        try {
            await adminService.confirmPayment(paymentId);
            return paymentId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل توثيق الدفعة");
        }
    }
);

export const rejectPayment = createAsyncThunk(
    "payments/rejectPayment",
    async ({ paymentId, note }, { rejectWithValue }) => {
        if (!note || !note.trim()) {
            return rejectWithValue("سبب الرفض مطلوب");
        }
        try {
            await adminService.rejectPayment(paymentId, note.trim());
            return paymentId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "فشل رفض الدفعة");
        }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────
const paymentsSlice = createSlice({
    name: "payments",
    initialState: {
        items: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        searchTerm: "",
        summary: { pendingReview: 0, awaitingClarification: 0, totalVerifiedMTD: 0 },
        summaryStatus: "idle",
        status: "idle",
        processingIds: [],
        error: null,
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // receipts list
            .addCase(fetchPaymentReceipts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPaymentReceipts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.currentPage = action.payload.currentPage;
                state.lastPage = action.payload.lastPage;
                state.total = action.payload.total;
            })
            .addCase(fetchPaymentReceipts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // summary cards
            .addCase(fetchPaymentSummary.pending, (state) => {
                state.summaryStatus = "loading";
            })
            .addCase(fetchPaymentSummary.fulfilled, (state, action) => {
                state.summaryStatus = "succeeded";
                state.summary = action.payload;
            })
            .addCase(fetchPaymentSummary.rejected, (state) => {
                state.summaryStatus = "failed";
            })

            // fetch proof url
            .addCase(fetchPaymentProofUrl.pending, (state, action) => {
                state.processingIds.push(action.meta.arg);
            })
            .addCase(fetchPaymentProofUrl.fulfilled, (state, action) => {
                state.processingIds = state.processingIds.filter((id) => id !== action.payload.paymentId);
                const item = state.items.find((i) => i.paymentId === action.payload.paymentId);
                if (item) item.receiptUrl = action.payload.url;
            })
            .addCase(fetchPaymentProofUrl.rejected, (state, action) => {
                state.processingIds = state.processingIds.filter((id) => id !== action.meta.arg);
                state.error = action.payload;
            })

            // verify payment
            .addCase(verifyPayment.pending, (state, action) => {
                state.processingIds.push(action.meta.arg);
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.paymentId !== action.payload);
                state.processingIds = state.processingIds.filter((id) => id !== action.payload);
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.processingIds = state.processingIds.filter((id) => id !== action.meta.arg);
                state.error = action.payload;
            })

            // reject payment
            .addCase(rejectPayment.pending, (state, action) => {
                state.processingIds.push(action.meta.arg.paymentId);
            })
            .addCase(rejectPayment.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.paymentId !== action.payload);
                state.processingIds = state.processingIds.filter((id) => id !== action.payload);
            })
            .addCase(rejectPayment.rejected, (state, action) => {
                state.processingIds = state.processingIds.filter((id) => id !== action.meta.arg.paymentId);
                state.error = action.payload;
            });
    },
});

export const { setSearchTerm } = paymentsSlice.actions;

export const selectPaymentItems      = (state) => state.payments.items;
export const selectPaymentStatus     = (state) => state.payments.status;
export const selectPaymentPagination = (state) => ({
    currentPage: state.payments.currentPage,
    lastPage: state.payments.lastPage,
    total: state.payments.total,
});
export const selectSearchTerm      = (state) => state.payments.searchTerm;
export const selectPaymentSummary  = (state) => state.payments.summary;
export const selectProcessingIds   = (state) => state.payments.processingIds;

export { formatCurrency };
export default paymentsSlice.reducer;