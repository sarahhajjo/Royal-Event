import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { T, typography } from "../theme";

const DetailField = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
        <Typography sx={{ ...typography.colHeader, mb: 0.5, fontSize: "0.7rem", color: T.textMuted }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: "0.92rem", fontWeight: 500, color: T.textPrimary, borderBottom: `1px solid ${T.border}`, pb: 0.5 }}>
            {value || "—"}
        </Typography>
    </Box>
);

const IdentityCorrespondence = ({ data }) => {
    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PersonOutlineOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, letterSpacing: 2 }}>
                    IDENTITY & CORRESPONDENCE
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={6}><DetailField label="FIRST NAME" value={data?.first_name} /></Grid>
                <Grid item xs={6}><DetailField label="LAST NAME" value={data?.last_name} /></Grid>
                <Grid item xs={6}><DetailField label="EXPERTISE / ROLE" value={data?.job_title} /></Grid>
                <Grid item xs={6}><DetailField label="BIRTH DATE" value={data?.birth_date} /></Grid>
                <Grid item xs={6}><DetailField label="PRIMARY EMAIL" value={data?.email} /></Grid>
                <Grid item xs={6}><DetailField label="SECONDARY NUMBER" value={data?.phone} /></Grid>
            </Grid>
        </Box>
    );
};

export default IdentityCorrespondence;