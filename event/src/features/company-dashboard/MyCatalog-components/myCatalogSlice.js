import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myCatalogService from '../../../services/companyService/myCatalogService';

export const fetchMyProducts = createAsyncThunk('myCatalog/fetchProducts', async () => {
    return await myCatalogService.getMyProducts();
});

export const fetchMyServices = createAsyncThunk('myCatalog/fetchServices', async () => {
    return await myCatalogService.getMyServices();
});

export const fetchMyArrangements = createAsyncThunk('myCatalog/fetchArrangements', async () => {
    return await myCatalogService.getMyArrangements();
});

export const fetchProviderBookings = createAsyncThunk('myCatalog/fetchBookings', async () => {
    return await myCatalogService.getProviderBookings();
});

// 💡 ثانك جديد لجلب الفريلانسرز
export const fetchCompanyFreelancers = createAsyncThunk('myCatalog/fetchCompanyFreelancers', async () => {
    return await myCatalogService.getCompanyFreelancers();
});

export const deleteItemThunk = createAsyncThunk(
    'myCatalog/deleteItem',
    async ({ id, type }, thunkAPI) => {
        try {
            // 💡 إزالة التعليق واستدعاء دالة الحذف الحقيقية من السيرفيس
            await myCatalogService.deleteCatalogItem(id);

            // نُرجع الـ id والـ type للـ Redux ليمسحه من الشاشة
            return { id, type };
        } catch (error) {
            // 💡 التقاط رسالة الخطأ القادمة من الباك إند (مثل: "لا يمكن حذف هذه الفعالية لوجود حجوزات...")
            const errorMessage = error.response?.data?.message || "فشل الحذف بسبب خطأ في الخادم";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
const myCatalogSlice = createSlice({
    name: 'myCatalog',
    initialState: {
        products: [],
        services: [],
        arrangements: [],
        bookings: [],
        companyFreelancers: [], // 💡 مصفوفة جديدة
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProducts.fulfilled, (state, action) => { state.products = action.payload; })
            .addCase(fetchMyServices.fulfilled, (state, action) => { state.services = action.payload; })
            .addCase(fetchMyArrangements.fulfilled, (state, action) => { state.arrangements = action.payload; })
            .addCase(fetchProviderBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
            // 💡 تخزين الفريلانسرز
            .addCase(fetchCompanyFreelancers.fulfilled, (state, action) => { state.companyFreelancers = action.payload || []; })

            .addCase(deleteItemThunk.fulfilled, (state, action) => {
                const { id, type } = action.payload;

                // إزالة العنصر المحذوف من المصفوفة المناسبة فوراً
                if (type === 'arrangement') {
                    state.arrangements = state.arrangements.filter(item => item.id !== id);
                } else if (type === 'product') {
                    state.products = state.products.filter(item => item.id !== id);
                } else if (type === 'service') {
                    state.services = state.services.filter(item => item.id !== id);
                }
            });
    }
});

export default myCatalogSlice.reducer;