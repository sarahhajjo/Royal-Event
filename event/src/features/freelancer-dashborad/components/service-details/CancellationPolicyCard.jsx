import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import InfoCard from "./InfoCard";

const POLICY_ITEMS = [
    { key: "beforeAcceptance", label: "Cancel before acceptance" },
    { key: "afterAcceptance", label: "Cancel after acceptance" },
    { key: "beforePayment", label: "Cancel before payment" },
];

export default function CancellationPolicyCard({ policy = {} }) {
    const theme = useTheme();

    return (
        <InfoCard icon={ShieldCheck} title="Cancellation Policy">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {POLICY_ITEMS.map((item) => {
                    const allowed = Boolean(policy[item.key]);
                    return (
                        <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                                {item.label}
                            </Typography>
                            {allowed ? (
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 600, color: '#4ade80' }}>
                                    <CheckCircle2 size={15} /> Allowed
                                </Box>
                            ) : (
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>
                                    <XCircle size={15} /> Not allowed
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </InfoCard>
    );
}