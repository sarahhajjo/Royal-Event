import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, CircularProgress, Typography, Button } from "@mui/material";
import { fetchFreelancerById } from "./directorySlice.js";

import IdentityCorrespondence from "./companyPro-components/IdentityCorrespondence.jsx";
import ProfessionalNarrative from "./freelancerPro-components/ProfessionalNarrative.jsx";
import SecurityAccess from "./companyPro-components/SecurityAccess.jsx";
import ServiceArea from "./freelancerPro-components/ServiceArea.jsx";
import FreelancerSidebar from "./freelancerPro-components/FreelancerSidebar.jsx";
import { T } from "./Theme"; // تأكد من استيراد الثيم إذا أردت استخدامه في التحميل

const FreelancerProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ استخراج حالة التحميل والخطأ بجانب البيانات
    const {
        selectedFreelancer: data,
        freelancerLoading: loading,
        error
    } = useSelector((state) => state.directory);

    useEffect(() => {
        if (id) {
            dispatch(fetchFreelancerById(id));
        }
    }, [dispatch, id]);

    // 1. معالجة حالة التحميل (لكي لا يقرأ data قبل وصولها)
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress sx={{ color: "#C5A059" }} />
            </Box>
        );
    }

    // 2. معالجة حالة الخطأ أو عدم وجود بيانات بعد التحميل
    if (error || !data) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: 2 }}>
                <Typography color="error">{error || "لم يتم العثور على بيانات الفريلانسر"}</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)}>العودة للقائمة</Button>
            </Box>
        );
    }

    // 3. عرض البيانات بأمان
    return (
        <Box sx={{ display: "flex", p: 4, bgcolor: "#F9F7F2", minHeight: "100vh" }}>
            <Grid container spacing={4}>
                {/* العمود الأيمن */}
                <Grid item xs={12} md={3}>
                    <FreelancerSidebar data={data} />
                    <Box mt={3}>
                        <ServiceArea area={data.service_area} />
                    </Box>
                </Grid>

                {/* العمود الأيسر */}
                <Grid item xs={12} md={9}>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <IdentityCorrespondence data={data} />
                        <ProfessionalNarrative bio={data.bio} />
                        <SecurityAccess data={data} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FreelancerProfilePage;