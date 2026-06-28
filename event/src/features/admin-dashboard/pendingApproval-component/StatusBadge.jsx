import React from "react";
import { Box, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { T, typography } from "../theme";

/**
 * StatusBadge
 * Small pill showing the listing type (SERVICE / PRODUCT) plus the
 * location chip next to it ("Rukn Al-Din").
 *
 * Props:
 *  - type: "SERVICE" | "PRODUCT"
 *  - location: string
 */
export default function StatusBadge({ type = "PRODUCT", location }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
            <Box
                sx={{
                    px: 1.3,
                    py: 0.35,
                    borderRadius: "5px",
                    bgcolor: T.gold,
                    color: T.btnText,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    lineHeight: 1.4,
                }}
            >
                {type}
            </Box>

            {location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 14, color: T.textMuted }} />
                    <Typography
                        sx={{
                            fontSize: "0.72rem",
                            color: T.textMuted,
                            fontFamily: typography.fontFamily,
                        }}
                    >
                        {location}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}