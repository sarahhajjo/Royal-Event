import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, Loader2, CheckCircle2 } from "lucide-react";
import JobBadge from "./JobBadge";
import JobMetaItem from "./JobMetaItem";
import freelancerJobService from "../../../../services/freelancerService/freelancerJobService.js";

export default function JobListingCard({
                                           id,
                                           venue,
                                           title,
                                           badges = [],
                                           salary,
                                           currency = "SAR",
                                           startDate,
                                           experience,
                                           deadline,
                                           eventType,
                                           requirements,
                                           contactEmail,
                                           onApply, // (اختياري الآن لو أردتِ إخبار الصفحة الرئيسية بنجاح العملية)
                                       }) {
    const navigate = useNavigate();

    // 👑 إعداد حالات التقديم الخاصة بهذه البطاقة تحديداً
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);

    const handleApplyClick = async () => {
        setIsApplying(true);
        setApplyStatus(null);
        try {
            await freelancerJobService.applyForJob(id); // نرسل الـ id الخاص بالبطاقة
            setApplyStatus('success');
            // إذا كنتِ ممررة دالة onApply من الأب يمكنك استدعاؤها هنا لتحديث الواجهة الرئيسية إن لزم الأمر
            if (onApply) onApply(id);
        } catch (error) {
            console.error("Apply error:", error);
            setApplyStatus('error');
            alert(error.response?.data?.message || "حدث خطأ أثناء التقديم");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-paper transition-all duration-300 hover:border-primary/40 hover:shadow-sm">

            {/* المحتوى */}
            <div className="flex flex-col gap-4 p-6">

                {/* العنوان والمكان والبادج */}
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
                            <MapPin size={13} />
                            {venue}
                        </p>
                        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    </div>
                    <div className="flex flex-none flex-wrap justify-end gap-2">
                        {badges.map((badge) => (
                            <JobBadge key={badge.label} {...badge} />
                        ))}
                    </div>
                </div>

                {/* تفاصيل الوظيفة */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <JobMetaItem label="Salary" value={salary} suffix={` ${currency} /`} highlight />
                    <JobMetaItem label="Start Date" value={startDate} />
                    <JobMetaItem label="Experience" value={experience} />
                    <JobMetaItem label="Deadline" value={deadline} />
                </div>
                {eventType && <p className="-mt-2 text-[11px] text-text-secondary">{eventType}</p>}

                {/* المتطلبات */}
                <p className="border-t border-border pt-4 text-sm leading-relaxed text-text-secondary">
                    <span className="font-semibold text-primary">Requirements: </span>
                    {requirements}
                </p>

                {/* الأزرار ومعلومات التواصل */}
                <div className="flex flex-wrap items-center gap-3 pt-1">

                    {/* 👑 زر التقديم المربوط بالـ API */}
                    <button
                        onClick={handleApplyClick}
                        disabled={isApplying || applyStatus === 'success'}
                        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-bg-default transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isApplying ? (
                            <>جاري التقديم... <Loader2 size={14} className="animate-spin" /></>
                        ) : applyStatus === 'success' ? (
                            <>تم بنجاح <CheckCircle2 size={14} /></>
                        ) : (
                            "Apply Now"
                        )}
                    </button>

                    {/* زر التفاصيل مع التنقل */}
                    <button
                        onClick={() => navigate(`/jobs/${id}`)}
                        className="rounded-lg border border-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-primary/10"
                    >
                        View Details
                    </button>

                    {contactEmail && (
                        <a
                            href={`mailto:${contactEmail}`}
                            className="ml-auto flex items-center gap-1.5 text-sm italic text-text-secondary transition hover:text-primary"
                        >
                            <Mail size={14} />
                            {contactEmail}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}