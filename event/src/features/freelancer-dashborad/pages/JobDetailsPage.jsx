import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import JobDetailsHeader from "../components/job-details/JobDetailsHeader.jsx";
import JobQuickInfo from "../components/job-details/JobQuickInfo.jsx";
import JobRequirements from "../components/job-details/JobRequirements.jsx";
import JobRightSidebar from "../components/job-details/JobRightSidebar.jsx";
import { fetchJobById } from "../components/job-opportunities/JobOffersSlice.js";

export default function JobDetailsPage() {
    const theme = useTheme();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedJob, isLoading, error } = useSelector((state) => state.jobs);
    const location = useLocation();
    const passedStatus = location.state?.applicationStatus;

    useEffect(() => {
        dispatch(fetchJobById(id));
    }, [dispatch, id]);

    // 👑 الستايل الزجاجي الموحد للبطاقات والحاويات
    const glassSx = {
        background: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: theme.palette.mode === 'dark' ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
    };

    if (isLoading) return (
        <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
            <Typography>جاري تحميل التفاصيل...</Typography>
        </Box>
    );

    if (error) return (
        <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'error.main' }}>
            <Typography>{error}</Typography>
        </Box>
    );

    if (!selectedJob) return null;

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Job Details" />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, md: 4, lg: 5 },
                        py: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ ...glassSx, p: { xs: 3, md: 4, lg: 5 }, display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '1152px', mx: 'auto', width: '100%' }}>
                        <JobDetailsHeader
                            title={selectedJob.job_title}
                            venue={selectedJob.specific_event_association}
                            eventType={selectedJob.event_type}
                            jobId={selectedJob.id}
                            applicationStatus={passedStatus}
                        />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                                <JobQuickInfo
                                    startDate={selectedJob.job_start_date}
                                    deadline={selectedJob.application_deadline}
                                    experience={selectedJob.experience_level}
                                    employmentType={selectedJob.time_condition}
                                />
                                <JobRequirements description={selectedJob.job_requirements_and_scope} />
                            </Box>

                            <Box>
                                <JobRightSidebar
                                    salary={selectedJob.salary}
                                    paymentSystem={selectedJob.payment_system}
                                    contactEmail={selectedJob.contact_info}
                                    equipmentProvided={selectedJob.company_equipment_provided === 1}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}