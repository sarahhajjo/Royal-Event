import React from "react";

export default function JobMetaItem({ label, value, highlight = false, suffix }) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-wide text-text-secondary">{label}</p>
            <p className={`text-sm font-semibold ${highlight ? "text-primary" : "text-text-primary"}`}>
                {value}
                {suffix && <span className="ml-1 text-xs font-normal text-text-secondary">{suffix}</span>}
            </p>
        </div>
    );
}