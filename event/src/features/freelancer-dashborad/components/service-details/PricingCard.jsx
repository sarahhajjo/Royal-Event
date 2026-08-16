import React from "react";
import { Tag } from "lucide-react";
import InfoCard from "./InfoCard";

export default function PricingCard({ priceType = "Fixed Price", amount, currency = "SAR" }) {
  return (
    <InfoCard icon={Tag} title="Pricing">
      <div className="mb-4">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">
          Price Type
        </p>
        <p className="text-sm font-medium text-text-primary">{priceType}</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">
          {amount?.toLocaleString()}{" "}
          <span className="text-sm font-medium text-text-secondary">{currency}</span>
        </p>
      </div>
    </InfoCard>
  );
}
