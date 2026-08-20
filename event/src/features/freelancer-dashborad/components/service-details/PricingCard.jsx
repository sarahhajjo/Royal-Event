import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Tag } from "lucide-react";
import InfoCard from "./InfoCard";

export default function PricingCard({ priceType = "Fixed Price", amount, currency = "SAR" }) {
    const theme = useTheme();

    return (
        <InfoCard icon={Tag} title="Pricing">
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Price Type
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }}>
                    {priceType}
                </Typography>
            </Box>
            <Box>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: theme.palette.text.primary, fontFamily: "'Cinzel', serif" }}>
                    {amount?.toLocaleString()}{" "}
                    <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 600, color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                        {currency}
                    </Typography>
                </Typography>
            </Box>
        </InfoCard>
    );
}