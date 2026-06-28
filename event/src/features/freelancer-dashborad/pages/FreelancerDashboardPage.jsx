import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";

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

const MOCK_REQUESTS = [
    { id: 1, title: "Luxury Wedding Arrangement", submittedAt: "Submitted 2 hours ago",  status: "UNDER REVIEW" },
    { id: 2, title: "Crystal Centerpiece Design", submittedAt: "Submitted yesterday",     status: "VERIFIED" },
    { id: 3, title: "Royal Theme Selection",      submittedAt: "Submitted 3 days ago",   status: "ACTION REQUIRED" },
];

const MOCK_ACTIVITIES = [
    { id: 1, iconType: "person",   message: "**Elena Vance** applied for your service.",              timeAgo: "5 minutes ago" },
    { id: 2, iconType: "payment",  message: "Payment for **Project Emerald** released.",              timeAgo: "28 minutes ago" },
    { id: 3, iconType: "star",     message: "You received a **5-star rating** from Lumina Lighting.", timeAgo: "1 hour ago" },
    { id: 4, iconType: "business", message: "Profile view from **Elite Catering Co.**",               timeAgo: "4 hours ago" },
];

const FreelancerDashboardPage = () => {
    const [activeNav, setActiveNav] = useState("dashboard");

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", overflow: "hidden" }}>
            <Sidebar activeNav={activeNav} onNavChange={setActiveNav} user={MOCK_USER} />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Freelancer Portal" notificationCount={3} isOnline={true} />

                {/* 👈 1. تم توسيع الهوامش الجانبية في الشاشات الكبيرة lg: 6 */}
                <Box component="main" sx={{ flex: 1, px: { xs: 3, md: 5, lg: 6 }, py: 4.5, overflowY: "auto" }}>

                    <Box sx={{ mb: 4.5, pt: 0.5 }}>
                        {/* 👈 2. تم تكبير خط الترحيب ليصبح 2.6rem ويتسيد الصفحة */}
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontWeight: 400, color: "text.primary", fontSize: { xs: "2rem", md: "2.6rem" }, mb: 1.2, lineHeight: 1.2 }}>
                            Welcome back, <Box component="span" sx={{ color: "primary.main", fontStyle: "italic" }}>{MOCK_USER.name}</Box>
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: "0.95rem", fontFamily: "'Raleway', sans-serif", maxWidth: 700, lineHeight: 1.65 }}>
                            Curating unforgettable moments through design. Your portfolio is currently viewed by 12 exclusive planners.
                        </Typography>
                    </Box>

                    <StatsRow stats={MOCK_STATS} />

                    {/* 👈 3. توازن الشبكة السفلية 7 مقابل 5، وزيادة الفراغ بينهما spacing={4} */}
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={7}>
                            <PendingRequests requests={MOCK_REQUESTS} onViewAll={() => {}} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <RecentActivity activities={MOCK_ACTIVITIES} onViewFullLog={() => {}} />
                        </Grid>
                    </Grid>

                    <Footer />
                </Box>
            </Box>
        </Box>
    );
};

export default FreelancerDashboardPage;