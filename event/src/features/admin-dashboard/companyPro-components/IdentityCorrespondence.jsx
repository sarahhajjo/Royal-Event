import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { T, typography } from "../theme";

const Field = ({ label, value, italic = false, verified = false }) => (
    <Box>
        <Typography sx={{ ...typography.colHeader, mb: 0.6 }}>{label}</Typography>
        <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "8px", px: 1.8, py: 1.1,
            bgcolor: T.cardBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "0.92rem",
                color: italic ? T.textMuted : T.textPrimary,
                fontStyle: italic ? "italic" : "normal" }}>
                {value || "—"}
            </Typography>
            {verified && (
                <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "6px", px: 1, py: 0.2, ml: 1, flexShrink: 0 }}>
                    <Typography sx={{ ...typography.colHeader, fontSize: "0.58rem", color: "#388E3C" }}>VERIFIED</Typography>
                </Box>
            )}
        </Box>
    </Box>
);

const IdentityCorrespondence = ({ data }) => {
    const user = data?.user || {};

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3.5 }}>
                <BadgeOutlinedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Identity &amp; Correspondence
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                {/* user.first_name */}
                <Grid item xs={12} sm={6}>
                    {/* الآن سيقرأ provider_type الذي مررناه */}

                        <Field label="FIRST NAME" value={data.first_name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Field label="LAST NAME" value={data.last_name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {/* الآن سيقرأ provider_type الذي مررناه */}
                        <Field label="REPRESENTATIVE ROLE" value= {data?.provider_type === "company" ? "COMPANY" : data?.provider_type?.toUpperCase() || "—"} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Field label="LANGUAGE" value={data.language} />
                    </Grid>

                {/* user.email + email verified badge */}

                {/* user.phone + phone verified badge */}
                <Grid item xs={12} sm={6}>
                    <Field
                        label="PHONE NUMBER"
                        value={data.phone}
                        verified={data.is_phone_verified}
                        italic={!data.phone}
                    />
                    <Grid item xs={12} sm={6}>
                        <Field
                            label="EMAIL"
                            value={data.email}
                            verified={data.is_email_verified}
                            italic={!data.email}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default IdentityCorrespondence;