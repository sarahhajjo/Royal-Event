import React from "react";
import { Box, Typography } from "@mui/material";
import { T } from "../Theme";

export default function PaymentPageHeader({
    title = "Payment Approvals",
    subtitle = "Review and confirm customer payment receipts with precision.",
}) {
    return (
        <Box sx={{ mb: 3.5 }}>
            <Typography
                sx={{
                    color: T.gold,
                    fontWeight: 800,
                    fontSize: "2.1rem",
                    lineHeight: 1.15,
                    fontFamily: "'Playfair Display', serif", // ⚠️ استبدلي بأي خط سيريف مزخرف موجود بالمشروع
                }}
            >
                {title}
            </Typography>
            <Typography sx={{ color: T.textMuted, fontSize: "0.95rem", mt: 1 }}>
                {subtitle}
            </Typography>
        </Box>
    );
}
