import React from "react";
import { ChevronLeft, Bell } from "lucide-react";
import StatusPill from "./StatusPill";

export default function ServiceDetailsTopBar({
  serviceId,
  status = "pending",
  statusLabel = "Pending Approval",
  onBack,
  onEditService,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="الرجوع للخلف"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Service Details</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusPill label={statusLabel} variant={status} />
        <span className="text-xs text-text-secondary">Service ID: #{serviceId}</span>

        <button
          aria-label="الإشعارات"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary/10 hover:text-text-primary"
        >
          <Bell size={18} />
        </button>

        <button
          onClick={onEditService}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-default transition hover:opacity-90"
        >
          Edit Service
        </button>
      </div>
    </div>
  );
}
