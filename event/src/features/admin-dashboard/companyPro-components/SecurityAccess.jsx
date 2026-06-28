import React from "react";
import { Box, Typography, Grid, Chip } from "@mui/material";
import SecurityOutlinedIcon      from "@mui/icons-material/SecurityOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon        from "@mui/icons-material/CancelOutlined";
import { T, typography } from "../Theme.jsx";

/**
 * Props — mapped from API response:
 * user: { is_email_verified, is_phone_verified, account_status }
 * provider: { moderation_status, is_verified }
 *
 * الـ API ما بيرجع passwords — هالقسم بيعرض حالة التحقق بدل الباسورد
 */

const StatusItem = ({ label, value, ok }) => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        border: `1px solid ${T.border}`, borderRadius: "8px", px: 2, py: 1.3, bgcolor: T.cardBg }}>
        <Typography sx={{ ...typography.colHeader, color: T.textMuted }}>{label}</Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            {ok
                ? <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: "#388E3C" }} />
                : <CancelOutlinedIcon      sx={{ fontSize: 14, color: "#D32F2F" }} />}
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700,
                color: ok ? "#388E3C" : "#D32F2F", letterSpacing: 0.8 }}>
                {value}
            </Typography>
        </Box>
    </Box>
);

const SecurityAccess = ({ data }) => {
    const { user, moderation_status, is_verified } = data || {};

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3.5 }}>
                <SecurityOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Security &amp; Access
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>

                        <StatusItem label="EMAIL VERIFIED" value={data?.email_verified} ok={data?.is_email_verified} />
                    </Grid>
                <Grid item xs={12} sm={6}>
                    <StatusItem label="PHONE VERIFIED" value={user?.is_phone_verified ? "Verified" : "Not Verified"}
                                ok={user?.is_phone_verified} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatusItem label="ACCOUNT STATUS" value={user?.account_status || "—"}
                                ok={user?.account_status === "active"} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatusItem label="PROVIDER VERIFIED" value={is_verified ? "Verified" : "Pending"}
                                ok={!!is_verified} />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "8px", px: 2, py: 1.3, bgcolor: T.cardBg,
                        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ ...typography.colHeader, color: T.textMuted }}>MODERATION STATUS</Typography>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6,
                            borderRadius: "20px", px: 1.4, py: 0.3,
                            bgcolor: moderation_status === "approved" ? "#E8F5E9"
                                : moderation_status === "rejected" ? "#FFEBEE" : "#FFF8E7",
                            border: `1px solid ${
                                moderation_status === "approved" ? "#A5D6A7"
                                    : moderation_status === "rejected" ? "#FFCDD2" : T.goldLabel}` }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%",
                                bgcolor: moderation_status === "approved" ? "#388E3C"
                                    : moderation_status === "rejected" ? "#D32F2F" : "#FFA726" }} />
                            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1,
                                textTransform: "uppercase",
                                color: moderation_status === "approved" ? "#388E3C"
                                    : moderation_status === "rejected" ? "#D32F2F" : T.goldLabel }}>
                                {moderation_status || "—"}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SecurityAccess;