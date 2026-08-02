import React from "react";
import ContactInfoCard from "./ContactInfoCard";
import PricingCard from "./PricingCard";
import ServiceStatusCard from "./ServiceStatusCard";
import CancellationPolicyCard from "./CancellationPolicyCard";

export default function ServiceInfoGrid({ contact, pricing, status, policy }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ContactInfoCard phone={contact.phone} location={contact.location} />
      <PricingCard
        priceType={pricing.priceType}
        amount={pricing.amount}
        currency={pricing.currency}
      />
      <ServiceStatusCard currentStatus={status.currentStatus} message={status.message} />
      <CancellationPolicyCard policy={policy} />
    </div>
  );
}
