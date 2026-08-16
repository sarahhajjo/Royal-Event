import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCompanyById } from "../directorySlice.js";


import { T, typography } from "../Theme.jsx";
import IdentityCorrespondence from "../companyPro-components/IdentityCorrespondence.jsx";
import BusinessInformation from "../companyPro-components/BusinessInformation.jsx";
import SecurityAccess from "../companyPro-components/SecurityAccess.jsx";
import AcceptedListings from "../companyPro-components/AcceptedListings.jsx";
import RejectedListings from "../companyPro-components/RejectedListings.jsx";
import CompanySidebar from "../companyPro-components/CompanySidebar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import adminService from "../../../services/adminService/adminService.js";

const CompanyProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeNav, setActiveNav] = useState("Companies");
    const onNavClick = (item) => setActiveNav(item);

    // حالات تخزين السايدرات
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [seedersLoading, setSeedersLoading] = useState(true); // 🚀 حالة تحميل لضمان جلب المناطق والأصناف

    const { selectedCompany: rawData, companyLoading: loading, error } = useSelector((state) => state.directory);

    useEffect(() => {
        if (id) {
            dispatch(fetchCompanyById(id));
        }

        const fetchSeeders = async () => {
            try {
                setSeedersLoading(true);
                // 🚀 استخدام adminService بدلاً من axios المباشر
                const distData = await adminService.getDistricts();
                const catData = await adminService.getCategories();

                setDistricts(Array.isArray(distData) ? distData : []);
                setCategories(Array.isArray(catData) ? catData : []);
            } catch (err) {
                console.error("Error fetching seeders:", err);
            } finally {
                setSeedersLoading(false);
            }
        };

        fetchSeeders();
    }, [id, dispatch]);

    // 🚀 لن يتم عرض الصفحة حتى يكتمل جلب بيانات الشركة + السايدرات معاً
    if (loading || seedersLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: T.pageBg }}>
                <CircularProgress sx={{ color: T.gold }} />
            </Box>
        );
    }

    if (error || !rawData) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: T.pageBg, gap: 2 }}>
                <Typography color="error">{error || "لم يتم العثور على بيانات المزود"}</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)} sx={{ borderColor: T.gold, color: T.gold }}>
                    العودة للقائمة
                </Button>
            </Box>
        );
    }

    const profile = rawData.profile || {};
    const identity = rawData.identity || {};
    const business = rawData.business || {};
    const security = rawData.security || {};

    // 🚀 مطابقة المنطقة
    const matchedDistrict = districts.find((d) => String(d.id) === String(profile.district_id));
    const finalCity = matchedDistrict ? (matchedDistrict.name || matchedDistrict.name_ar || matchedDistrict.title) : (profile.city || "Not Specified");

    // 🚀 مطابقة الصنف (إذا كان موجوداً كرقم)
    const matchedCategory = categories.find((c) => String(c.id) === String(profile.primary_category));
    const finalCategory = matchedCategory ? (matchedCategory.name || matchedCategory.name_ar) : (profile.primary_category || "Not Specified");

    // دمج البيانات
    const flatData = {
        ...rawData,
        ...profile,
        ...identity,
        ...business,
        ...security,

        avatarUrl: `https://ui-avatars.com/api/?name=${identity.first_name || 'C'}+${identity.last_name || 'C'}&background=F2EFE8&color=8a6f28&size=200&bold=true`,
        avatar_url: `https://ui-avatars.com/api/?name=${identity.first_name || 'C'}+${identity.last_name || 'C'}&background=F2EFE8&color=8a6f28&size=200&bold=true`,
        brandName: profile.brand_name || business.brand_name || "Company Profile",
        joinDate: profile.join_date || "Unknown",

        city: finalCity,
        location: finalCity,
        primaryCategory: finalCategory,
        primary_category: finalCategory,

        firstName: identity.first_name || "",
        lastName: identity.last_name || "",
        email: identity.email || "No Email Provided",
        phone: identity.phone || "Not Provided",
        representativeRole: profile.provider_type ? profile.provider_type.toUpperCase() : "COMPANY",
        language: identity.language || "ar",

        accountStatus: security.account_status || "Unknown",
        emailVerified: security.is_email_verified,
        phoneVerified: security.is_phone_verified,
        providerVerified: security.provider_verified,
        moderationStatus: security.moderation_status,
        verificationBadge: profile.verification_badge || "UNVERIFIED",
        approvalBadge: profile.approval_badge || "PENDING",
        isVerified: profile.verification_badge === "VERIFIED",
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: T.pageBg, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Sidebar activeItem={activeNav} onNavClick={onNavClick} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column", px: { xs: 3, md: 6 }, py: { xs: 3, md: 5 }, width: "calc(100% - 240px)" }}>
                <TopBar title="Company Directory" user={{ name: "Admin", role: "Superuser" }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 3, mb: 3, cursor: "pointer", width: "fit-content", "&:hover span": { color: T.gold } }} onClick={() => navigate(-1)}>
                    <ArrowBackIcon sx={{ fontSize: 13, color: T.textMuted }} />
                    <Typography component="span" sx={{ ...typography.sectionLabel, color: T.textMuted, transition: "color 0.15s" }}>
                        BACK TO DIRECTORY
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                    <Typography variant="h4" sx={{ ...typography.pageTitle, color: T.textPrimary }}>
                        {flatData.brandName}
                    </Typography>
                </Box>

                <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} sm={4} md={3}>
                        <CompanySidebar data={flatData} />
                    </Grid>

                    <Grid item xs={12} sm={8} md={9}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <IdentityCorrespondence data={flatData} />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <BusinessInformation data={flatData} />
                                </Grid>
                                <Grid item xs={12}>
                                    <SecurityAccess data={flatData} />
                                </Grid>
                            </Grid>

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