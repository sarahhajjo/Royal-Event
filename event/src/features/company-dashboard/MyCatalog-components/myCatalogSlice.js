import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import myCatalogService from '../../../services/companyService/myCatalogService';

export const fetchMyProducts = createAsyncThunk('myCatalog/fetchProducts', async (_, thunkAPI) => {
    return await myCatalogService.getMyProducts();
});

export const fetchMyServices = createAsyncThunk('myCatalog/fetchServices', async (_, thunkAPI) => {
    return await myCatalogService.getMyServices();
});

// 💡 الأكشن الجديد
export const fetchMyArrangements = createAsyncThunk('myCatalog/fetchArrangements', async (_, thunkAPI) => {
    return await myCatalogService.getMyArrangements();
});

const myCatalogSlice = createSlice({
    name: 'myCatalog',
    initialState: {
        products: [],
        services: [],
        arrangements: [], // 💡 مصفوفة التنسيقات
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProducts.fulfilled, (state, action) => { state.products = action.payload; })
            .addCase(fetchMyServices.fulfilled, (state, action) => { state.services = action.payload; })
            // 💡 حفظ التنسيقات
            .addCase(fetchMyArrangements.fulfilled, (state, action) => { state.arrangements = action.payload; });
    }
});

export default myCatalogSlice.reducer;