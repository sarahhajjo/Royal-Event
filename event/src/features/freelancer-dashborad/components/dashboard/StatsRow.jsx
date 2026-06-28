import React from "react";
import { Grid, Paper, Box, Typography, LinearProgress } from "@mui/material";
import EarningsIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import OrdersIcon from "@mui/icons-material/LocalMallOutlined";
import CompletionIcon from "@mui/icons-material/VerifiedOutlined";
import RatingIcon from "@mui/icons-material/StarBorderOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const StatCard = ({ icon, label, value, sub, progress, trend }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3.5,
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            boxShadow: (t) => t.palette.mode === 'light' ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
        }}
    >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography
                sx={{
                    color: "text.secondary",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase"
                }}
            >
                {label}
            </Typography>
            <Box sx={{ color: "primary.main", "& svg": { fontSize: "1.6rem" } }}>
                {icon}
            </Box>
        </Box>

        <Typography
            sx={{
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                fontFamily: "'Cinzel', serif",
                color: "text.primary",
                fontWeight: 700,
                my: "auto",
                lineHeight: 1.1
            }}
        >
            {value}
        </Typography>

        <Box>
            {progress !== undefined && (
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        mb: 1.5,
                        bgcolor: "rgba(201,168,76,0.15)",
                        "& .MuiLinearProgress-bar": { bgcolor: "primary.main" }
                    }}
                />
            )}
            {trend && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <TrendingUpIcon sx={{ fontSize: 18, color: "#4CAF50" }} />
                    <Typography sx={{ color: "#4CAF50", fontSize: "0.88rem", fontWeight: 600 }}>
                        {trend}
                    </Typography>
                </Box>
            )}
            {sub && <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>{sub}</Typography>}
        </Box>
    </Paper>
);

const StatsRow = ({ stats = {} }) => {
    const cards = [
        { icon: <EarningsIcon />, label: "Total Earnings", value: stats.totalEarnings, trend: stats.earningsTrend },
        { icon: <OrdersIcon />, label: "Active Orders", value: stats.activeOrders, sub: `${stats.ordersActionNeeded} requiring action today` },
        { icon: <CompletionIcon />, label: "Completion", value: `${stats.completion}%`, progress: stats.completion },
        {
            icon: <RatingIcon />, label: "Rating",
            value: (<>{stats.rating}<Box component="span" sx={{ fontSize: "1.3rem", color: "text.secondary", fontWeight: 400 }}> / 5.0</Box></>),
            sub: stats.ratingStatus,
        },
    ];

    return (
        <Grid container spacing={3.5} sx={{ mb: 4.5 }}>
            {cards.map((card, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                    <StatCard {...card} />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsRow;