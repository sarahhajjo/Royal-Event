import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Contact } from "lucide-react";
import InfoCard from "./InfoCard";

export default function ContactInfoCard({ phone, location }) {
    const theme = useTheme();

    return (
        <InfoCard icon={Contact} title="Contact Information">
            <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Secondary Phone
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }} dir="ltr">
                    {phone}
                </Typography>
            </Box>
            <Box>
                <Typography sx={{ mb: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Location
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }}>
                    {location?.en || location?.ar || location}
                </Typography>
            </Box>
        </InfoCard>
    );
}