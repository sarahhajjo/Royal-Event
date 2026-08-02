import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

// ── Shared components & theme ────────────────────────────────────────────────
import { T, typography } from "../Theme.jsx";
import ProfileSidebar from "../userPro-components/ProfileSidebar.jsx";
import IdentityDetails from "../userPro-components/IdentityDetails.jsx";
import Correspondence from "../userPro-components/Correspondence.jsx";
// 🚀 تم إزالة استيراد Security و Region من هنا
import TopBar from "../components/TopBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import adminService from "../../../services/adminService/adminService.js";

// استيراد الخدمة لجلب البيانات


const UserProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const data = await adminService.getOrganizerById(id);
                setUserData(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Failed to load user data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg }}>
                <Sidebar activeItem="User Management" />
                <Box sx={{ flex: 1, ml: "240px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress sx={{ color: T.gold }} />
                </Box>
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg }}>
                <Sidebar activeItem="User Management" />
                <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column", p: 4, mt: 8 }}>
                    <Typography color="error" variant="h6">{error || "User not found."}</Typography>
                    <Button onClick={() => navigate(-1)} sx={{ mt: 2, width: "fit-content" }}>Go Back</Button>
                </Box>
            </Box>
        );
    }

    // 🚀 الاكتفاء بالحقول الموجودة في الباك إند فقط وتوليد صورة احترافية
    const mappedUser = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        accountId: userData.id,
        memberSince: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : "Unknown",
        avatarUrl: `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=F2EFE8&color=8a6f28&size=200&bold=true`,
    };

    const mappedIdentity = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        // 🚀 تم حذف تاريخ الميلاد
    };

    const mappedCorrespondence = {
        email: userData.email || "No Email",
        emailVerified: Boolean(userData.is_verified),
        phone: userData.phone || "No Phone",
        // 🚀 تم حذف الرقم البديل
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg }}>
            <Sidebar activeItem="User Management" />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                <TopBar title="User Profile" user={{ name: "Admin", role: "Superuser" }} />

                <Box sx={{ p: { xs: 2, md: 4 }, mt: "64px" }}>
                    <Box onClick={() => navigate("/admin-dashboard/users")} sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 2.5, cursor: "pointer", width: "fit-content" }}>
                        <ArrowBackIcon sx={{ fontSize: 13, color: T.textMuted }} />
                        <Typography component="span" sx={{ color: T.textMuted, fontSize: "0.8rem", fontWeight: 600 }}>BACK TO DIRECTORY</Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                        <Typography variant="h4" sx={{ ...typography.pageTitle, color: T.textPrimary }}>User Profile</Typography>
                    </Box>

                    <Grid container spacing={4} alignItems="flex-start">
                        <Grid item xs={12} md={4} lg={3}>
                            <ProfileSidebar user={mappedUser} />
                        </Grid>

                        <Grid item xs={12} md={8} lg={9}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                {/* 🚀 تم إزالة بطاقات Security و Region نهائياً من العرض */}
                                <IdentityDetails identity={mappedIdentity} />
                                <Correspondence correspondence={mappedCorrespondence} />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfilePage;