import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import companyDashboardReducer from "./features/company-dashboard/companyDashboardSlice";
import directoryReducer from "./features/admin-dashboard/directorySlice";
import arrangementReducer from "./features/company-dashboard/add-components/addition_slices/arrangementSlice";
import addProductReducer from './features/company-dashboard/add-components/addition_slices/addProductSlice';
import addhallReducer from './features/company-dashboard/add-components/addition_slices/addhallSlice.js';
import jobOfferReducer from './features/company-dashboard/JobOffers-components/CreateJobOfferSlice';
import myCatalogReducer from './features/company-dashboard/MyCatalog-components/myCatalogSlice';
import providerProfileReducer from './features/company-dashboard/componyProfileSettings/providerProfileSlice.js';
import providerProfileReducer from './features/company-dashboard/componyProfileSettings/providerProfileSlice.js'; // تأكدي من المسار
import freelancerOfferReducer from './features/freelancer-dashborad/components/add-service/ServicesSlice.js'
import OffersSliceReducer from "./features/freelancer-dashborad/components/offers/OffersSlice.js";
import notificationReducer from './notificationSlice';
import requestReducer from './features/company-dashboard/Request-components/RequestSlice';
import jobManagementReducer from './features/company-dashboard/JobOfferAplicants/jobManagementSlice';
import jobApplicantsReducer from './features/company-dashboard/JobApplicants/JobApplicantsSlice';

// 💡 استيراد الـ Slice الجديد
import myCalendarReducer from './features/company-dashboard/MyCalender/MyCalendarSlice';

import ServiceDetailsSliceReducer from './features/freelancer-dashborad/components/service-details/ServiceDetailsSlice.js';
import JobOffersReducer from './features/freelancer-dashborad/components/job-opportunities/JobOffersSlice.js'
import approvalReducer from './features/admin-dashboard/approvalsSlice.js';
import paymentsReducer from "./features/admin-dashboard/paymentsSlice";
import orderReducer from "./features/freelancer-dashborad/components/orders/OrdersSlice.js";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        companyDashboard: companyDashboardReducer,
        directory: directoryReducer,
        arrangement: arrangementReducer,
        addProduct: addProductReducer,
        addhall: addhallReducer,
        jobOffer: jobOfferReducer,
        myCatalog: myCatalogReducer,
        providerProfile: providerProfileReducer,
        notifications: notificationReducer,
        freelancerOffer: freelancerOfferReducer,
        OffersSlice :OffersSliceReducer,
        serviceDetails : ServiceDetailsSliceReducer,
        jobs:JobOffersReducer,
        approvals: approvalReducer,
        payments: paymentsReducer,
        freelancerOrders: orderReducer,
        requests: requestReducer,
        jobManagement: jobManagementReducer,
        jobApplicants: jobApplicantsReducer,

        // 💡 تسجيل الـ Reducer هنا
        myCalendar: myCalendarReducer,
    }
});