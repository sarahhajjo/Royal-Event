import React from "react";
import { MapPin, Mail, Building2 } from "lucide-react";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import JobBadge from "../job-opportunities/JobBadge.jsx";
import JobMetaItem from "../job-opportunities/JobMetaItem.jsx";
import {useNavigate} from "react-router-dom";


export default function MyJobApplicationCard({
                                                 id,
                                                 jobOfferId,
                                                 venue,
                                                 provider,
                                                 title,
                                                 timeCondition,
                                                 status,
                                                 salary,
                                                 currency = "SAR",
                                                 startDate,
                                                 experience,
                                                 deadline,
                                                 eventType,
                                                 requirements,
                                                 contactEmail,
                                                 onViewDetails,
                                             }) {
    const navigate = useNavigate();
    return (
        <div className="rounded-2xl border border-border bg-bg-paper p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
                        <MapPin size={13} />
                        {venue}
                    </p>
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    {provider && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                            <Building2 size={12} />
                            {provider}
                        </p>
                    )}
                </div>

                <div className="flex flex-none flex-wrap justify-end gap-2">
                    {timeCondition && <JobBadge label={timeCondition} variant="outline" />}
                    <ApplicationStatusBadge status={status} />
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <JobMetaItem label="Salary" value={salary} suffix={`${currency} /`} highlight />
                <JobMetaItem label="Start Date" value={startDate} />
                <JobMetaItem label="Experience" value={experience} />
                <JobMetaItem label="Deadline" value={deadline} />
            </div>
            {eventType && <p className="mt-1 text-[11px] text-text-secondary">{eventType}</p>}

            <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-text-secondary">
                <span className="font-semibold text-primary">Requirements: </span>
                {requirements}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                    onClick={() => navigate(`/jobs/${jobOfferId}`, { state: { applicationStatus: status } })}
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
    );
}