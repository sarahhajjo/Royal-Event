import React from "react";
import { Paper, Box, Typography, Stack, Avatar, Button, Divider, IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddOutlined";
import PaymentIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import StarIcon from "@mui/icons-material/StarBorderOutlined";
import BusinessIcon from "@mui/icons-material/BusinessCenterOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";

const ACTIVITY_ICONS = { person: PersonAddIcon, payment: PaymentIcon, star: StarIcon, business: BusinessIcon };

const ActivityItem = ({ activity, isLast }) => {
    const IconComponent = ACTIVITY_ICONS[activity.iconType] || PersonAddIcon;

    return (
        <Box sx={{ display: "flex", gap: 3, position: "relative" }}>
            {!isLast && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 23,
                        top: 52,
                        bottom: -28,
                        width: 2,
                        bgcolor: "divider"
                    }}
                />
            )}
            <Avatar
                sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "rgba(201,168,76,0.12)",
                    color: "primary.main",
                    zIndex: 1
                }}
            >
                <IconComponent sx={{ fontSize: 24 }} />
            </Avatar>
            <Box sx={{ pt: 0.5, flex: 1 }}>
                <Typography
                    sx={{ color: "text.primary", fontSize: "0.98rem", lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: activity.message.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#C9A84C; font-weight:700;">$1</strong>') }}
                />
                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        mt: 0.8
                    }}
                >
                    {activity.timeAgo}
                </Typography>
            </Box>
        </Box>
    );
};

const RecentActivity = ({ activities = [], onViewFullLog }) => (
    <Paper
        elevation={0}
        sx={{
            p: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            boxShadow: (t) => t.palette.mode === 'light' ? "0 4px 20px rgba(0,0,0,0.03)" : "none"
        }}
    >
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5 }}>
                <Typography
                    sx={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "text.primary"
                    }}
                >
                    Recent Activity
                </Typography>
                <IconButton size="small"><FilterListIcon sx={{ fontSize: 22 }} /></IconButton>
            </Box>
            <Divider sx={{ borderColor: "divider", mb: 4 }} />
            <Stack spacing={4.5}>
                {activities.map((act, i) => <ActivityItem key={act.id || i} activity={act} isLast={i === activities.length - 1} />)}
            </Stack>
        </Box>

        <Button
            fullWidth
            variant="outlined"
            onClick={onViewFullLog}
            sx={{
                mt: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: "0.85rem",
                borderColor: "divider",
                color: "text.primary",
                borderRadius: 2
            }}
        >
            View Full Log
        </Button>
    </Paper>
);

export default RecentActivity;