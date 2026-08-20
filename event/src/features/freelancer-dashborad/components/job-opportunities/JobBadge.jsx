import React from "react";
import { Box, useTheme } from "@mui/material";

export default function JobBadge({ label, variant = "outline" }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: variant === "solid" ? "primary.main" : "rgba(212, 175, 55, 0.4)",
                bgcolor: variant === "solid" ? "primary.main" : "transparent",
                color: variant === "solid" ? theme.palette.background.default : "primary.main",
                px: 1.5,
                py: 0.5,
                fontSize: "0.625rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
            }}
        >
            {label}
        </Box>
    );
}