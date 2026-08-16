import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import freelancerOrderService from "../../../../services/freelancerService/freelancerOrderService.js";
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService.js";


// Thunk لجلب الحجوزات مع الصور الخاصة بها
export const fetchProviderBookings = createAsyncThunk(
    "freelancerOrders/fetchProviderBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await freelancerOrderService.getProviderBookings();
            const payload = response.data !== undefined ? response.data : response;
            const items = Array.isArray(payload.data) ? payload.data : (Array.isArray(payload) ? payload : []);

            const uniqueListingIds = [...new Set(items.map(item => item.listing?.id).filter(Boolean))];

            const imagePromises = uniqueListingIds.map(async (id) => {
                const imagesData = await freelancerOrderService.getListingImages(id);
                const imagesArray = imagesData.data || imagesData;
                const firstImage = (Array.isArray(imagesArray) && imagesArray.length > 0)
                    ? (imagesArray[0].url || imagesArray[0].path || imagesArray[0])
                    : null;

                return { id, url: firstImage };
            });

            const imagesResults = await Promise.all(imagePromises);

            const imageMap = {};
            imagesResults.forEach(res => {
                if (res.url) imageMap[res.id] = res.url;
            });

            return items.map(item => normalizeBooking(item, imageMap));
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل تحميل الحجوزات");
        }
    }
);

export const acceptBookingAction = createAsyncThunk(
    "freelancerOrders/acceptBooking",
    async (bookingId, { rejectWithValue }) => {
        try {
            await freelancerOrderService.acceptBooking(bookingId);
            return { id: bookingId, status: "accepted" };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل قبول الحجز");
        }
    }
);

export const rejectBookingAction = createAsyncThunk(
    "freelancerOrders/rejectBooking",
    async (bookingId, { rejectWithValue }) => {
        try {
            await freelancerOrderService.rejectBooking(bookingId);
            return { id: bookingId, status: "rejected" };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل رفض الحجز");
        }
    }
);

// Thunk لجلب تفاصيل الحجز الفردي
export const fetchBookingDetails = createAsyncThunk(
    "freelancerOrders/fetchBookingDetails",
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await freelancerOrderService.getBookingDetails(bookingId);
            // حسب هيكلية الباك إند عندك، إذا كانت الداتا داخل response.data
            return response.data !== undefined ? response.data : response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "فشل تحميل تفاصيل الحجز");
        }
    }
);

function normalizeBooking(raw, imageMap = {}) {
    const startTime = raw.shift?.start_time ? raw.shift.start_time.substring(0, 5) : "";
    const endTime = raw.shift?.end_time ? raw.shift.end_time.substring(0, 5) : "";
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : "غير محدد";

    const listingId = raw.listing?.id;
    const fetchedImage = listingId ? imageMap[listingId] : null;
    const defaultImage = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop";

    return {
        id: `#BK-${(raw.id || "").substring(0, 8)}`,
        title: raw.listing?.title || "خدمة بدون عنوان",
        variantName: raw.variant?.name || "",
        client: raw.customer?.name || "عميل غير معروف",
        eventDate: raw.booked_date || "غير محدد",
        time: timeString,
        price: raw.price ? `${parseFloat(raw.price).toLocaleString()} ${raw.currency || 'SYP'}` : "مجاني",
        status: raw.status || "pending",
        image: fetchedImage || defaultImage,
        raw,
    };
}

const orderSlice = createSlice({
    name: "Orders",
    initialState: {
        items: [],
        selectedBooking: null, // 🔥 أضفنا هذا المتغير لتخزين تفاصيل الحجز الحالي
        status: "idle",
        detailsStatus: "idle", // 🔥 حالة خاصة بتحميل التفاصيل
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // الحجوزات العامة
            .addCase(fetchProviderBookings.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProviderBookings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchProviderBookings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // قبول الحجز
            .addCase(acceptBookingAction.fulfilled, (state, action) => {
                const booking = state.items.find(item => item.raw.id === action.payload.id);
                if (booking) {
                    booking.status = action.payload.status;
                    booking.raw.status = action.payload.status;
                }
                if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
                    state.selectedBooking.status = action.payload.status;
                }
            })

            // رفض الحجز
            .addCase(rejectBookingAction.fulfilled, (state, action) => {
                const booking = state.items.find(item => item.raw.id === action.payload.id);
                if (booking) {
                    booking.status = action.payload.status;
                    booking.raw.status = action.payload.status;
                }
                if (state.selectedBooking && state.selectedBooking.id === action.payload.id) {
                    state.selectedBooking.status = action.payload.status;
                }
            })

            // 🔥 تفاصيل الحجز الفردي (جديد)
            .addCase(fetchBookingDetails.pending, (state) => {
                state.detailsStatus = "loading";
                state.selectedBooking = null;
            })
            .addCase(fetchBookingDetails.fulfilled, (state, action) => {
                state.detailsStatus = "succeeded";
                state.selectedBooking = action.payload; // حفظ تفاصيل الحجز
            })
            .addCase(fetchBookingDetails.rejected, (state, action) => {
                state.detailsStatus = "failed";
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAllOrders = (state) => state.freelancerOrders.items;
export const selectOrdersStatus = (state) => state.freelancerOrders.status;
export const selectSelectedBooking = (state) => state.freelancerOrders.selectedBooking; // 🔥 Selector جديد للتفاصيل

export default orderSlice.reducer;