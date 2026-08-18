import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { fetchJobOffers } from "../components/job-opportunities/JobOffersSlice.js";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import JobFiltersBar from "../components/job-opportunities/JobFiltersBar.jsx";
import JobListingsSection from "../components/job-opportunities/JobListingsSection.jsx";

const DEFAULT_FILTERS = {
    search: "",
    experience: "All Levels",
    eventType: "All Events",
    employmentType: "All Types",
};

const mapJobData = (job) => ({
    id: job.id,
    title: job.job_title || "Untitled Job",
    description: job.job_requirements_and_scope || "No description available.",
    venue: job.specific_event_association || job.provider?.brand_name || "Royal Events Venue",
    badges: [
        { label: job.time_condition || "Contract", variant: "outline" }
    ],
    salary: job.salary || "0.00",
    currency: "SAR",
    startDate: job.job_start_date || "TBD",
    experience: job.experience_level || "Any",
    deadline: job.application_deadline || "Open",
    eventType: job.event_type || "Event",
    requirements: job.job_requirements_and_scope || "",
    employmentType: job.time_condition || "Contract",
    experienceLevel: job.experience_level || "Mid-Level",
});

export default function JobOpportunitiesPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const { jobs, isLoading, error } = useSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchJobOffers());
    }, [dispatch]);

    const jobsArray = Array.isArray(jobs) ? jobs : (jobs?.data || []);
    const mappedJobs = useMemo(() => jobsArray.map(mapJobData), [jobsArray]);

    const filteredJobs = useMemo(() => {
        return mappedJobs.filter((job) => {
            const searchLower = filters.search.trim().toLowerCase();
            const matchesSearch = searchLower === "" ||
                job.title.toLowerCase().includes(searchLower) ||
                job.requirements.toLowerCase().includes(searchLower);

            const matchesExperience = filters.experience === "All Levels" ||
                job.experienceLevel?.toLowerCase() === filters.experience.toLowerCase();

            const matchesEventType = filters.eventType === "All Events" ||
                job.eventType?.toLowerCase() === filters.eventType.toLowerCase();

            const matchesEmployment = filters.employmentType === "All Types" ||
                job.employmentType?.toLowerCase() === filters.employmentType.toLowerCase();

            return matchesSearch && matchesExperience && matchesEventType && matchesEmployment;
        });
    }, [filters, mappedJobs]);

    const handleApply = (job) => {
        console.log("Apply to:", job.id);
    };

    const handleViewDetails = (job) => {
        console.log("View details:", job.id);
    };

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم
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
                <Header title="Job Opportunities" />

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
                            title="Job Opportunities"
                            subtitle="Discover your next prestigious role in world-class events."
                        />

                        {isLoading && (
                            <Box sx={{ py: 10, textAlign: 'center' }}>
                                <Typography sx={{ color: 'primary.main', fontSize: '0.9rem' }}>Loading job opportunities...</Typography>
                            </Box>
                        )}

                        {error && (
                            <Box sx={{ py: 10, textAlign: 'center' }}>
                                <Typography sx={{ color: 'error.main', fontSize: '0.9rem' }}>{error}</Typography>
                            </Box>
                        )}

                        {!isLoading && !error && (
                            <>
                                <JobFiltersBar filters={filters} onChange={setFilters} />

                                {filteredJobs.length > 0 ? (
                                    <JobListingsSection
                                        jobs={filteredJobs}
                                        onApply={handleApply}
                                        onViewDetails={handleViewDetails}
                                    />
                                ) : (
                                    <Box sx={{ py: 10, textAlign: 'center' }}>
                                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
                                            No job offers found matching your criteria.
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}