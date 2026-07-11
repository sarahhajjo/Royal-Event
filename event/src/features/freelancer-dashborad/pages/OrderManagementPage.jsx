import React, { useState, useContext } from "react";
import { ColorModeContext } from "../../../main.jsx"; // تأكدي من مسار الاستيراد الصحيح
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/orders/StatCard";
import OrderTabs from "../components/orders/OrderTabs";
import OrderCard from "../components/orders/OrderCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";

const ORDERS = [
    {
        id: "#REQ-8812",
        title: "Royal Banquet Setup",
        client: "Abdullah Al Saud",
        eventDate: "Oct 24, 2024",
        location: "Riyadh, Al Nakheel",
        price: "SAR 12,500",
        status: "pending",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
    },
    {
        id: "#REQ-9014",
        title: "Elite Portrait Session",
        client: "Sara Al Otaibi",
        eventDate: "Nov 02, 2024",
        location: "Jeddah, Waterfront",
        price: "SAR 7,500",
        status: "confirmed",
        image: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=600&auto=format&fit=crop",
    },
    {
        id: "#REQ-7721",
        title: "Floral Gala Decor",
        client: "Riyadh Events Group",
        eventDate: "Oct 12, 2024",
        price: "SAR 22,000",
        status: "cancelled",
        reason: "Client request",
        image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=600&auto=format&fit=crop",
    },
    {
        id: "#REQ-8550",
        title: "Calligraphy Invitations",
        client: "Princess Noura",
        eventDate: "Oct 30, 2024",
        price: "SAR 4,200",
        status: "rejected",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
    },
];

const TAB_FILTERS = {
    active: (order) => order.status === "pending" || order.status === "confirmed",
    confirmed: (order) => order.status === "confirmed",
    pending_payment: (order) => order.status === "pending_payment",
    completed: (order) => order.status === "completed",
    rejected: (order) => order.status === "rejected" || order.status === "cancelled",
};

export default function OrderManagementPage() {
    const { toggleColorMode, mode } = useContext(ColorModeContext);
    const [activeTab, setActiveTab] = useState("active");

    const filteredOrders = ORDERS.filter(TAB_FILTERS[activeTab] ?? (() => true));

    const tabCounts = Object.fromEntries(
        Object.entries(TAB_FILTERS).map(([key, filterFn]) => [
            key,
            ORDERS.filter(filterFn).length,
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
                        <StatCard label="Total earnings" value="SAR 124,500" />
                        <StatCard label="Pending tasks" value="12" />
                        <StatCard label="Client rating" value="4.9 ★" />
                        <StatCard label="Success rate" value="98%" />
                    </div>

                    <OrderTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={tabCounts}
                    />

                    {/* قائمة الطلبات */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filteredOrders.length === 0 ? (
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