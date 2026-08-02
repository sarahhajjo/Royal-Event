import React from "react";

const STATUS_STYLES = {
    pending: "bg-primary/10 text-primary border-primary/30",
    accepted: "bg-emerald-400/10 text-emerald-500 border-emerald-400/30",
    approved: "bg-emerald-400/10 text-emerald-500 border-emerald-400/30",
    rejected: "bg-red-400/10 text-red-500 border-red-400/30",
};

export default function ApplicationStatusBadge({ status = "pending" }) {
    const styles = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;

    return (
        <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles}`}
        >
      {status}
    </span>
    );
}