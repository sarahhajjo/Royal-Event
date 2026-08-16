import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import additionService from '../../../../services/companyService/additionService.js';

// جلب البيانات الأساسية
export const fetchInitialData = createAsyncThunk('product/fetchData', async () => {
    const [categories, districts] = await Promise.all([
        additionService.getCategories(),
        additionService.getDistricts()
    ]);
    return { categories, districts };
});

// إضافة منتج جديد
export const publishProduct = createAsyncThunk('product/publish', async (payload, { getState }) => {
    const state = getState();
    const token = state.auth?.token || localStorage.getItem('token');
    return await additionService.createListing(payload, token);
});

// 💡 تعديل منتج موجود
export const updateProduct = createAsyncThunk('product/update', async ({ id, payload }, { getState }) => {
    const state = getState();
    const token = state.auth?.token || localStorage.getItem('token');
    return await additionService.updateListing(id, payload, token);
});

const addProductSlice = createSlice({
    name: 'addProduct',
    initialState: { categories: [], districts: [], isLoading: false, success: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialData.fulfilled, (state, action) => {
                state.categories = action.payload.categories;
                state.districts = action.payload.districts;
            })
            // Publish Cases
            .addCase(publishProduct.pending, (state) => { state.isLoading = true; })
            .addCase(publishProduct.fulfilled, (state) => { state.isLoading = false; state.success = true; })
            .addCase(publishProduct.rejected, (state) => { state.isLoading = false; })
            // 💡 Update Cases
            .addCase(updateProduct.pending, (state) => { state.isLoading = true; })
            .addCase(updateProduct.fulfilled, (state) => { state.isLoading = false; state.success = true; })
            .addCase(updateProduct.rejected, (state) => { state.isLoading = false; });
    }
});

export default addProductSlice.reducer;