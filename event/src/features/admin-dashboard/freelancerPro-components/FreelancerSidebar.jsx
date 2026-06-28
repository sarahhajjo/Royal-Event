import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import { T, typography } from "../theme";

const FreelancerSidebar = ({ data }) => {
    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 3, textAlign: 'center', bgcolor: T.cardBg }}>
            <Avatar src={data.avatar} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
            <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>{data.first_name} {data.last_name}</Typography>
            <Typography sx={{ color: T.textMuted, mb: 2 }}>{data.job_title}</Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                <Chip label={data.status} sx={{ bgcolor: T.goldLabel, color: '#fff' }} />
                <Chip label={data.tier} sx={{ bgcolor: '#eee' }} />
            </Box>
            <Box sx={{ textAlign: 'left', mt: 2 }}>
                <Typography sx={typography.colHeader}>JOIN DATE: {data.join_date}</Typography>
                <Typography sx={typography.colHeader}>ID NUMBER: {data.id_number}</Typography>
            </Box>
        </Box>
    );
};
export default FreelancerSidebar;