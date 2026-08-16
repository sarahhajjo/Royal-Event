import React, { useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// 1. استيراد مكونات التخطيط الأساسية (Layout)
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";

// 2. استيراد مكونات تفاصيل الوظيفة
import JobDetailsHeader from "../components/job-details/JobDetailsHeader.jsx";
import JobQuickInfo from "../components/job-details/JobQuickInfo.jsx";
import JobRequirements from "../components/job-details/JobRequirements.jsx";
import JobRightSidebar from "../components/job-details/JobRightSidebar.jsx";
import { fetchJobById } from "../components/job-opportunities/JobOffersSlice.js";

export default function JobDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedJob, isLoading, error } = useSelector((state) => state.jobs);
    const location = useLocation();
    const passedStatus = location.state?.applicationStatus;
    useEffect(() => {
        dispatch(fetchJobById(id));
    }, [dispatch, id]);

    // 👑 تعديل حالات التحميل والخطأ لتأخذ نفس ألوان الثيم
    if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-bg-default text-text-primary">جاري تحميل التفاصيل...</div>;
    if (error) return <div className="flex min-h-screen items-center justify-center bg-bg-default text-red-500">{error}</div>;
    if (!selectedJob) return null;

    return (
        // 👑 الحاوية الرئيسية: هنا يتم تطبيق الـ Dark/Light Mode تلقائياً عبر bg-bg-default
        <div className="flex min-h-screen bg-bg-default text-text-primary transition-colors duration-300">

            {/* القائمة الجانبية */}
            <Sidebar />

            <div className="flex flex-1 flex-col">

                {/* الشريط العلوي */}
                <Header title="Job Details" />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-6xl">
                        <JobDetailsHeader
                            title={selectedJob.job_title}
                            venue={selectedJob.specific_event_association}
                            eventType={selectedJob.event_type}
                            jobId={selectedJob.id}
                            applicationStatus={passedStatus}
                        />

                        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
                            <div className="flex flex-col gap-6">
                                <JobQuickInfo
                                    startDate={selectedJob.job_start_date}
                                    deadline={selectedJob.application_deadline}
                                    experience={selectedJob.experience_level}
                                    employmentType={selectedJob.time_condition}
                                />
                                <JobRequirements description={selectedJob.job_requirements_and_scope} />
                            </div>

                            <div>
                                <JobRightSidebar
                                    salary={selectedJob.salary}
                                    paymentSystem={selectedJob.payment_system}
                                    contactEmail={selectedJob.contact_info}
                                    equipmentProvided={selectedJob.company_equipment_provided === 1}
                                />
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}