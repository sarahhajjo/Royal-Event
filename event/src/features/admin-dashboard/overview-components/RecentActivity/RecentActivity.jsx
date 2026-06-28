import React from "react";
import { Box, Paper, Stack, Typography, IconButton, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ActivityItem from "./ActivityItem"; // تأكد من المسار

const RecentActivity = () => {
    return (
        <Paper
            elevation={0}
            sx={{ p: 3, height: "100%", border: "1px solid #E0D5BC", borderRadius: 2, bgcolor: "#FFFFFF", display: "flex", flexDirection: "column" }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="overline" fontWeight={800} sx={{ letterSpacing: 1.5, fontSize: 12, color: "#1C1712" }}>
                    RECENT ACTIVITY
                </Typography>
                <IconButton size="small" sx={{ color: "#7A6F5E" }}>
                    <FilterListIcon fontSize="small" />
                </IconButton>
            </Stack>

            <Box flexGrow={1}>
                <ActivityItem
                    icon={<PersonAddAltOutlinedIcon fontSize="small" />}
                    title="New Provider Application"
                    subtitle="Elena Vance - Freelancer"
                    time="5 MINUTES AGO"
                />
                <ActivityItem
                    icon={<BusinessCenterOutlinedIcon fontSize="small" />}
                    title="Registration Request"
                    subtitle="Elite Catering - Company"
                    time="28 MINUTES AGO"
                />
                <ActivityItem
                    icon={<PersonAddAltOutlinedIcon fontSize="small" />}
                    title="New Provider Application"
                    subtitle="Marcus Thorne - Freelancer"
                    time="1 HOUR AGO"
                />
                <ActivityItem
                    icon={<BusinessCenterOutlinedIcon fontSize="small" />}
                    title="Registration Request"
                    subtitle="Lumina Lighting - Company"
                    time="4 HOURS AGO"
                    isLast={true}
                />
            </Box>

            <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2, color: "#1C1712", borderColor: "#E0D5BC", fontWeight: 700, "&:hover": { bgcolor: "#F3EDE0", borderColor: "#8a6f28" } }}
            >
                VIEW FULL LOG
            </Button>
        </Paper>
    );
};

export default RecentActivity;