import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AddProductPage from './features/company-dashboard/add-components/AddProductPage.jsx';
import CompanyDashboardPage from './features/company-dashboard/CompanyDashboardPage';
import PublishHallPage from "./features/company-dashboard/add-components/PublishHallPage.jsx";

// 🔗 استدعاء واجهات لوحة تحكم الأدمن
import CompanyDirectory from "./features/admin-dashboard/CompanyDirectoryPage.jsx";
import FreelancerDirectoryPage from "./features/admin-dashboard/FreelancerDirectoryPage.jsx"; // أضف هذا
import UserManagementPage from "./features/admin-dashboard/UserManagementPage.jsx"; // أضف هذا

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/dashboard" element={<AddProductPage />} />
                <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
                <Route path="/company-dashboard/publish-hall" element={<PublishHallPage />} />

                {/* مسارات لوحة تحكم الأدمن */}
                <Route path="/admin-dashboard" element={<CompanyDirectory/>} />
                <Route path="/admin-dashboard/freelancers" element={<FreelancerDirectoryPage/>} />
                <Route path="/admin-dashboard/users" element={<UserManagementPage/>} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;