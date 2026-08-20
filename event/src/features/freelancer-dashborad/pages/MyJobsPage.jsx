import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import freelancerJobService from "../../../services/freelancerService/freelancerJobService.js";
import JobFiltersBar from "../components/job-opportunities/JobFiltersBar.jsx";
import MyJobApplicationCard from "../components/my-jop/MyJobApplicationCard.jsx";

const mapApplication = (item) => {
    const offer = item.job_offer || {};

    return {
        id: item.id,
        jobOfferId: offer.id,
        venue: offer.specific_event_association || "—",
        provider: offer.provider?.brand_name,
        title: offer.job_title || "Untitled Role",
        timeCondition: offer.time_condition,
        status: item.status,
        salary: offer.salary,
        currency: "SAR",
        startDate: offer.job_start_date,
        experience: offer.experience_level,
        deadline: offer.application_deadline,
        eventType: offer.event_type,
        requirements: offer.job_requirements_and_scope,
        contactEmail: offer.contact_info,
    };
};

const DEFAULT_FILTERS = {
    search: "",
    experience: "All Levels",
    eventType: "All Events",
    employmentType: "All Types",
};

export default function MyJobsPage() {
    const theme = useTheme();
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        let isMounted = true;

        const loadApplications = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const rawItems = await freelancerJobService.getMyAppliedJobs();
                if (isMounted) setApplications((rawItems || []).map(mapApplication));
            } catch (err) {
                if (isMounted) setError(err.response?.data?.message || err.message || "Failed to load your job applications.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadApplications();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter((job) => {
            const matchesSearch = job.title
                .toLowerCase()
                .includes(filters.search.trim().toLowerCase());

            const matchesExperience =
                filters.experience === "All Levels" || job.experience === filters.experience;

            const matchesEmployment =
                filters.employmentType === "All Types" || job.timeCondition === filters.employmentType;

            return matchesSearch && matchesExperience && matchesEmployment;
        });
    }, [applications, filters]);

    const handleViewDetails = (job) => {
        console.log("View application details:", job.id);
    };

    // 👑 الستايل الزجاجي الموحد المتوافق مع باقي الصفحات
    const glassSx = {
        background: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: theme.palette.mode === 'dark' ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
    };

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
                <Header title="My Jobs" />

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
                    <Box sx={{ ...glassSx, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                        <PageBreadcrumb
                            title="My Jobs"
                            subtitle="Track the status of every job you've applied to."
                        />

                        <JobFiltersBar filters={filters} onChange={setFilters} />

                        {isLoading && (
                            <Box sx={{ p: 5, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: theme.palette.divider }}>
                                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                    Loading your applications...
                                </Typography>
                            </Box>
                        )}

                        {error && !isLoading && (
                            <Box sx={{ p: 5, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: 'error.main' }}>
                                <Typography sx={{ fontSize: '0.9rem', color: 'error.main' }}>
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        {!isLoading && !error && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {filteredApplications.length === 0 ? (
                                    <Box sx={{ p: 5, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: theme.palette.divider }}>
                                        <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                            You haven't applied to any jobs yet
                                        </Typography>
                                    </Box>
                                ) : (
                                    filteredApplications.map((job) => (
                                        <Box key={job.id} sx={{
                                            width: '100%',
                                            p: 2,
                                            ...glassSx,
                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)',
                                            boxShadow: 'none'
                                        }}>
                                            <MyJobApplicationCard
                                                {...job}
                                                onViewDetails={() => handleViewDetails(job)}
                                            />
                                        </Box>
                                    ))
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}