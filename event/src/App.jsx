import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';

import AddProductPage from './features/company-dashboard/add-components/AddProductPage.jsx';
import CompanyDashboardPage from './features/company-dashboard/CompanyDashboardPage';
import PublishHallPage from "./features/company-dashboard/add-components/PublishHallPage.jsx";

// 🔗 استدعاء واجهات لوحة تحكم الأدمن
import CompanyDirectory from "./features/admin-dashboard/pages/CompanyDirectoryPage.jsx";
import FreelancerDirectoryPage from "./features/admin-dashboard/pages/FreelancerDirectoryPage.jsx";
import UserManagementPage from "./features/admin-dashboard/pages/UserManagementPage.jsx";
import UserProfilePage from "./features/admin-dashboard/pages/UserProfilePage.jsx";
import CompanyProfilePage from "./features/admin-dashboard/pages/CompanyProfilePage.jsx";
import ApprovalQueuePage from "./features/admin-dashboard/pages/ApprovalQueuePage.jsx";
import FreelancerProfilePage from "./features/admin-dashboard/pages/FreelancerProfilePage.jsx";
import DashboardPage from "./features/admin-dashboard/pages/DashboardPage.jsx";
import PaymentApprovalsPage from "./features/admin-dashboard/pages/PaymentApprovalsPage.jsx";

// 🔗 استدعاء واجهات الفريلانسر
import FreelancerDashboardPage from "./features/freelancer-dashborad/pages/FreelancerDashboardPage.jsx";
import FreelancerAddServicePage from "./features/freelancer-dashborad/pages/FreelancerAddServicePage.jsx";
import OrderManagementPage from "./features/freelancer-dashborad/pages/OrderManagementPage.jsx";
import OfferManagementPage from "./features/freelancer-dashborad/pages/OfferManagementPage.jsx";
import ServiceDetailsPage from "./features/freelancer-dashborad/pages/ServiceDetailsPage.jsx";
import JobOpportunitiesPage from "./features/freelancer-dashborad/pages/JobOpportunitiesPage.jsx";
import JobDetailsPage from "./features/freelancer-dashborad/pages/JobDetailsPage.jsx";
import MyJobsPage from "./features/freelancer-dashborad/pages/MyJobsPage.jsx";
import BookingDetailsPage from "./features/freelancer-dashborad/pages/BookingDetailsPage.jsx";
import EditServicePage from "./features/freelancer-dashborad/pages/EditServicePage.jsx";
import MyCalendarDashboard from "./features/freelancer-dashborad/pages/Mycalendardashboard.jsx";

// 👑 استيراد واجهة البروفايل الشخصي الجديدة للفريلانسر
import MyProfilePage from "./features/freelancer-dashborad/pages/MyProfilePage.jsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<RegisterPage/>}/>
                <Route path="/dashboard" element={<AddProductPage/>}/>
                <Route path="/company-dashboard/*" element={<CompanyDashboardPage />} />

                {/* مسارات لوحة تحكم الأدمن */}
                <Route path="/admin-dashboard" element={<DashboardPage/>}/>
                <Route path="/admin-dashboard/companies" element={<CompanyDirectory/>}/>
                <Route path="/admin-dashboard/company/:id" element={<CompanyProfilePage/>}/>
                <Route path="/admin-dashboard/freelancers" element={<FreelancerDirectoryPage/>}/>
                <Route path="/admin-dashboard/freelancers/:id" element={<FreelancerProfilePage/>}/>
                <Route path="/admin-dashboard/users" element={<UserManagementPage/>}/>
                <Route path="/admin-dashboard/user/:id" element={<UserProfilePage/>}/>
                <Route path="/admin-dashboard/approvals" element={<ApprovalQueuePage/>}/>
                <Route path={"/admin-dashboard/finances"} element={<PaymentApprovalsPage/>}/>
                <Route path="/admin-dashboard/company/:id" element={<CompanyProfilePage/>}/>
                <Route path="/admin-dashboard/freelancers/:id" element={<FreelancerProfilePage/>}/>

                {/* مسارات الفريلانسر */}
                <Route path="/freelancer-dashboard" element={<FreelancerDashboardPage/>}/>
                <Route path="/add-service" element={<FreelancerAddServicePage/>}/>
                <Route path="/edit-service/:id" element={<EditServicePage />} />
                <Route path="/order-managment" element={<OrderManagementPage/>}/>
                <Route path="/order-managment/:id" element={<BookingDetailsPage />} />
                <Route path="/freelancer-offer" element={<OfferManagementPage/>}/>
                <Route path="/service_detail/:serviceId" element={<ServiceDetailsPage/>}/>
                <Route path="/jobs" element={<JobOpportunitiesPage/>}/>
                <Route path="/jobs/:id" element={<JobDetailsPage/>}/>
                <Route path="/my-jobs" element={<MyJobsPage/>}/>
                <Route path="/freelancer-calendar" element={<MyCalendarDashboard />} />

                {/* 👑 مسار صفحة البروفايل الجديدة */}
                <Route path="/my-profile" element={<MyProfilePage/>}/>

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
}

export default App;