import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AddProductPage from './features/company-dashboard/add-components/AddProductPage.jsx'; // 🔗 استدعاء واجهة المنتجات
import CompanyDashboardPage from './features/company-dashboard/CompanyDashboardPage';
import CompanyDirectory from "./features/admin-dashboard/CompanyDirectory.jsx";
import PublishHallPage from "./features/company-dashboard/add-components/PublishHallPage.jsx";
function App() {
  return (
      <Router>
        <Routes>
          {/* البوابات الافتتاحية للموقع */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />

          {/* لوحة تحكم الشركات - واجهة إضافة المنتجات الحالية */}
          <Route path="/dashboard" element={<AddProductPage />} />

          {/* إعادة التوجيه التلقائي للمسارات غير المعرفة */}
          <Route path="*" element={<Navigate to="/" />} />
            <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
            <Route path="/company-dashboard/publish-hall" element={<PublishHallPage />} />
            <Route path="/admin-dashboard" element={<CompanyDirectory/>} />
        </Routes>
      </Router>
  );
}

export default App;