import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ── Redux & Theme ─────────────────────────────────────────────────────────────
import { fetchFreelancerById } from "../directorySlice.js";
import { T, typography } from "../Theme.jsx";

// ── Layout Components ─────────────────────────────────────────────────────────
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";

// ── Profile Sub-components ────────────────────────────────────────────────────
import IdentityCorrespondence from "../companyPro-components/IdentityCorrespondence.jsx";
import ProfessionalNarrative from "../freelancerPro-components/ProfessionalNarrative.jsx";
import SecurityAccess from "../companyPro-components/SecurityAccess.jsx";
import ServiceArea from "../freelancerPro-components/ServiceArea.jsx";
import FreelancerSidebar from "../freelancerPro-components/FreelancerSidebar.jsx";

const FreelancerProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        selectedFreelancer: rawData,
        freelancerLoading: loading,
        error
    } = useSelector((state) => state.directory);

    useEffect(() => {
        if (id) {
            dispatch(fetchFreelancerById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg || "#FAF7F0" }}>
                <Sidebar activeItem="Freelancers" />
                <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                    <TopBar title="Freelancer Profile" user={{ name: "Admin", role: "Superuser" }} />
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress sx={{ color: T.gold || "#8a6f28" }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error || !rawData) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg || "#FAF7F0" }}>
                <Sidebar activeItem="Freelancers" />
                <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                    <TopBar title="Freelancer Profile" user={{ name: "Admin", role: "Superuser" }} />
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 4, mt: 8 }}>
                        <Typography color="error" variant="h6">{error || "Freelancer not found."}</Typography>
                        <Typography onClick={() => navigate(-1)} sx={{ mt: 2, cursor: "pointer", color: T.gold || "#8a6f28", fontWeight: "bold" }}>Go Back</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    // 🚀 تجهيز البيانات وتسطيحها مع تضمين التقييم، الاختصاصات، والبيانات المهمة
    const profile = rawData.profile || {};
    const identity = rawData.identity || {};
    const business = rawData.business || {};
    const security = rawData.security || {};

    const flatData = {
        ...rawData,
        ...profile,
        ...identity,
        ...business,
        ...security,

        // الصورة والسايدبار الأساسية
        avatarUrl: `https://ui-avatars.com/api/?name=${identity.first_name || 'U'}+${identity.last_name || 'U'}&background=F2EFE8&color=8a6f28&size=200&bold=true`,
        avatar_url: `https://ui-avatars.com/api/?name=${identity.first_name || 'U'}+${identity.last_name || 'U'}&background=F2EFE8&color=8a6f28&size=200&bold=true`,
        brandName: profile.brand_name || business.brand_name || "Unknown Brand",
        joinDate: profile.join_date || "Unknown",

        // 🌟 إضافة التقييم والاختصاصات والحالة المهمة
        rating: profile.rating ?? 0,
        primaryCategory: profile.primary_category || "Not Specified",
        categories: profile.categories || [],
        verificationBadge: profile.verification_badge || "UNVERIFIED",
        approvalBadge: profile.approval_badge || "PENDING",

        // الهوية والاتصال
        idNumber: business.national_id || "Not Provided",
        national_id: business.national_id || "Not Provided",
        accountStatus: security.account_status || "Unknown",
        phone: identity.phone || "Not Provided",
        phoneNumber: identity.phone || "Not Provided",
        emailVerified: security.is_email_verified,
        phoneVerified: security.is_phone_verified,
        providerVerified: security.provider_verified,
        moderationStatus: security.moderation_status,
        experienceYears: business.experience_years || 0,
        representativeRole: profile.provider_type || "FREELANCER",

        isVerified: profile.verification_badge === "VERIFIED",
        isActive: profile.is_active,
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg || "#FAF7F0", fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            <Sidebar activeItem="Freelancers" />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>

                <TopBar title="Freelancer Profile" user={{ name: "Admin", role: "Superuser" }} />

                <Box sx={{ p: { xs: 2, md: 4 }, mt: "64px" }}>

                    {/* زر العودة */}
                    <Box onClick={() => navigate("/admin-dashboard/freelancers")} sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 2.5, cursor: "pointer", width: "fit-content", "&:hover": { opacity: 0.7 } }}>
                        <ArrowBackIcon sx={{ fontSize: 13, color: T.textMuted || "#7A6F5E" }} />
                        <Typography component="span" sx={{ color: T.textMuted || "#7A6F5E", fontSize: "0.8rem", fontWeight: 600 }}>BACK TO DIRECTORY</Typography>
                    </Box>

                    {/* هيدر الصفحة */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                        <Typography variant="h4" sx={{ ...(typography?.pageTitle || {}), color: T.textPrimary || "#1C1712", fontWeight: 800 }}>
                            Freelancer Profile
                        </Typography>
                    </Box>

                    {/* الشبكة الرئيسية */}
                    <Grid container spacing={4} alignItems="flex-start">

                        {/* العمود الأيمن: السايدبار ومنطقة الخدمة */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <FreelancerSidebar data={flatData} />
                                <ServiceArea area={profile.city || profile.address_details || "Area Not Specified"} />
                            </Box>
                        </Grid>

                        {/* العمود الأيسر: التفاصيل، الاختصاصات، والتحقق */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                                <IdentityCorrespondence data={flatData} />

                                {/* عرض الاختصاصات والخبرة في قسم السرد المهني أو كبيانات إضافية */}
                                <ProfessionalNarrative
                                    bio={`Primary Category: ${flatData.primaryCategory} | Experience: ${flatData.experienceYears} years${
                                        flatData.categories.length > 1 ? ` | Other Categories: ${flatData.categories.slice(1).join(", ")}` : ""
                                    }`}
                                />

                                <SecurityAccess data={flatData} />
                            </Box>
                        </Grid>

                    </Grid>

                </Box>
            </Box>
        </Box>
    );
};

export default FreelancerProfilePage;