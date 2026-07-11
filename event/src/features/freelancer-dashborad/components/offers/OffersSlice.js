import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import freelancerCatalogService from "../../../../services/freelancerService/freelancerCatalogService.js"

// دالة لجلب البيانات
export const fetchListings = createAsyncThunk("catalog/fetchAll", async () => {
    return await freelancerCatalogService.getMyListings();
});

const OffersSlice = createSlice({
    name: "catalog",
    initialState: { offers: [], isLoading: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => { state.isLoading = true; })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.offers = Array.isArray(action.payload) ? action.payload : [];
            });
    }
});

export default OffersSlice.reducer;