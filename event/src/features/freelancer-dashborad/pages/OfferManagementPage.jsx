import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../components/offers/OffersSlice.js";
import { Box, Typography } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import OfferTabs from "../components/offers/OfferTabs";
import OfferCard from "../components/offers/OfferCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";

export default function OfferManagementPage() {
    const dispatch = useDispatch();
    // جلب البيانات وحالة التحميل من الـ Store
    const { offers = [], isLoading } = useSelector((state) => state.OffersSlice);
    const [activeTab, setActiveTab] = useState("active");

    // جلب البيانات عند فتح الصفحة
    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    // فلترة البيانات بناءً على الحالة
    const safeOffers = Array.isArray(offers) ? offers : [];
    const filteredOffers = safeOffers.filter(offer => {
        if (!offer) return false;

        // الحالات الخمس:
        if (activeTab === "active")    return offer.status === "approved";
        if (activeTab === "pending")   return offer.status === "pending_approval";
        if (activeTab === "rejected")  return offer.status === "rejected";
        if (activeTab === "draft")     return offer.status === "draft";
        if (activeTab === "cancelled") return offer.status === "cancelled"; // الحالة الخامسة

        return true;
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary,
                transition: 'background-color 0.3s, color 0.3s'
            }}
        >
            <Sidebar />
            <Box sx={{ pl: '260px' }}>
                <Header title="My Catalog" />
                <Box
                    component="main"
                    sx={{ maxWidth: '1280px', mx: 'auto', p: 4 }}
                >
                    <PageBreadcrumb
                        title="My Catalog"
                        subtitle="Track the status of your offers and manage them easily."
                    />

                    <OfferTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={{
                            active:    safeOffers.filter(o => o.status === "approved").length,
                            pending:   safeOffers.filter(o => o.status === "pending_approval").length,
                            rejected:  safeOffers.filter(o => o.status === "rejected").length,
                            draft:     safeOffers.filter(o => o.status === "draft").length,
                            cancelled: safeOffers.filter(o => o.status === "cancelled").length // العد للحالة الخامسة
                        }}
                    />

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <Typography sx={{ color: (theme) => theme.palette.text.secondary }}>
                                جاري تحميل خدماتك...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, maxWidth: '1280px', mx: 'auto' }}>
                            {filteredOffers.length > 0 ? (
                                filteredOffers.map(offer => (
                                    <OfferCard key={offer.id} offer={offer} />
                                ))
                            ) : (
                                <Typography
                                    sx={{
                                        gridColumn: '1 / -1',
                                        textAlign: 'center',
                                        color: (theme) => theme.palette.text.secondary
                                    }}
                                >
                                    لا توجد خدمات في هذا القسم حالياً.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}