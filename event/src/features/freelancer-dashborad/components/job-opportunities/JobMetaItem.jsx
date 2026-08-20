import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function JobMetaItem({ label, value, highlight = false, suffix }) {
    const theme = useTheme();

    return (
        <Box>
            <Typography sx={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: highlight ? "primary.main" : theme.palette.text.primary, fontFamily: "'Raleway', sans-serif", mt: 0.3 }}>
                {value}
                {suffix && <Box component="span" sx={{ ml: 0.5, fontSize: "0.75rem", fontWeight: 400, color: theme.palette.text.secondary }}>{suffix}</Box>}
            </Typography>
        </Box>
    );
}