import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
// 👑 تعديل المسار هنا بنقطة واحدة فقط لأن الملف يبدأ من مجلد src
import companyDashboardReducer from "./features/company-dashboard/companyDashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        companyDashboard: companyDashboardReducer,
    }
});