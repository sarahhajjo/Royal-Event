import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { T, typography } from "./Theme.jsx";
import ProfileSidebar from "./userPro-components/ProfileSidebar.jsx";
import IdentityDetails from "./userPro-components/IdentityDetails.jsx";
import Correspondence from "./userPro-components/Correspondence.jsx";
import {Security} from "@mui/icons-material";
import Region from "./userPro-components/Region.jsx";
import TopBar from "./components/TopBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import {useNavigate, useParams} from "react-router-dom";



// ─── Mock data ── replace with useSelector when you connect Redux ─────────────
const mockUser = {
    firstName: "Julian",
    lastName: "Thorne",
    accountId: "AR-8829-TH",
    memberSince: "Oct 2021",
    avatarUrl: null,
};

const mockIdentity = {
    firstName: "Julian",
    lastName: "Thorne",
    birthDate: "March 14, 1978",
};

const mockCorrespondence = {
    email: "j.thorne@aurelianreserve.com",
    emailVerified: true,
    phone: "+44 20 7946 0128",
    secondaryContact: null,
};

const mockSecurity = {
    password: "mysecretpassword",
    lastChanged: "January 15, 2024",
};

const mockRegion = {
    province: "Damascus",
};
// ─────────────────────────────────────────────────────────────────────────────
const UserProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        // 1. الحاوية الأساسية للصفحة (تغلف كل شيء)
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg }}>

            {/* 2. السايدبار الثابت */}
            <Sidebar activeItem="User Management" />

            {/* 3. حاوية المحتوى الرئيسي */}
            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>

                {/* 4. التوب بار */}
                <TopBar title="User Profile" user={{ name: "Admin", role: "Superuser" }} />

                {/* 5. محتوى البروفايل (مع mt للنزول تحت التوب بار) */}
                <Box sx={{ p: { xs: 2, md: 4 }, mt: "64px" }}>

                    {/* زر العودة */}
                    <Box onClick={() => navigate("/admin-dashboard/users")} sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 2.5, cursor: "pointer", width: "fit-content" }}>
                        <ArrowBackIcon sx={{ fontSize: 13, color: T.textMuted }} />
                        <Typography component="span" sx={{ color: T.textMuted }}>BACK TO DIRECTORY</Typography>
                    </Box>

                    {/* هيدر الصفحة */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                        <Typography variant="h4" sx={{ ...typography.pageTitle, color: T.textPrimary }}>User Profile</Typography>
                        {/* الأزرار هنا... */}
                    </Box>

                    {/* الشبكة الرئيسية للمكونات (Grid) */}
                    {/* ── Main layout ── */}
                    <Grid container spacing={4} alignItems="flex-start">

                        {/* 1. السايدبار (على اليمين) */}
                        <Grid item xs={12} md={4} lg={3}>
                            <ProfileSidebar user={mockUser} />
                        </Grid>

                        {/* 2. العمود الرئيسي للمعلومات (على اليسار) */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                                {/* Identity & Correspondence يأخذان العرض كاملاً */}
                                <IdentityDetails identity={mockIdentity} />
                                <Correspondence correspondence={mockCorrespondence} />

                                {/* Security و Region جنباً إلى جنب في الأسفل */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Security security={mockSecurity} />
                                    </Grid>
                                        <Grid item xs={12} sm={6}>
                                        <Region region={mockRegion} />
                                    </Grid>
                                </Grid>

                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfilePage;