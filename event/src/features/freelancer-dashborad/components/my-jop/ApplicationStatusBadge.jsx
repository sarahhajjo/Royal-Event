import React from "react";
import { Box, useTheme } from "@mui/material";

export default function ApplicationStatusBadge({ status = "pending" }) {
    const theme = useTheme();
    const currentStatus = status?.toLowerCase();

    let styles = {
        bgcolor: "rgba(212, 175, 55, 0.1)",
        color: "primary.main",
        borderColor: "rgba(212, 175, 55, 0.3)"
    };

    if (currentStatus === "accepted" || currentStatus === "approved") {
        styles = {
            bgcolor: "rgba(74, 222, 128, 0.1)",
            color: "#4ade80",
            borderColor: "rgba(74, 222, 128, 0.3)"
        };
    } else if (currentStatus === "rejected") {
        styles = {
            bgcolor: "rgba(248, 113, 113, 0.1)",
            color: "#f87171",
            borderColor: "rgba(248, 113, 113, 0.3)"
        };
    }

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "999px",
                border: "1px solid",
                px: 1.5,
                py: 0.5,
                fontSize: "0.625rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                ...styles
            }}
        >
            {status}
        </Box>
    );
}