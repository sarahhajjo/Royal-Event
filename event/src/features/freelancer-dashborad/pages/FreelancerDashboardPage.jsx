import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Sidebar         from "../components/layout/Sidebar";
import Header          from "../components/layout/Header";
import Footer          from "../components/layout/Footer";
import StatsRow        from "../components/dashboard/StatsRow";
import PendingRequests from "../components/dashboard/PendingRequests";
import RecentActivity  from "../components/dashboard/RecentActivity";
import freelancerOrderService from "../../../services/freelancerService/freelancerOrderService.js";
import freelancerCatalogService from "../../../services/freelancerService/freelancerCatalogService";

const MOCK_USER = { name: "Provider", role: "Expert", avatar: "" };

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

    const currentUser = useSelector((state) => state.auth?.user);
    const displayUser = currentUser || MOCK_USER;

    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);
    const [stats, setStats] = useState({
        totalEarnings: "$0.00", earningsTrend: "loading...",
        activeOrders: "0", ordersActionNeeded: 0,
        services: 0, rating: "0.0", ratingStatus: "Loading...",
    });

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
        const fetchDashboardData = async () => {
            try {
                const walletData = await freelancerOrderService.getProviderWallet();
                const bookingsResponse = await freelancerOrderService.getProviderBookings();
                const bookingsData = bookingsResponse.data || bookingsResponse || [];

                const servicesResponse = await freelancerCatalogService.getMyListings();
                const servicesData = servicesResponse.data || servicesResponse || [];

                // 👑 جلب مراجعات المزود بناءً على الـ ID الخاص به مع حماية البيانات الفارغة
                let myRating = 0;
                const providerId = currentUser?.provider_id || currentUser?.id;

                if (providerId) {
                    try {
                        const reviewsResponse = await freelancerCatalogService.getProviderReviews(providerId);

                        // 💡 استخراج آمن جداً للمصفوفة مهما كان شكل الرد من الباك إند
                        let reviewsArray = [];
                        if (reviewsResponse?.data?.data && Array.isArray(reviewsResponse.data.data)) {
                            reviewsArray = reviewsResponse.data.data; // حالة الـ Pagination
                        } else if (reviewsResponse?.data && Array.isArray(reviewsResponse.data)) {
                            reviewsArray = reviewsResponse.data; // حالة المصفوفة المباشرة
                        } else if (Array.isArray(reviewsResponse)) {
                            reviewsArray = reviewsResponse;
                        }

                        // 💡 التحقق إذا كانت الداتا فاضية
                        if (reviewsArray.length > 0) {
                            const totalRating = reviewsArray.reduce((sum, review) => sum + Number(review.rating || 0), 0);
                            myRating = totalRating / reviewsArray.length;
                        } else {
                            // إذا كانت الداتا فاضية تماماً، التقييم يبقى صفر
                            myRating = 0;
                        }
                    } catch (reviewErr) {
                        console.error("Failed to fetch reviews:", reviewErr);
                        myRating = 0; // في حال فشل الـ API نضع التقييم صفر بدل أن يتعطل الموقع
                    }
                }

                const acceptedServices = Array.isArray(servicesData) ? servicesData.filter(
                    item => {
                        const status = (item.status || item.moderation_status || "").toLowerCase();
                        return status === "approved" || status === "accepted" || status === "active";
                    }
                ) : [];

                const pendingOnly = Array.isArray(bookingsData) ? bookingsData.filter(
                    item => item.status === "pending" || item.status === "pending_approval"
                ) : [];

                const actualBalance = walletData.wallet_balance || walletData.data?.wallet_balance || 0;

                const formattedRequests = pendingOnly.slice(0, 4).map(item => ({
                    id: item.id,
                    title: item.service_title || item.title || "Booking Request",
                    submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recently",
                    status: (item.status || "PENDING").replace("_", " ").toUpperCase(),
                }));

                setPendingRequests(formattedRequests);

                setStats({
                    totalEarnings: actualBalance > 0 ? `${Number(actualBalance).toLocaleString()} ل.س` : "$0.00",
                    earningsTrend: walletData.trend || "+0% this month",
                    activeOrders: String(pendingOnly.length || 0),
                    ordersActionNeeded: pendingOnly.length,
                    services: acceptedServices.length,
                    // 👑 تحديث التقييم وعرضه بمنزلة عشرية واحدة
                    rating: myRating > 0 ? myRating.toFixed(1) : "0.0",
                    ratingStatus: myRating >= 4.5 ? "Top Rated provider" : (myRating === 0 ? "No ratings yet" : "Keep improving"),
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoadingRequests(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const handleViewAllOrders = () => {
        navigate("/order-managment");
    };

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            backgroundImage: theme.palette.mode === 'dark'
                ? `linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url('/images/image_58ec0a.jpg')`
                : `linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url('/images/image_58ec0a.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            color: theme.palette.text.primary
        }}>
            <Sidebar activeNav={activeNav} onNavChange={setActiveNav} user={displayUser} />

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

                    <Box sx={{ pt: 0.5 }}>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontWeight: 400, color: theme.palette.text.primary, fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1, lineHeight: 1.2 }}>
                            Welcome back, <Box component="span" sx={{ color: "primary.main", fontStyle: "italic" }}>
                            {displayUser.first_name || displayUser.name}
                        </Box>
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem", fontFamily: "'Raleway', sans-serif", maxWidth: 700, lineHeight: 1.6 }}>
                            Elevating standard event coordination to a fine art. Your portfolio of exclusive reserves is performing at peak efficiency today.
                        </Typography>
                    </Box>

                    <Box sx={{ width: "100%" }}>
                        <StatsRow stats={stats} />
                    </Box>

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