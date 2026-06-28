import React from "react";
import { Box, Typography } from "@mui/material";

import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import StatsCards from "./overview-components/StatsCards/StatsCards.jsx";
import PendingApproval from "./overview-components/PendingApproval/PendingApproval.jsx";
import RecentActivity from "./overview-components/RecentActivity/RecentActivity.jsx";
import TopServices from "./overview-components/TopServices/TopServices.jsx";

const DashboardPage = () => {
    // تأثيرات النقر
    const interactiveClickEffect = {
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 20px rgba(179, 140, 69, 0.12)",
        },
        "&:active": {
            transform: "scale(0.96) translateY(0)",
            transition: "all 0.05s ease",
        },
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                bgcolor: "#FAF3E8", // 👈 تم تثبيت لون الخلفية الفاتح هنا ليتطابق مع السايدبار
                display: "flex",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <Sidebar activeItem="Overview" />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    overflow: "hidden",
                    ml: { xs: 0, md: "240px" }
                }}
            >
                <TopBar />

                <Box
                    sx={{
                        flex: 1,
                        p: 5,
                        mt: "64px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3.5,
                        overflowY: "auto",
                        overflowX: "hidden",
                        width: "100%",
                        boxSizing: "border-box",
                        minWidth: 0,
                    }}
                >
                    {/* Welcome Header */}
                    <Box className="animate-fade-in" sx={{ textAlign: "left" }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "2.4rem",
                                color: "#1C1712", // 👈 تثبيت لون النص ليكون مرئياً
                                mb: 1,
                            }}
                        >
                            Welcome back,{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "#8C6A1F", // 👈 تثبيت اللون الذهبي
                                    fontWeight: 300,
                                }}
                            >
                                Executive Partner
                            </Box>
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#7A6F5E", // 👈 تثبيت اللون الرمادي
                                fontSize: "14px",
                                fontWeight: 300,
                            }}
                        >
                            Elevating standard event coordination to a fine art. Your
                            portfolio of exclusive reserves is performing at peak
                            efficiency today.
                        </Typography>
                    </Box>

                    {/* Stats Row */}
                    <Box className="animate-fade-in" sx={{ animationDelay: "100ms", width: "100%" }}>
                        <StatsCards />
                    </Box>

                    {/* Pending Approval + Recent Activity */}
                    <Box
                        className="animate-fade-in"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", lg: "row" },
                            gap: 3.5,
                            alignItems: "stretch",
                            animationDelay: "200ms",
                        }}
                    >
                        {/* العمود الأول: Pending + Services */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}>
                            <Box sx={{ "& > div": interactiveClickEffect }}>
                                <PendingApproval />
                            </Box>

                            <Box sx={{ "& > div, & .MuiListItemButton-root": interactiveClickEffect }}>
                                <TopServices />
                            </Box>
                        </Box>

                        {/* العمود الثاني: Recent Activity */}
                        <Box sx={{ flex: { xs: 1, lg: 0.4 }, "& > div, & .MuiPaper-root": interactiveClickEffect }}>
                            <RecentActivity />
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;