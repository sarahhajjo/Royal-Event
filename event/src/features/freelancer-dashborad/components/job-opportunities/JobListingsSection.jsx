import React from "react";

import JobListingCard from "./JobListingCard";

export default function JobListingsSection({ title = "Available Positions", jobs = [], onApply, onViewDetails }) {
    return (
        <div className="flex flex-col gap-5">


            {jobs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-secondary">
                    No matching positions right now
                </p>
            ) : (
                <div className="flex flex-col gap-5">
                    {jobs.map((job) => (
                        <JobListingCard
                            key={job.id}
                            id={job.id}
                            {...job}
                            onApply={() => onApply?.(job)}
                            onViewDetails={() => onViewDetails?.(job)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}