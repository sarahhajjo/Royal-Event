import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import StatsCards from "../overview-components/StatsCards/StatsCards.jsx";
import PendingApproval from "../overview-components/PendingApproval/PendingApproval.jsx";
import RecentActivity from "../overview-components/RecentActivity/RecentActivity.jsx";
import TopServices from "../overview-components/TopServices/TopServices.jsx";

import adminService from "../../../services/adminService/adminService.js";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        freelancersPercent: 0,
        companiesPercent: 0
    });
    // 👑 إضافة حالة جديدة لأفضل الخدمات
    const [topListings, setTopListings] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // جلب الإحصائيات وأفضل الخدمات معاً
                const [statsData, topListingsData] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getTopListings() // 👈 التابع الجديد
                ]);

                // معالجة الإحصائيات
                const totalProviders = statsData?.providers?.total || 0;
                const totalOrganizers = statsData?.users?.organizers_total || 0;
                const freelancerStr = statsData?.providers?.breakdown?.freelancer?.percentage || "0%";
                const companyStr = statsData?.providers?.breakdown?.company?.percentage || "0%";

                setStats({
                    totalUsers: totalProviders + totalOrganizers,
                    freelancersPercent: parseInt(freelancerStr),
                    companiesPercent: parseInt(companyStr)
                });

                // تخزين أفضل الخدمات
                setTopListings(topListingsData);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, []);

    const interactiveClickEffect = {
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 20px rgba(179, 140, 69, 0.12)" },
        "&:active": { transform: "scale(0.96) translateY(0)", transition: "all 0.05s ease" },
    };

    return (
        <Box sx={{ width: "100vw", height: "100vh", bgcolor: "#FAF3E8", display: "flex", overflow: "hidden", boxSizing: "border-box" }}>
            <Sidebar activeItem="Overview" />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", ml: { xs: 0, md: "240px" } }}>
                <TopBar />
                <Box sx={{ flex: 1, p: 5, mt: "64px", display: "flex", flexDirection: "column", gap: 3.5, overflowY: "auto", overflowX: "hidden", width: "100%", boxSizing: "border-box", minWidth: 0 }}>

                    <Box className="animate-fade-in" sx={{ textAlign: "left" }}>
                        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#1C1712", mb: 1 }}>
                            Welcome back, <Box component="span" sx={{ color: "#8C6A1F", fontWeight: 300 }}>Executive Partner</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#7A6F5E", fontSize: "14px", fontWeight: 300 }}>
                            Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                        </Typography>
                    </Box>

                    <Box className="animate-fade-in" sx={{ animationDelay: "100ms", width: "100%" }}>
                        {isLoadingStats ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: '#8C6A1F' }} /></Box>
                        ) : (
                            <StatsCards stats={stats} />
                        )}
                    </Box>

                    <Box className="animate-fade-in" sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3.5, alignItems: "stretch", animationDelay: "200ms" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}>
                            <Box sx={{ "& > div": interactiveClickEffect }}>
                                <PendingApproval />
                            </Box>
                            <Box sx={{ "& > div, & .MuiListItemButton-root": interactiveClickEffect }}>
                                {/* 👑 تمرير البيانات إلى المكون */}
                                <TopServices listings={topListings} isLoading={isLoadingStats} />
                            </Box>
                        </Box>
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