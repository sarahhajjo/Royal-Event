import React from "react";
import { AlertCircle } from "lucide-react";
import InfoCard from "./InfoCard";

export default function ServiceStatusCard({
  currentStatus = "Pending Review",
  message = "Your service is being reviewed by our quality team. You will be notified once the service is activated.",
}) {
  return (
    <InfoCard icon={AlertCircle} title="Service Status">
      <div className="mb-3">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">
          Current Status
        </p>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {currentStatus}
        </p>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{message}</p>
    </InfoCard>
  );
}
