import React from 'react';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import LoginPage from './features/auth/LoginPage';

import RegisterPage from './features/auth/RegisterPage';

import AddProductPage from './features/company-dashboard/add-components/AddProductPage.jsx';

import CompanyDashboardPage from './features/company-dashboard/CompanyDashboardPage';

import PublishHallPage from "./features/company-dashboard/add-components/PublishHallPage.jsx";


// 🔗 استدعاء واجهات لوحة تحكم الأدمن

import CompanyDirectory from "./features/admin-dashboard/CompanyDirectoryPage.jsx";

import FreelancerDirectoryPage from "./features/admin-dashboard/FreelancerDirectoryPage.jsx"; // أضف هذا

import UserManagementPage from "./features/admin-dashboard/UserManagementPage.jsx";

import UserProfilePage from "./features/admin-dashboard/UserProfilePage.jsx";

import CompanyProfilePage from "./features/admin-dashboard/CompanyProfilePage.jsx"; // أضف هذا
import ApprovalQueuePage from "./features/admin-dashboard/ApprovalQueuePage.jsx";
import FreelancerProfilePage from "./features/admin-dashboard/FreelancerProfilePage.jsx";
import DashboardPage from "./features/admin-dashboard/DashboardPage.jsx";
import FreelancerDashboardPage from "./features/freelancer-dashborad/pages/FreelancerDashboardPage.jsx";
import FreelancerAddProductPage from "./features/freelancer-dashborad/pages/FreelancerAddProductPage.jsx";

function App() {

    return (

        <Router>

            <Routes>

                <Route path="/" element={<LoginPage/>}/>

                <Route path="/signup" element={<RegisterPage/>}/>

                <Route path="/dashboard" element={<AddProductPage/>}/>

                <Route path="/company-dashboard" element={<CompanyDashboardPage/>}/>

                <Route path="/company-dashboard/publish-hall" element={<PublishHallPage/>}/>


                {/* مسارات لوحة تحكم الأدمن */}

                <Route path="/admin-dashboard" element={<DashboardPage/>}/>
                <Route path="/admin-dashboard/companies" element={<CompanyDirectory/>}/>
                <Route path="/admin-dashboard/company/:id" element={<CompanyProfilePage/>}/>
                <Route path="/admin-dashboard/freelancers" element={<FreelancerDirectoryPage/>}/>
                <Route path="/admin-dashboard/freelancers/:id" element={<FreelancerProfilePage/>}/>
                <Route path="/admin-dashboard/users" element={<UserManagementPage/>}/>
                <Route path="/admin-dashboard/user/:id" element={<UserProfilePage/>}/>
                <Route path="/admin-dashboard/approvals" element={<ApprovalQueuePage/>}/>

                {/*<Route path="/admin-dashboard/company" element={<CompanyDirectory/>} />*/}

                <Route path="/admin-dashboard/company/:id" element={<CompanyProfilePage/>}/>


                <Route path="/admin-dashboard/freelancers/:id" element={<FreelancerProfilePage/>}/>

                <Route path="/freelancer-dashboard" element={<FreelancerDashboardPage/>}/>
                <Route path="/freelancer-dashboard/add-product" element={<FreelancerAddProductPage/>}/>

                <Route path="*" element={<Navigate to="/"/>}/>

            </Routes>

        </Router>

    );

}


export default App;
