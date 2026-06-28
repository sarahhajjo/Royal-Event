import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";

const ActivityItem = ({ icon, title, subtitle, time, isLast }) => {
    return (
        <Stack direction="row" spacing={2.5}>
            <Stack alignItems="center" spacing={0}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: "#EDE5CE", color: "#8a6f28" }}>
                    {icon}
                </Avatar>
                {!isLast && <Box sx={{ width: "2px", flexGrow: 1, bgcolor: "#E0D5BC", my: 0.5 }} />}
            </Stack>

            <Box pb={3.5}>
                <Typography variant="subtitle2" fontWeight={700} color="#1C1712">
                    {title}
                </Typography>
                <Typography variant="body2" color="#7A6F5E" mt={0.3}>
                    {subtitle}
                </Typography>
                <Typography variant="caption" sx={{ color: "#8a6f28", letterSpacing: 0.5, fontSize: 10, fontWeight: 800, mt: 0.5, display: "block" }}>
                    {time}
                </Typography>
            </Box>
        </Stack>
    );
};

export default ActivityItem;