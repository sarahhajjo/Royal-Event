import React from "react";

export default function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-paper p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
        {Icon && <Icon size={16} />}
        {title}
      </div>
      {children}
    </div>
  );
}
