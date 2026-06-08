import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
// 👑 تعديل المسار هنا بنقطة واحدة فقط لأن الملف يبدأ من مجلد src
import companyDashboardReducer from "./features/company-dashboard/companyDashboardSlice";
import directoryReducer from "./features/admin-dashboard/directorySlice";
import arrangementReducer from "./features/company-dashboard/add-components/addition_slices/arrangementSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        companyDashboard: companyDashboardReducer,
        directory: directoryReducer,
        arrangement: arrangementReducer,
    }
});