import React from "react";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { T, typography } from "../theme";

const SecurityAccess = () => {
    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <LockOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, letterSpacing: 2 }}>
                    SECURITY & ACCESS
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ ...typography.colHeader, mb: 1 }}>ACCESS PASSWORD</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", bgcolor: T.pageBg, p: 1.5, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                        <Typography sx={{ flex: 1, color: T.textMuted }}>••••••••••••</Typography>
                        <IconButton size="small"><VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ ...typography.colHeader, mb: 1 }}>CONFIRM PASSWORD</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", bgcolor: T.pageBg, p: 1.5, borderRadius: "8px", border: `1px solid ${T.border}` }}>
                        <Typography sx={{ flex: 1, color: T.textMuted }}>••••••••••••</Typography>
                        <IconButton size="small"><VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Box>
                </Box>
            </Box>

            <Typography sx={{ mt: 3, fontSize: "0.8rem", color: T.textMuted, fontStyle: "italic" }}>
                * Security protocols require 2FA for all Platinum Tier administrative access.
            </Typography>
        </Box>
    );
};

export default SecurityAccess;