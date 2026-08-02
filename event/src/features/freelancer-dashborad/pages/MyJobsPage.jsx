import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import freelancerJobService from "../../../services/freelancerService/freelancerJobService.js";
import JobFiltersBar from "../components/job-opportunities/JobFiltersBar.jsx";
import MyJobApplicationCard from "../components/my-jop/MyJobApplicationCard.jsx";


// تحويل عنصر الطلب القادم من الـ API إلى الشكل اللي يحتاجه MyJobApplicationCard
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
        // TODO: انتقلي لصفحة تفاصيل عرض العمل أو افتحي مودال بالتفاصيل الكاملة
        console.log("View application details:", job.id);
    };

    return (
        <div className="flex min-h-screen bg-bg-default text-text-primary">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header title="My Jobs" />

                <main className="flex-1 space-y-6 p-6">
                    <p className="-mt-2 text-sm text-text-secondary">
                        Track the status of every job you've applied to.
                    </p>

                    <JobFiltersBar filters={filters} onChange={setFilters} />

                    {isLoading && (
                        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-secondary">
                            Loading your applications...
                        </p>
                    )}

                    {error && !isLoading && (
                        <p className="rounded-xl border border-dashed border-red-500/40 p-6 text-center text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {!isLoading && !error && (
                        <div className="flex flex-col gap-5">
                            {filteredApplications.length === 0 ? (
                                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-secondary">
                                    You haven't applied to any jobs yet
                                </p>
                            ) : (
                                filteredApplications.map((job) => (
                                    <MyJobApplicationCard
                                        key={job.id}
                                        {...job}
                                        onViewDetails={() => handleViewDetails(job)}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}