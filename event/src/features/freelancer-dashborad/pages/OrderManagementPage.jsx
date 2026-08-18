import React, { useState, useContext, useEffect } from "react";
import { ColorModeContext } from "../../../main.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/orders/StatCard";
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
    const { toggleColorMode, mode } = useContext(ColorModeContext);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("active");

    // قراءة البيانات من Redux بدلاً من المصفوفة الوهمية
    const orders = useSelector(selectAllOrders);
    const loadingStatus = useSelector(selectOrdersStatus);

    // جلب البيانات عند فتح الصفحة لأول مرة
    useEffect(() => {
        if (loadingStatus === "idle") {
            dispatch(fetchProviderBookings());
        }
    }, [dispatch, loadingStatus]);

    // تطبيق الفلترة على الطلبات القادمة من الباك إند
    const filteredOrders = orders.filter(TAB_FILTERS[activeTab] ?? (() => true));

    // حساب أعداد الطلبات لكل تبويب
    const tabCounts = Object.fromEntries(
        Object.entries(TAB_FILTERS).map(([key, filterFn]) => [
            key,
            orders.filter(filterFn).length,
        ])
    );

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary,
                transition: 'background-color 0.3s, color 0.3s'
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1 }}>
                <Header />

                <Box
                    component="main"
                    sx={{
                        mx: 'auto',
                        maxWidth: '1152px', // ~ max-w-6xl
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    <PageBreadcrumb
                        title="Order Management"
                        subtitle="Oversee your royal event requests, manage bookings, and coordinate with clients."
                    />

                    {/* بطاقات الإحصائيات */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                            gap: 2
                        }}
                    >
                        <StatCard label="Total earnings" value="SAR 0" />
                        <StatCard label="Pending tasks" value={tabCounts.active || 0} />
                        <StatCard label="Client rating" value="0.0 ★" />
                        <StatCard label="Success rate" value="0%" />
                    </Box>

                    <OrderTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={tabCounts}
                    />

                    {/* قائمة الطلبات مع حالة التحميل */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                        {loadingStatus === "loading" ? (
                            <Box
                                sx={{
                                    gridColumn: '1 / -1',
                                    borderRadius: '12px',
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    bgcolor: (theme) => theme.palette.background.paper,
                                    p: 5,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>
                                    Loading your bookings...
                                </Typography>
                            </Box>
                        ) : filteredOrders.length === 0 ? (
                            <Box
                                sx={{
                                    gridColumn: '1 / -1',
                                    borderRadius: '12px',
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    bgcolor: (theme) => theme.palette.background.paper,
                                    p: 5,
                                    textAlign: 'center'
                                }}
                            >
                                <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>
                                    No requests in this category yet.
                                </Typography>
                            </Box>
                        ) : (
                            filteredOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}