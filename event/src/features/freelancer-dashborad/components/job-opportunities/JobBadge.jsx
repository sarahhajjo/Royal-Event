import React from "react";

export default function JobBadge({ label, variant = "outline" }) {
    const styles =
        variant === "solid"
            ? "bg-primary text-bg-default border-primary"
            : "border-primary/40 text-primary";

    return (
        <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles}`}
        >
      {label}
    </span>
    );
}