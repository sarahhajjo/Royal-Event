import React from "react";
import { Box, Typography } from "@mui/material";
import { T } from "../Theme";

/**
 * ApprovalHeader — page title + subtitle
 */
export default function ApprovalHeader({
    title = "Pending Approvals",
    subtitle = "Manage and review submissions across the platform. Your curation maintains the standard of excellence for our exclusive reserves.",
}) {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: T.gold, fontWeight: 800, fontSize: "2rem", lineHeight: 1.15, mb: 1.5 }}>
                {title}
            </Typography>
            <Typography sx={{ color: T.textMuted, fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 640 }}>
                {subtitle}
            </Typography>
        </Box>
    );
}
