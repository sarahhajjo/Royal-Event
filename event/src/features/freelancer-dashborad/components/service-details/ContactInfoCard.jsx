import React from "react";
import { Contact } from "lucide-react";
import InfoCard from "./InfoCard";

export default function ContactInfoCard({ phone, location }) {
  return (
    <InfoCard icon={Contact} title="Contact Information">
      <div className="mb-4">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">
          Secondary Phone
        </p>
        <p className="text-sm font-medium text-text-primary" dir="ltr">
          {phone}
        </p>
      </div>
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">
          Location
        </p>
        <p className="text-sm font-medium text-text-primary">{location}</p>
      </div>
    </InfoCard>
  );
}
