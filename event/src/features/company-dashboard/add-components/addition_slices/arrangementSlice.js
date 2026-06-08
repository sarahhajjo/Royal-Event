import { createSlice } from '@reduxjs/toolkit';

const arrangementSlice = createSlice({
    name: 'arrangement',
    initialState: {
        products: [{ id: 1, name: 'Velvet Lounge Chair', qty: 12 }, { id: 2, name: 'Crystal Chandelier', qty: 4 }],
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
        }

    }
});

export const { removeProduct, toggleServices, addStaff,removeStaff } = arrangementSlice.actions;
export default arrangementSlice.reducer;