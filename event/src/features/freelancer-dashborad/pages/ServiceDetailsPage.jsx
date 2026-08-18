import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import axios from "axios";
import { fetchServiceDetails, clearServiceDetails } from "../components/service-details/ServiceDetailsSlice";
import { pickLocalized } from "../../../i18n/localize.js";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import { ServiceDetailsTopBar, ServiceOverviewCard, ServiceInfoGrid, ServiceBottomSection } from "../components/service-details";

const formatTime = (time) => (time ? time.slice(0, 5) : "");

const formatDate = (isoString, locale = "en-GB") => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

const fixImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    const imagePath = typeof img === 'string' ? img : (img.url || img.path || '');
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const BACKEND_URL = 'http://127.0.0.1:8000';
    let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }
    return `${BACKEND_URL}${cleanPath}`;
};

const buildAvailableDates = (variants = [], locale = "en-GB") =>
    variants.flatMap((variant) =>
        (variant.availabilities || []).flatMap((availability) =>
            (availability.slots || []).map((slot) => ({
                id: slot.id,
                dayLabel: formatDate(availability.available_date, locale),
                timeRange: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
                remainingCapacity: slot.remaining_capacity,
                variantName: pickLocalized(variant.name, "Option"),
            }))
        )
    );

export default function ServiceDetailsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en-GB";

    const handleDeleteService = async () => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://127.0.0.1:8000/api/listings/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate("/catalog");
            } catch (error) {
                console.error("Failed to delete service:", error);
                alert("حدث خطأ أثناء محاولة حذف الخدمة");
            }
        }
    };

    const { serviceData, isLoading, error } = useSelector((state) => state.serviceDetails);

    useEffect(() => {
        if (serviceId) {
            dispatch(fetchServiceDetails(serviceId));
        }

        return () => {
            dispatch(clearServiceDetails());
        };
    }, [dispatch, serviceId]);

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: { xs: 3, md: 4, lg: 5 },
    };

    if (isLoading) {
        return (
            <Box dir="ltr" sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2, fontSize: '1rem', fontFamily: "'Raleway', sans-serif" }}>Loading service details...</Typography>
            </Box>
        );
    }

    if (error || !serviceData) {
        return (
            <Box dir="ltr" sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, bgcolor: 'background.default', color: 'error.main' }}>
                <Typography sx={{ fontSize: '1.1rem' }}>{error || "Service not found."}</Typography>
                <Button
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    sx={{ borderRadius: '10px', borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    const primaryVariant = serviceData.variants?.[0];

    const mappedService = {
        id: serviceData.id,
        title: pickLocalized(serviceData.title, "Untitled"),
        description: pickLocalized(serviceData.description, "No description."),
        images:
            serviceData.images?.length > 0
                ? serviceData.images.map((img) => fixImageUrl(img))
                : primaryVariant?.images?.length > 0
                    ? primaryVariant.images.map((img) => fixImageUrl(img))
                    : ["https://placehold.co/1200x800/eeeeee/999999?text=No+Image"],
        category: serviceData.category?.name || "Uncategorized",
        location: serviceData.district?.name || "Unknown",
        status: serviceData.status || "pending",
        statusLabel: serviceData.moderation_status || "Pending",
        contact: {
            phone: serviceData.secondary_contact_number || "Not provided",
            location: serviceData.district?.name || "Unknown Location",
        },
        pricing: {
            priceType: primaryVariant?.price_type === "fixed" ? "Fixed Price" : "Variable",
            amount: serviceData.price ?? primaryVariant?.price ?? 0,
            currency: primaryVariant?.currency || "SAR",
        },
        serviceStatus: {
            currentStatus: serviceData.status === "approved" ? "Active" : "Pending Review",
            message: serviceData.status === "approved" ? "Live and visible." : "Being reviewed by our quality team.",
        },
        cancellationPolicy: {
            beforeAcceptance: Boolean(serviceData.cancel_before_acceptance),
            afterAcceptance: Boolean(serviceData.cancel_after_acceptance),
            beforePayment: Boolean(serviceData.cancel_before_payment),
        },
        variants: serviceData.variants?.map((v, i) => ({
            id: v.id || `v${i}`,
            label: `Option ${i + 1}`,
            name: pickLocalized(v.name, "Main Option"),
            description: pickLocalized(v.description, ""),
            amount: v.price || 0,
            currency: v.currency || "SAR",
            badge: i === 0 ? "BASE PRICE" : null,
        })) || [],
        dates: buildAvailableDates(serviceData.variants, locale),
    };

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: isDark
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
                <Header title="Service Details" />

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
                    <Box sx={{ ...glassSx, maxWidth: '1152px', mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <ServiceDetailsTopBar
                            serviceId={mappedService.id}
                            status={mappedService.status}
                            statusLabel={mappedService.statusLabel}
                            onBack={() => navigate(-1)}
                        />

                        {/* أزرار الإدارة (تعديل وحذف) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                onClick={() => navigate(`/edit-service/${serviceId}`)}
                                variant="contained"
                                sx={{ borderRadius: '10px', textTransform: 'none', px: 3, py: 1, fontWeight: 700, fontSize: '0.85rem' }}
                            >
                                Edit Service
                            </Button>

                            <Button
                                onClick={handleDeleteService}
                                variant="outlined"
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                    color: '#f87171',
                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.3)' }
                                }}
                            >
                                Delete Service
                            </Button>
                        </Box>

                        <ServiceOverviewCard
                            title={serviceData.title}
                            description={serviceData.description}
                            category={serviceData.category?.name}
                            location={serviceData.district?.name}
                            images={mappedService.images}
                        />

                        <ServiceInfoGrid
                            contact={mappedService.contact}
                            pricing={mappedService.pricing}
                            status={mappedService.serviceStatus}
                            policy={mappedService.cancellationPolicy}
                        />

                        <ServiceBottomSection
                            variants={mappedService.variants}
                            dates={mappedService.dates}
                            materialComposition={serviceData.material_composition}
                            calendarProps={{
                                monthLabel: "July 2026",
                                onPrevMonth: () => {},
                                onNextMonth: () => {},
                                onViewAll: () => navigate(`/catalog/services/${serviceId}/schedule`),
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}