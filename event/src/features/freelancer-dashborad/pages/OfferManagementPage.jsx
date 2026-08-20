import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../components/offers/OffersSlice.js";
import { Box, Typography, useTheme } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import OfferTabs from "../components/offers/OfferTabs";
import OfferCard from "../components/offers/OfferCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";

export default function OfferManagementPage() {
    const dispatch = useDispatch();
    const theme = useTheme();

    // جلب البيانات وحالة التحميل من الـ Store
    const { offers = [], isLoading } = useSelector((state) => state.OffersSlice);
    const [activeTab, setActiveTab] = useState("active");

    // 👑 ستايل زجاجي محدث: ألوان أهدأ ومريحة للعين في اللايت مود (أوف وايت شفاف)
    const glassSx = {
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.65)' : 'rgba(250, 248, 245, 0.55)',
        backdropFilter: 'blur(16px)', // زيادة الغبش قليلاً لتباين أفضل
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(130, 120, 110, 0.08)'
    };

    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    const safeOffers = Array.isArray(offers) ? offers : [];
    const filteredOffers = safeOffers.filter(offer => {
        if (!offer) return false;
        if (activeTab === "active")    return offer.status === "approved";
        if (activeTab === "pending")   return offer.status === "pending_approval";
        if (activeTab === "rejected")  return offer.status === "rejected";
        if (activeTab === "draft")     return offer.status === "draft";
        if (activeTab === "cancelled") return offer.status === "cancelled";
        return true;
    });

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            // 👑 تدرج لوني أدافئ وأهدأ للعين في اللايت مود
            backgroundImage: theme.palette.mode === 'dark'
                ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            color: theme.palette.text.primary,
        }}>
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="My Catalog" />

                <Box component="main" sx={{ flex: 1, overflowY: 'auto', px: { xs: 3, md: 4, lg: 5 }, py: 3.5, display: 'flex', flexDirection: 'column' }}>

                    <Box sx={{ ...glassSx, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                cancelled: safeOffers.filter(o => o.status === "cancelled").length
                            }}
                        />

                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                <Typography sx={{ color: theme.palette.text.secondary }}>
                                    جاري تحميل خدماتك...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {filteredOffers.length > 0 ? (
                                    filteredOffers.map(offer => (
                                        <Box key={offer.id} sx={{
                                            width: '100%',
                                            p: 2,
                                            ...glassSx,
                                            // 👑 تخفيف لون خلفية البطاقة الداخلية لتجنب السطوع العالي
                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.35)',
                                            boxShadow: 'none' // إزالة الظل الداخلي لمظهر أنظف
                                        }}>
                                            <OfferCard offer={offer} />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, py: 4 }}>
                                        لا توجد خدمات في هذا القسم حالياً.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}