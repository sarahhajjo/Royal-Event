import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import additionService from '../../../../services/companyService/additionService.js';
import dayjs from 'dayjs';

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

// 💡 تعديل ثانك الفريلانسرز ليجلب التواريخ المحجوزة لكل فريلانسر
export const fetchFreelancers = createAsyncThunk('arrangement/fetchFreelancers', async () => {
    const rawContracts = await additionService.getCompanyFreelancers();

    // جلب الأيام المحجوزة لكل فريلانسر بشكل متوازي لسرعة الأداء
    const contractsWithDates = await Promise.all(rawContracts.map(async (contract) => {
        try {
            const blockedDates = await additionService.getFreelancerBlockedDates(contract.freelancer?.id);
            return { ...contract, blockedDates };
        } catch (e) {
            return { ...contract, blockedDates: [] };
        }
    }));

    return contractsWithDates;
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
        scheduleDates: null,
        freelancers: [],
        availableServices: [],
    },
    reducers: {
        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        toggleServices: (state) => { state.servicesEnabled = !state.servicesEnabled; },
        setAllStaff: (state, action) => { state.selectedStaff = action.payload; },
        setServicesEnabled: (state, action) => { state.servicesEnabled = action.payload; },
        resetArrangementState: (state) => {
            state.selectedStaff = [];
            state.scheduleDates = null;
            state.servicesEnabled = true;
        },
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
                        phone: user.phone || null,
                        email: user.email || null,

                        // 💡 تخزين التواريخ المحجوزة
                        blockedDates: contract.blockedDates || [],

                        isAvailable: true,
                        availableDates: availableDates,
                        service_name: jobOffer.job_title,
                    };
                });

                state.freelancers = mappedFreelancers;

                const titles = rawContracts.map(c => c.job_offer?.job_title).filter(Boolean);
                state.availableServices = [...new Set(titles)];
            });
    }});

export const {
    removeProduct, toggleServices, addStaff, removeStaff, setScheduleDates,
    setAllStaff, setServicesEnabled, resetArrangementState
} = arrangementSlice.actions;

// ─── 💡 خوارزمية الفلترة الذكية ───
// ─── 💡 خوارزمية الفلترة الذكية ───
const timeToMin = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

export const selectFilteredFreelancers = createSelector(
    [(state) => state.arrangement.freelancers, (state) => state.arrangement.scheduleDates],
    (freelancers, scheduleDates) => {
        if (!scheduleDates || !scheduleDates.selectionMode) return freelancers;

        // 1. تحديد التواريخ المطلوبة في التنسيق
        let requiredDates = [];
        if (scheduleDates.selectionMode === 'multiple' && scheduleDates.selectedDates?.length > 0) {
            requiredDates = scheduleDates.selectedDates;
        } else if (scheduleDates.startDate) {
            let curr = dayjs(scheduleDates.startDate);
            const end = scheduleDates.endDate ? dayjs(scheduleDates.endDate) : curr;
            while (curr.isBefore(end, 'day') || curr.isSame(end, 'day')) {
                requiredDates.push(curr.format('YYYY-MM-DD'));
                curr = curr.add(1, 'day');
            }
        }

        // 2. فحص تعارض التواريخ لكل فريلانسر
        return freelancers.map(freelancer => {
            let isAvailable = true;

            if (requiredDates.length > 0 && freelancer.blockedDates?.length > 0) {
                for (const reqDate of requiredDates) {

                    // 💡 التعديل الجذري هنا: توحيد صيغة التاريخ القادمة من الباك إند مع يوم التنسيق باستخدام dayjs!
                    const blocksOnDate = freelancer.blockedDates.filter(b =>
                        dayjs(b.blocked_date).format('YYYY-MM-DD') === reqDate
                    );

                    if (blocksOnDate.length > 0) {
                        // إذا كان التنسيق "طوال اليوم"، أي حظر في هذا اليوم يجعله غير متاح
                        if (scheduleDates.isAllDay) {
                            isAvailable = false;
                            break;
                        }

                        // إذا كان هناك شفتات، نفحص التداخل (Overlap)
                        if (scheduleDates.shiftRanges?.length > 0) {
                            for (const shift of scheduleDates.shiftRanges) {
                                const shiftStart = timeToMin(shift.start);
                                const shiftEnd = timeToMin(shift.end);

                                for (const block of blocksOnDate) {
                                    if (!block.start_time || !block.end_time) {
                                        isAvailable = false; // محجوز طوال اليوم
                                        break;
                                    }
                                    const blockStart = timeToMin(block.start_time);
                                    const blockEnd = timeToMin(block.end_time);

                                    // شرط التداخل: بداية الشفت قبل نهاية الحظر، ونهاية الشفت بعد بداية الحظر
                                    if (shiftStart < blockEnd && shiftEnd > blockStart) {
                                        isAvailable = false;
                                        break;
                                    }
                                }
                                if (!isAvailable) break;
                            }
                        } else {
                            // 💡 حماية إضافية: إذا لم يختر المستخدم شفتات ولم يحدد "طوال اليوم"،
                            // نعتبر الفريلانسر المشغول "غير متاح" حتى يقوم المستخدم بتحديد وقت آمن.
                            isAvailable = false;
                        }
                    }
                    if (!isAvailable) break;
                }
            }

            return { ...freelancer, isAvailable };
        });
    }
);

export default arrangementSlice.reducer;