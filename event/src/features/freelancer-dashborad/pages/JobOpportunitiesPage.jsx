import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobOffers } from "../components/job-opportunities/JobOffersSlice.js";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
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
    const dispatch = useDispatch();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const { jobs, isLoading, error } = useSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchJobOffers());
    }, [dispatch]);

    const jobsArray = Array.isArray(jobs) ? jobs : (jobs?.data || []);
    const mappedJobs = useMemo(() => jobsArray.map(mapJobData), [jobsArray]);

    // فلترة الوظائف بناءً على اختيارات المستخدم
    const filteredJobs = useMemo(() => {
        return mappedJobs.filter((job) => {

            // 1. فلتر البحث (نبحث في العنوان وفي المتطلبات)
            const searchLower = filters.search.trim().toLowerCase();
            const matchesSearch = searchLower === "" ||
                job.title.toLowerCase().includes(searchLower) ||
                job.requirements.toLowerCase().includes(searchLower);

            // 2. فلتر الخبرة (Experience)
            const matchesExperience = filters.experience === "All Levels" ||
                job.experienceLevel?.toLowerCase() === filters.experience.toLowerCase();

            // 3. فلتر نوع الفعالية (Event Type) - تمت إضافته هنا
            const matchesEventType = filters.eventType === "All Events" ||
                job.eventType?.toLowerCase() === filters.eventType.toLowerCase();

            // 4. فلتر نوع التوظيف (Employment Type)
            const matchesEmployment = filters.employmentType === "All Types" ||
                job.employmentType?.toLowerCase() === filters.employmentType.toLowerCase();

            // يجب أن تتطابق جميع الشروط حتى تظهر الوظيفة
            return matchesSearch && matchesExperience && matchesEventType && matchesEmployment;
        });
    }, [filters, mappedJobs]);

    const handleApply = (job) => {
        console.log("Apply to:", job.id);
    };

    const handleViewDetails = (job) => {
        console.log("View details:", job.id);
    };

    return (
        <div className="flex min-h-screen bg-bg-default text-text-primary">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header title="Job Opportunities" />

                <main className="flex-1 space-y-6 p-6">
                    <p className="-mt-2 text-sm text-text-secondary">
                        Discover your next prestigious role in world-class events.
                    </p>

                    {isLoading && (
                        <div className="py-10 text-center text-primary">Loading job opportunities...</div>
                    )}

                    {error && (
                        <div className="py-10 text-center text-red-500">{error}</div>
                    )}

                    {!isLoading && !error && (
                        <>
                            <JobFiltersBar filters={filters} onChange={setFilters} />

                            {/* تم حذف البطاقة المميزة نهائياً من هنا */}

                            {filteredJobs.length > 0 ? (
                                <JobListingsSection
                                    jobs={filteredJobs}

                                    onApply={handleApply}
                                    onViewDetails={handleViewDetails}
                                />
                            ) : (
                                <div className="py-10 text-center text-text-secondary">
                                    No job offers found matching your criteria.
                                </div>
                            )}
                        </>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}