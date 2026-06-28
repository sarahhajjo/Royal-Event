import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { T, typography } from "../Theme";

const Region = ({ region }) => {
    return (
        <Box
            sx={{
                border: `1.5px solid ${T.border}`,
                borderRadius: "14px",
                p: 4,                  // ← أوسع
                backgroundColor: T.cardBg,
                width: "100%",         // ← يملأ الـ flex item
                boxSizing: "border-box",
            }}
        >
            {/* ── Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3.5 }}>
                <LocationOnOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Region
                </Typography>
            </Box>

            {/* ── Province ── */}
            <Box>
                <Typography sx={{ ...typography.colHeader, mb: 1 }}>PROVINCE / GOVERNORATE</Typography>
                <Typography sx={{ fontSize: "0.97rem", color: T.textPrimary, pb: 1.5 }}>
                    {region?.province || "—"}
                </Typography>
                <Divider sx={{ borderColor: T.border }} />
            </Box>
        </Box>
    );
};

export default Region;