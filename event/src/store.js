import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
// 👑 تعديل المسار هنا بنقطة واحدة فقط لأن الملف يبدأ من مجلد src
import companyDashboardReducer from "./features/company-dashboard/companyDashboardSlice";
import directoryReducer from "./features/admin-dashboard/directorySlice";
import arrangementReducer from "./features/company-dashboard/add-components/addition_slices/arrangementSlice";
import addProductReducer from './features/company-dashboard/add-components/addition_slices/addProductSlice';
import addhallReducer from './features/company-dashboard/add-components/addition_slices/addhallSlice.js';
import jobOfferReducer from './features/company-dashboard/JobOffers-components/CreateJobOfferSlice';
import myCatalogReducer from './features/company-dashboard/MyCatalog-components/myCatalogSlice';
import providerProfileReducer from './features/company-dashboard/componyProfileSettings/providerProfileSlice.js'; // تأكدي من المسار
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

    }
});