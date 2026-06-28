import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
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

const IdentityDetails = ({ identity }) => {
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
                <BadgeOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Identity Details
                </Typography>
            </Box>

            <Grid container spacing={5} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={6}>
                    <FieldBlock label="FIRST NAME" value={identity?.firstName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FieldBlock label="LAST NAME" value={identity?.lastName} />
                </Grid>
            </Grid>

            <Box sx={{ mt: 1 }}>
                <FieldBlock label="BIRTH DATE" value={identity?.birthDate} />
            </Box>
        </Box>
    );
};

export default IdentityDetails;