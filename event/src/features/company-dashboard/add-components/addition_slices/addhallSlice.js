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

// داخل addhallSlice.js
export const publishHall = createAsyncThunk('hall/publish', async (payload) => {
    return await additionService.createListing(payload);
});
const addhallSlice = createSlice({
    name: 'addhall',
    initialState: { categories: [], districts: [], isLoading: false, success: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialData.fulfilled, (state, action) => {
                state.categories = action.payload.categories;
                state.districts = action.payload.districts;
            })
            .addCase(publishHall.pending, (state) => { state.isLoading = true; })
            .addCase(publishHall.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            });
    }
});
export default addhallSlice.reducer;