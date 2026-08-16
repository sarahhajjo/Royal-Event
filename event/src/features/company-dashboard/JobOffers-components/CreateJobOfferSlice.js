import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createJobOfferService, getCompanyServicesForJob } from '../../../services/companyService/jobService';

export const fetchJobServices = createAsyncThunk(
    'jobOffer/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            return await getCompanyServicesForJob();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load services');
        }
    }
);

export const submitJobOffer = createAsyncThunk(
    'jobOffer/submit',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().jobOffer;

            const paymentMap = {
                perEvent: "Per Event",
                monthly: "Monthly",
                hourly: "Hourly"
            };

            const payload = {
                service_id: state.serviceId || null,
                job_title: state.jobTitle,
                time_condition: state.timeCondition,
                event_type: state.eventType,
                job_start_date: state.jobStartDate,
                application_deadline: state.applicationDeadline,
                salary: parseFloat(state.salary) || 0,
                payment_system: paymentMap[state.paymentSystem] || state.paymentSystem,
                specific_event_association: state.specificEventAssociation,
                experience_level: state.experienceLevel,
                company_equipment_provided: state.companyEquipmentProvided,
                job_requirements_and_scope: state.jobRequirements,
                contact_info: state.contactInfo
            };

            const response = await createJobOfferService(payload);
            return response;
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join('\n');
                return rejectWithValue(errorMessages);
            }
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to publish job offer');
        }
    }
);

const initialState = {
    serviceId: '',
    servicesList: [],

    jobTitle: '',
    timeCondition: 'Permanent',
    eventType: '', // 💡 تم تفريغ القيمة لتكون جاهزة للإدخال النصي الحر
    jobStartDate: '',
    applicationDeadline: '',

    salary: '',
    paymentSystem: 'perEvent',
    specificEventAssociation: '',
    experienceLevel: 'Junior', // 💡 متوافق مع الباك إند
    companyEquipmentProvided: false,

    jobRequirements: '',
    contactInfo: '',

    status: 'idle',
    error: null,
    successMessage: '',
};

const createJobOfferSlice = createSlice({
    name: 'jobOffer',
    initialState,
    reducers: {
        setServiceId:           (state, { payload }) => { state.serviceId = payload; },
        setJobTitle:            (state, { payload }) => { state.jobTitle = payload; },
        setTimeCondition:       (state, { payload }) => { state.timeCondition = payload; },
        setEventType:           (state, { payload }) => { state.eventType = payload; },
        setJobStartDate:        (state, { payload }) => { state.jobStartDate = payload; },
        setApplicationDeadline: (state, { payload }) => { state.applicationDeadline = payload; },
        setSalary:                   (state, { payload }) => { state.salary = payload; },
        setPaymentSystem:            (state, { payload }) => { state.paymentSystem = payload; },
        setSpecificEventAssociation: (state, { payload }) => { state.specificEventAssociation = payload; },
        setExperienceLevel:          (state, { payload }) => { state.experienceLevel = payload; },
        toggleEquipmentProvided:     (state)              => { state.companyEquipmentProvided = !state.companyEquipmentProvided; },
        setJobRequirements: (state, { payload }) => { state.jobRequirements = payload; },
        setContactInfo:     (state, { payload }) => { state.contactInfo = payload; },

        resetJobOfferForm: () => initialState,
        clearJobOfferMessages: (state) => {
            state.error          = null;
            state.successMessage = '';
            state.status         = 'idle';
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchJobServices.fulfilled, (state, { payload }) => {
                state.servicesList = payload;
            })
            .addCase(submitJobOffer.pending, (state) => {
                state.status = 'loading';
                state.error  = null;
            })
            .addCase(submitJobOffer.fulfilled, (state) => {
                state.status         = 'succeeded';
                state.successMessage = 'Job offer published successfully!';
            })
            .addCase(submitJobOffer.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error  = payload;
            });
    },
});

export const {
    setServiceId, setJobTitle, setTimeCondition, setEventType,
    setJobStartDate, setApplicationDeadline,
    setSalary, setPaymentSystem, setSpecificEventAssociation,
    setExperienceLevel, toggleEquipmentProvided,
    setJobRequirements, setContactInfo,
    resetJobOfferForm, clearJobOfferMessages,
} = createJobOfferSlice.actions;

export const selectEssentialDetails = (state) => ({
    serviceId: state.jobOffer.serviceId,
    servicesList: state.jobOffer.servicesList,
    jobTitle: state.jobOffer.jobTitle,
    timeCondition: state.jobOffer.timeCondition,
    eventType: state.jobOffer.eventType,
    jobStartDate: state.jobOffer.jobStartDate,
    applicationDeadline: state.jobOffer.applicationDeadline,
});

export const selectFinancials = (state) => ({
    salary: state.jobOffer.salary,
    paymentSystem: state.jobOffer.paymentSystem,
    specificEventAssociation: state.jobOffer.specificEventAssociation,
    experienceLevel: state.jobOffer.experienceLevel,
    companyEquipmentProvided: state.jobOffer.companyEquipmentProvided,
});

export const selectRequirements = (state) => ({
    jobRequirements: state.jobOffer.jobRequirements,
    contactInfo: state.jobOffer.contactInfo,
});

export const selectJobOfferStatus = (state) => ({
    status: state.jobOffer.status,
    error: state.jobOffer.error,
    successMessage: state.jobOffer.successMessage,
});

export default createJobOfferSlice.reducer;