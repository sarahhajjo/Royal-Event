    import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
    import additionService from '../../../../services/companyService/additionService.js';

    // ثانك لجلب المنتجات وتفاصيلها بناءً على الـ ID الأساسي
    // ثانك لجلب المنتجات وتفاصيلها
    export const fetchProductsByType = createAsyncThunk('arrangement/fetchProducts', async () => {
        try {
            // الباك إند صار يرجع المنتجات مجهزة 100%، ما عاد نحتاج نعمل طلبات إضافية!
            const response = await additionService.getMyProducts();

            // استخراج مصفوفة المنتجات من الـ JSON
            const products = response.data?.data || response.data || response;

            return Array.isArray(products) ? products : [];

        } catch (error) {
            console.error("Error fetching detailed products:", error);
            return [];
        }
    });
    export const fetchCategories = createAsyncThunk('arrangement/fetchCategories', async () => {
        return await additionService.getCategories();
    });

    export const fetchDistricts = createAsyncThunk('arrangement/fetchDistricts', async () => {
        return await additionService.getDistricts();
    });
    const arrangementSlice = createSlice({
        name: 'arrangement',
        initialState: {
            products: [],
            loading: false,
            categories: [], // 👈 إضافة القوائم هنا
            districts: [],
            servicesEnabled: true,
            selectedStaff: [],
            date: null,
            scheduleDates: null,
        },
        reducers: {
            removeProduct: (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
            },
            toggleServices: (state) => { state.servicesEnabled = !state.servicesEnabled; },
            addStaff: (state, action) => { state.selectedStaff.push(action.payload); },
            removeStaff: (state, action) => {
                state.selectedStaff = state.selectedStaff.filter(staff => staff.id !== action.payload);
            },
            setScheduleDates: (state, action) => {
                state.scheduleDates = action.payload;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchProductsByType.fulfilled, (state, action) => {
                state.products = action.payload; // تحديث المصفوفة بالمنتجات الكاملة
            })
        .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
                .addCase(fetchDistricts.fulfilled, (state, action) => { state.districts = action.payload; });
        }

    });

    export const { removeProduct, toggleServices, addStaff, removeStaff, setScheduleDates } = arrangementSlice.actions;
    export default arrangementSlice.reducer;