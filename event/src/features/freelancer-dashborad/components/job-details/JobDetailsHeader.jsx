import React, { useState } from "react";
import { MapPin, MoveRight, Loader2, CheckCircle2 } from "lucide-react";
import freelancerJobService from "../../../../services/freelancerService/freelancerJobService.js";
import JobBadge from "../job-opportunities/JobBadge.jsx";

export default function JobDetailsHeader({ jobId, title, venue, eventType , applicationStatus}) {
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null); // 'success' أو 'error'

    const handleApply = async () => {
        setIsApplying(true);
        setApplyStatus(null);
        try {
            await freelancerJobService.applyForJob(jobId);
            setApplyStatus('success');
            // يمكنك هنا أيضاً إظهار إشعار (Toast) بنجاح التقديم
        } catch (error) {
            console.error("Apply error:", error);
            setApplyStatus('error');
            alert(error.response?.data?.message || "حدث خطأ أثناء التقديم");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3">
                {eventType && (
                    <div className="w-max">
                        <JobBadge label={eventType} variant="outline" />
                    </div>
                )}
                <h1 className="font-serif text-4xl font-bold text-text-primary md:text-5xl tracking-tight">
                    {title}
                </h1>
                <p className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin size={16} className="text-primary" />
                    {venue}
                </p>
            </div>
            {applicationStatus ? (
                <div className="flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-6 py-3 font-semibold text-primary">
                    Your Status: {applicationStatus}
                </div>
            ) : (
                /* زر التقديم الذكي (يظهر فقط إذا لم يكن هناك حالة سابقة) */
                <button
                    onClick={handleApply}
                    disabled={isApplying || applyStatus === 'success'}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-bg-default transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isApplying ? (
                        <>جاري التقديم... <Loader2 size={18} className="animate-spin" /></>
                    ) : applyStatus === 'success' ? (
                        <>تم التقديم بنجاح <CheckCircle2 size={18} /></>
                    ) : (
                        <>Apply Now <MoveRight size={18} /></>
                    )}
                </button>
            )}
        </div>
    );
}