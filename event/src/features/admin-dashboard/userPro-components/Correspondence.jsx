import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import { T, typography } from "../Theme";

const FieldBlock = ({ label, value, italic = false }) => (
    <Box>
        <Typography sx={{ ...typography.colHeader, mb: 0.8 }}>{label}</Typography>
        <Typography
            sx={{
                fontSize: "0.97rem",
                color: italic ? T.textMuted : T.textPrimary,
                fontStyle: italic ? "italic" : "normal",
                pb: 2,
            }}
        >
            {value || "—"}
        </Typography>
        <Divider sx={{ borderColor: T.border }} />
    </Box>
);

const Correspondence = ({ correspondence }) => {
    return (
        <Box
            sx={{
                border: `1.5px solid ${T.border}`,
                borderRadius: "14px",
                p: 4,
                backgroundColor: T.cardBg,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3.5 }}>
                <PermContactCalendarOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Correspondence
                </Typography>
            </Box>

            {/* Primary Email */}
            <Box sx={{ mb: 1 }}>
                <Typography sx={{ ...typography.colHeader, mb: 0.8 }}>PRIMARY EMAIL</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
                    <Typography sx={{ fontSize: "0.97rem", color: T.textPrimary }}>
                        {correspondence?.email || "—"}
                    </Typography>
                    {correspondence?.emailVerified && (
                        <Box
                            sx={{
                                border: `1px solid ${T.border}`,
                                borderRadius: "6px",
                                px: 1.5,
                                py: 0.4,
                            }}
                        >
                            <Typography sx={{ ...typography.colHeader, color: T.textMuted, letterSpacing: 1 }}>
                                VERIFIED
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Divider sx={{ borderColor: T.border }} />
            </Box>

            {/* Phone + Secondary */}
            <Grid container spacing={5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                    <FieldBlock label="PHONE NUMBER" value={correspondence?.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FieldBlock
                        label="SECONDARY CONTACT"
                        value={correspondence?.secondaryContact || "Not Specified"}
                        italic={!correspondence?.secondaryContact}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Correspondence;