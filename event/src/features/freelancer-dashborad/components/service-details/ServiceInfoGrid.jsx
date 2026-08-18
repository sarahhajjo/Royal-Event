import React from "react";
import { Box } from "@mui/material";
import ContactInfoCard from "./ContactInfoCard";
import PricingCard from "./PricingCard";
import ServiceStatusCard from "./ServiceStatusCard";
import CancellationPolicyCard from "./CancellationPolicyCard";

export default function ServiceInfoGrid({ contact, pricing, status, policy }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 3 }}>
            <ContactInfoCard phone={contact.phone} location={contact.location} />
            <PricingCard
                priceType={pricing.priceType}
                amount={pricing.amount}
                currency={pricing.currency}
            />
            <ServiceStatusCard currentStatus={status.currentStatus} message={status.message} />
            <CancellationPolicyCard policy={policy} />
        </Box>
    );
}