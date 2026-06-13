import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import additionService from '../../../../services/companyService/additionService.js';

// جلب البيانات (كما هي)
export const fetchInitialData = createAsyncThunk('product/fetchData', async () => {
    const [categories, districts] = await Promise.all([
        additionService.getCategories(),
        additionService.getDistricts()
    ]);
    return { categories, districts };
});

// إرسال المنتج مع التوكن
export const publishProduct = createAsyncThunk('product/publish', async (payload, { getState }) => {
    const state = getState();
    console.log("Full Redux State:", state); // هذا السطر سيكشف لنا أين يختبئ التوكن

    // تأكدي من المسار الصحيح بناءً على الـ console
    const token = state.auth?.token || localStorage.getItem('token');

    return await additionService.createListing(payload, token);
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
            .addCase(publishProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(publishProduct.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(publishProduct.rejected, (state) => {
                state.isLoading = false;
            });
    }
});

export default addProductSlice.reducer;