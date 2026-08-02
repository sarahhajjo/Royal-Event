import React from "react";
import { Box, Typography } from "@mui/material";
import { T } from "../Theme";

/**
 * StatCard — small metric card ("PENDING REVIEW" / "12")
 */
export default function StatCard({ label, value }) {
    return (
        <Box
            sx={{
                flex: 1,
                bgcolor: T.cardBg,
                border: `1px solid ${T.border}`,
                borderRadius: "10px",
                px: 3,
                py: 2.5,
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: T.textMuted,
                    mb: 1,
                }}
            >
                {label}
            </Typography>
            <Typography sx={{ color: T.gold, fontWeight: 800, fontSize: "1.7rem", lineHeight: 1 }}>
                {value}
            </Typography>
        </Box>
    );
}
