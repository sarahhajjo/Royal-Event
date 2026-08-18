import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar         from "../components/layout/Sidebar";
import Header          from "../components/layout/Header";
import Footer          from "../components/layout/Footer";
import StatsRow        from "../components/dashboard/StatsRow";
import PendingRequests from "../components/dashboard/PendingRequests";
import RecentActivity  from "../components/dashboard/RecentActivity";

const MOCK_USER = { name: "Marcus Thorne", role: "Expert Stylist", avatar: "" };

const MOCK_STATS = {
    totalEarnings: "$12.4k", earningsTrend: "+14% this month",
    activeOrders: "08", ordersActionNeeded: 3,
    completion: 65, rating: "4.9", ratingStatus: "Top Rated status pending",
};

const MOCK_ACTIVITIES = [
    { id: 1, iconType: "person",   message: "**Elena Vance** applied for your service.",              timeAgo: "5 minutes ago" },
    { id: 2, iconType: "payment",  message: "Payment for **Project Emerald** released.",              timeAgo: "28 minutes ago" },
    { id: 3, iconType: "star",     message: "You received a **5-star rating** from Lumina Lighting.", timeAgo: "1 hour ago" },
    { id: 4, iconType: "business", message: "Profile view from **Elite Catering Co.**",               timeAgo: "4 hours ago" },
];

const FreelancerDashboardPage = () => {
    const theme = useTheme();
    const [activeNav, setActiveNav] = useState("dashboard");
    const navigate = useNavigate();

    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    // 👑 ستايل زجاجي موحد لجميع البطاقات يتكيف مع الثيم (داكن / فاتح) مثل باقي الصفحات
    const glassSx = {
        background: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.65)' : 'rgba(250, 248, 245, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(130, 120, 110, 0.08)',
        p: 4,
        height: "100%",
        minHeight: "450px",
        boxSizing: "border-box",
    };

    useEffect(() => {
        const fetchMyServices = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/listings/provider/my-services", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let services = response.data.data || response.data || [];

                const pendingOnly = services.filter(
                    item => item.status === "pending_approval" || item.moderation_status === "pending" || item.status === "pending"
                );

                const formattedRequests = pendingOnly.slice(0, 4).map(item => ({
                    id: item.id,
                    title: item.title?.en || item.title?.ar || item.title || item.name || "Untitled Service",
                    submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently",
                    status: (item.status || item.moderation_status || "PENDING").replace("_", " ").toUpperCase(),
                }));

                setPendingRequests(formattedRequests);
            } catch (error) {
                console.error("Failed to fetch pending requests:", error);
            } finally {
                setIsLoadingRequests(false);
            }
        };

        fetchMyServices();
    }, []);

    const handleViewAllOrders = () => {
        navigate("/order-managment");
    };

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            // 👑 تدرج لوني يتكيف مع الوضع الفاتح والداكن لدعم صورة القلعة
            backgroundImage: theme.palette.mode === 'dark'
                ? `linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url('/images/image_58ec0a.jpg')`
                : `linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url('/images/image_58ec0a.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            color: theme.palette.text.primary
        }}>
            <Sidebar activeNav={activeNav} onNavChange={setActiveNav} user={MOCK_USER} />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Freelancer Portal" notificationCount={3} isOnline={true} />

                <Box component="main" sx={{
                    flex: 1,
                    px: { xs: 3, md: 4, lg: 5 },
                    py: 3.5,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3.5
                }}>

                    {/* عنوان الترحيب */}
                    <Box sx={{ pt: 0.5 }}>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontWeight: 400, color: theme.palette.text.primary, fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1, lineHeight: 1.2 }}>
                            Welcome back, <Box component="span" sx={{ color: "primary.main", fontStyle: "italic" }}>{MOCK_USER.name}</Box>
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem", fontFamily: "'Raleway', sans-serif", maxWidth: 700, lineHeight: 1.6 }}>
                            Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                        </Typography>
                    </Box>

                    {/* صف الإحصائيات العلوي */}
                    <Box sx={{ width: "100%" }}>
                        <StatsRow stats={MOCK_STATS} />
                    </Box>

                    {/* شبكة الأقسام السفلية */}
                    <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
                        <Grid item xs={12} md={7} sx={{ pl: { md: 0 } }}>
                            <Box sx={glassSx}>
                                {isLoadingRequests ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                        <CircularProgress sx={{ color: "primary.main" }} />
                                    </Box>
                                ) : (
                                    <PendingRequests
                                        requests={pendingRequests}
                                        onViewAll={handleViewAllOrders}
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={glassSx}>
                                <RecentActivity activities={MOCK_ACTIVITIES} onViewFullLog={() => {}} />
                            </Box>
                        </Grid>
                    </Grid>

                    <Footer />
                </Box>
            </Box>
        </Box>
    );
};

export default FreelancerDashboardPage;