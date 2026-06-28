import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // إضافة الـ Hooks الخاصة بـ Redux

// قم بتعديل مسار الاستيراد حسب هيكلة مشروعك
import { fetchCompanyById } from "./directorySlice";

import { T, typography } from "./theme";
import IdentityCorrespondence from "./companyPro-components/IdentityCorrespondence.jsx";
import BusinessInformation from "./companyPro-components/BusinessInformation.jsx";
import SecurityAccess from "./companyPro-components/SecurityAccess.jsx";
import AcceptedListings from "./companyPro-components/AcceptedListings.jsx";
import RejectedListings from "./companyPro-components/RejectedListings.jsx";
import AddOffers from "./companyPro-components/AddOffers.jsx";
import CompanySidebar from "./companyPro-components/CompanySidebar.jsx";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const CompanyProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeNav, setActiveNav] = useState("Companies");
    const onNavClick = (item) => setActiveNav(item);

    // جلب البيانات وحالة التحميل من Redux مباشرة
    const { selectedCompany: providerData, companyLoading: loading, error } = useSelector((state) => state.directory);

    useEffect(() => {
        // بمجرد دخول الصفحة، نطلب جلب البيانات بناءً على الـ id
        if (id) {
            dispatch(fetchCompanyById(id));
        }
    }, [id, dispatch]);

    // 1. حالة التحميل
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: T.pageBg }}>
                <CircularProgress sx={{ color: T.gold }} />
            </Box>
        );
    }

    // 2. حالة وجود خطأ أو عدم وجود بيانات
    if (error || !providerData) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: T.pageBg, gap: 2 }}>
                <Typography color="error">{error || "لم يتم العثور على بيانات المزود"}</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: T.gold, color: T.gold }}>
                    العودة للقائمة
                </Button>
            </Box>
        );
    }

    // 3. عرض البيانات بعد نجاح الجلب
    return (
        <Box sx={{ display: "flex", backgroundColor: T.pageBg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Sidebar activeItem={activeNav} onNavClick={onNavClick} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column", px: { xs: 3, md: 6 }, py: { xs: 3, md: 5 }, width: "calc(100% - 240px)" }}>
                <TopBar title="Company Directory" user={{ name: "Admin", role: "Superuser" }} />

                {/* ── Back ── */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 3, mb: 3, cursor: "pointer", width: "fit-content", "&:hover span": { color: T.gold } }} onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ fontSize: 13, color: T.textMuted }} />
                    <Typography component="span" sx={{ ...typography.sectionLabel, color: T.textMuted, transition: "color 0.15s" }}>
                        BACK TO DIRECTORY
                    </Typography>
                </Box>

                {/* ── Header ── */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                    <Typography variant="h4" sx={{ ...typography.pageTitle, color: T.textPrimary }}>
                        {providerData.brand_name || providerData.name || "Company Profile"}
                    </Typography>

                </Box>

                {/* ── Layout ── */}
                {/* ── Layout المحدث ── */}
                <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} sm={4} md={3}>
                        {/* تمرير بيانات الـ profile والـ identity للسايدبار */}
                        <CompanySidebar data={{ ...providerData.profile, ...providerData.identity }} />
                    </Grid>

                    <Grid item xs={12} sm={8} md={9}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    {/* تمرير بيانات الهوية */}
                                    <IdentityCorrespondence data={providerData.identity} />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    {/* تمرير بيانات العمل */}
                                    <BusinessInformation data={providerData.business} />
                                </Grid>
                                <Grid item xs={12}>
                                    {/* تمرير بيانات الأمن */}
                                    <SecurityAccess data={providerData.security} />
                                </Grid>
                            </Grid>

                            {/* بقية القوائم */}
                            <AcceptedListings listings={[]} />
                            <RejectedListings listings={[]} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CompanyProfilePage;