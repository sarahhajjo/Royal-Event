import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import additionService from '../../../../services/companyService/additionService.js';

export const fetchProductsByType = createAsyncThunk('arrangement/fetchProducts', async () => {
    try {
        const response = await additionService.getMyProducts();
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

// 💡 1. ثانك جديد لجلب الفريلانسرز
export const fetchFreelancers = createAsyncThunk('arrangement/fetchFreelancers', async () => {
    return await additionService.getCompanyFreelancers();
});

const arrangementSlice = createSlice({
    name: 'arrangement',
    initialState: {
        products: [],
        loading: false,
        categories: [],
        districts: [],
        servicesEnabled: true,
        selectedStaff: [],
        date: null,
        scheduleDates: null,
        // 💡 2. متغيرات جديدة لتخزين بيانات الفريلانسرز والخدمات
        freelancers: [],
        availableServices: [],
    },
    reducers: {
        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        toggleServices: (state) => { state.servicesEnabled = !state.servicesEnabled; },

        // 💡 الدوال الجديدة التي نسينا إضافتها:
        setAllStaff: (state, action) => { state.selectedStaff = action.payload; },
        setServicesEnabled: (state, action) => { state.servicesEnabled = action.payload; },
        resetArrangementState: (state) => {
            state.selectedStaff = [];
            state.scheduleDates = null;
            state.servicesEnabled = true;
        },
        // ------------------------------------

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
            .addCase(fetchProductsByType.fulfilled, (state, action) => { state.products = action.payload; })
            .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
            .addCase(fetchDistricts.fulfilled, (state, action) => { state.districts = action.payload; })

            // 💡 3. تخزين الفريلانسرز واستخراج الخدمات
            .addCase(fetchFreelancers.fulfilled, (state, action) => {
                const rawContracts = action.payload || [];

                const mappedFreelancers = rawContracts.map(contract => {
                    const freelancer = contract.freelancer || {};
                    const user = freelancer.user || {};
                    const jobOffer = contract.job_offer || {};

                    const firstName = user.first_name || '';
                    const lastName = user.last_name || '';
                    const fullName = [firstName, lastName].filter(Boolean).join(' ') || freelancer.brand_name || 'Freelancer';

                    const availableDates = jobOffer.time_condition === 'Temporary'
                        ? `${jobOffer.job_start_date} to ${jobOffer.application_deadline}`
                        : 'Permanent Role';

                    return {
                        id: freelancer.id,
                        contract_id: contract.id,
                        name: fullName,
                        role: jobOffer.job_title || 'Service Provider',

                        // 💡 هنا نسحب الرقم والإيميل معاً ونحفظهما
                        phone: user.phone || null,
                        email: user.email || null,

                        isAvailable: true,
                        availableDates: availableDates,
                        service_name: jobOffer.job_title,
                        availStart: '2020-01-01',
                        availEnd: '2030-01-01'
                    };
                });

                state.freelancers = mappedFreelancers;

                const titles = rawContracts.map(c => c.job_offer?.job_title).filter(Boolean);
                state.availableServices = [...new Set(titles)];
            });
    }});
export const {
    removeProduct, toggleServices, addStaff, removeStaff, setScheduleDates,
    setAllStaff, setServicesEnabled, resetArrangementState // 💡 تأكدي من وجود هذه الـ 3 هنا!
} = arrangementSlice.actions;

export default arrangementSlice.reducer;