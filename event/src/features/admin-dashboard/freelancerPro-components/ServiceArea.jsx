import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { T, typography } from "../theme";

const ServiceArea = ({ area }) => (
    <Box sx={{ p: 3, border: `1.5px solid ${T.border}`, borderRadius: "14px", bgcolor: T.cardBg }}>
        <Typography sx={{ ...typography.sectionLabel, mb: 2 }}>SERVICE AREA</Typography>
        <Box sx={{ height: 150, bgcolor: "#e0e0e0", borderRadius: "8px", mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnOutlinedIcon sx={{ color: T.gold }} />
            <Typography sx={typography.colHeader}>{area}</Typography>
        </Box>
    </Box>
);
export default ServiceArea;