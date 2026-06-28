import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { T, typography } from "../theme";

const ProfessionalNarrative = ({ bio }) => (
    <Box sx={{ p: 4, border: `1.5px solid ${T.border}`, borderRadius: "14px", bgcolor: T.cardBg }}>
        <Typography sx={{ ...typography.sectionLabel, letterSpacing: 2 }}>PROFESSIONAL NARRATIVE</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ color: T.textPrimary, lineHeight: 1.6 }}>{bio || "No summary provided."}</Typography>
    </Box>
);
export default ProfessionalNarrative;