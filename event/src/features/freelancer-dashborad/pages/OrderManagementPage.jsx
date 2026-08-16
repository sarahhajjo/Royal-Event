import React, { useState, useContext, useEffect } from "react";
import { ColorModeContext } from "../../../main.jsx";
import { useDispatch, useSelector } from "react-redux";

// استيراد الدوال من الـ Slice الجديد


import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/orders/StatCard";
import OrderTabs from "../components/orders/OrderTabs";
import OrderCard from "../components/orders/OrderCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import {fetchProviderBookings, selectAllOrders, selectOrdersStatus} from "../components/orders/OrdersSlice.js";

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
        <div dir="ltr" className="flex min-h-screen bg-bg-default text-text-primary transition-colors duration-300">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="mx-auto max-w-6xl space-y-6 p-6">
                    <PageBreadcrumb
                        title="Order Management"
                        subtitle="Oversee your royal event requests, manage bookings, and coordinate with clients."
                    />

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard label="Total earnings" value="SAR 0" />
                        <StatCard label="Pending tasks" value={tabCounts.active || 0} />
                        <StatCard label="Client rating" value="0.0 ★" />
                        <StatCard label="Success rate" value="0%" />
                    </div>

                    <OrderTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={tabCounts}
                    />

                    {/* قائمة الطلبات مع حالة التحميل */}
                    <div className="grid grid-cols-1 gap-4">
                        {loadingStatus === "loading" ? (
                            <div className="col-span-full rounded-xl border border-border bg-bg-paper p-10 text-center text-sm text-text-secondary">
                                Loading your bookings...
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="col-span-full rounded-xl border border-border bg-bg-paper p-10 text-center text-sm text-text-secondary">
                                No requests in this category yet.
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}