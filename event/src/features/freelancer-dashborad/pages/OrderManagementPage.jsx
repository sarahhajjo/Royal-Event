import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import OrderTabs from "../components/orders/OrderTabs";
import OrderCard from "../components/orders/OrderCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import { fetchProviderBookings, selectAllOrders, selectOrdersStatus } from "../components/orders/OrdersSlice.js";

const TAB_FILTERS = {
    active: (order) => order.status === "pending" || order.status === "confirmed" || order.status === "accepted",
    confirmed: (order) => order.status === "confirmed" || order.status === "accepted",
    pending_payment: (order) => order.status === "pending_payment" || order.status === "unpaid",
    completed: (order) => order.status === "completed",
    rejected: (order) => order.status === "rejected" || order.status === "cancelled",
};

export default function OrderManagementPage() {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("active");

    const orders = useSelector(selectAllOrders);
    const loadingStatus = useSelector(selectOrdersStatus);

    useEffect(() => {
        if (loadingStatus === "idle") {
            dispatch(fetchProviderBookings());
        }
    }, [dispatch, loadingStatus]);

    const filteredOrders = orders.filter(TAB_FILTERS[activeTab] ?? (() => true));

    const tabCounts = Object.fromEntries(
        Object.entries(TAB_FILTERS).map(([key, filterFn]) => [
            key,
            orders.filter(filterFn).length,
        ])
    );

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم الفاتح والداكن
    const glassSx = {
        background: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: theme.palette.mode === 'dark' ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
    };

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                // 👑 تدرج لوني يتفاعل بسلاسة مع الثيم لدعم صورة القلعة الخلفية
                backgroundImage: theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Order Management" />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, md: 4, lg: 5 },
                        py: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* الحاوية الزجاجية الكبرى التي تجمع عناصر الصفحة لتظهر بفخامة */}
                    <Box sx={{ ...glassSx, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                        <PageBreadcrumb
                            title="Order Management"
                            subtitle="Oversee your royal event requests, manage bookings, and coordinate with clients."
                        />

                        <OrderTabs
                            activeTab={activeTab}
                            onChange={setActiveTab}
                            counts={tabCounts}
                        />

                        {/* قائمة الطلبات مع حالة التحميل */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
                            {loadingStatus === "loading" ? (
                                <Box
                                    sx={{
                                        gridColumn: '1 / -1',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                                        bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.4)" : "rgba(255, 255, 255, 0.4)",
                                        p: 5,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                        Loading your bookings...
                                    </Typography>
                                </Box>
                            ) : filteredOrders.length === 0 ? (
                                <Box
                                    sx={{
                                        gridColumn: '1 / -1',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                                        bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.4)" : "rgba(255, 255, 255, 0.4)",
                                        p: 5,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                                        No requests in this category yet.
                                    </Typography>
                                </Box>
                            ) : (
                                filteredOrders.map((order) => (
                                    <Box key={order.id} sx={{
                                        width: '100%',
                                        p: 2,
                                        ...glassSx,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)',
                                        boxShadow: 'none'
                                    }}>
                                        <OrderCard order={order} />
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}