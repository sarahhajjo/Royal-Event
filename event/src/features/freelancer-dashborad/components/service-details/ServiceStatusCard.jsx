import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AlertCircle } from "lucide-react";
import InfoCard from "./InfoCard";

export default function ServiceStatusCard({
                                              currentStatus = "Pending Review",
                                              message = "Your service is being reviewed by our quality team. You will be notified once the service is activated.",
                                          }) {
    const theme = useTheme();

    return (
        <InfoCard icon={AlertCircle} title="Service Status">
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ mb: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Current Status
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.9rem', fontWeight: 600, color: 'primary.main', fontFamily: "'Raleway', sans-serif" }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    {currentStatus}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.78rem', lineHeight: 1.6, color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                {message}
            </Typography>
        </InfoCard>
    );
}