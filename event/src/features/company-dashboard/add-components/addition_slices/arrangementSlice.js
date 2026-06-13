import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import additionService from '../../../../services/companyService/additionService.js';

// ثانك لجلب المنتجات وتصفيتها
export const fetchProductsByType = createAsyncThunk('arrangement/fetchProducts', async () => {
    const data = await additionService.getMyListings(); // نفترض أنها تجلب كل الـ Listings
    // الفلترة هنا بناءً على النوع المطلوب
    return data.filter(item => item.type === 'physical_product');
});
const arrangementSlice = createSlice({
    name: 'arrangement',
    initialState: {
        products: [], // نبدأ بمصفوفة فارغة
        loading: false,
        servicesEnabled: true,
        selectedStaff: [],
        date: null
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

    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductsByType.fulfilled, (state, action) => {
            state.products = action.payload; // تحديث المصفوفة بالمنتجات المفلترة
        });
    }
});

export const { removeProduct, toggleServices, addStaff, removeStaff } = arrangementSlice.actions;
export default arrangementSlice.reducer;