import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import { fetchServiceDetails, clearServiceDetails } from "./ServiceDetailsSlice";
import { pickLocalized } from "../../../../i18n/localize.js";

const formatDate = (isoString, locale = "en-GB") => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function ServiceDetailsDrawer({
                                                 serviceId,
                                                 onClose,
                                                 onApprove,
                                                 onReject
                                             }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en-GB";

    const { serviceData, isLoading, error } = useSelector((state) => state.serviceDetails);

    useEffect(() => {
        if (serviceId) {
            dispatch(fetchServiceDetails(serviceId));
        }
        return () => {
            dispatch(clearServiceDetails());
        };
    }, [dispatch, serviceId]);

    // 👑 الستايل الزجاجي الموحد للدرج
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.85)" : "rgba(250, 248, 245, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderLeft: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
    };

    if (isLoading) {
        return (
            <Box sx={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                <Box sx={{ bgcolor: 'background.paper', px: 6, py: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CircularProgress size={24} color="primary" />
                    <Typography sx={{ fontWeight: 600, color: 'text.primary', fontFamily: "'Raleway', sans-serif" }}>Loading details...</Typography>
                </Box>
            </Box>
        );
    }

    if (error || !serviceData) {
        return (
            <Box sx={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                <Box sx={{ bgcolor: 'background.paper', p: 5, borderRadius: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3, border: '1px solid', borderColor: 'divider', maxWidth: 400, width: '100%' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'error.main', fontFamily: "'Raleway', sans-serif" }}>{error || "Service not found."}</Typography>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '10px', borderColor: 'divider', color: 'text.secondary' }}>
                        Close
                    </Button>
                </Box>
            </Box>
        );
    }

    const primaryVariant = serviceData.variants?.[0];
    const providerEntity = serviceData.company || serviceData.freelancer || {};
    const providerType = serviceData.company ? "Company" : serviceData.freelancer ? "Freelancer" : "Provider";

    const mappedService = {
        id: serviceData.id,
        title: pickLocalized(serviceData.title, "Untitled Service"),
        description: pickLocalized(serviceData.description, "No description available."),
        category: serviceData.category?.name || "Service Listing",
        location: serviceData.district?.name || "Location not specified",
        status: serviceData.status || "PENDING REVIEW",
        deadline: serviceData.created_at ? formatDate(serviceData.created_at, locale) : "No Date",
        pricing: {
            amount: primaryVariant?.price ?? 0,
            currency: primaryVariant?.currency || "USD",
            type: primaryVariant?.price_type === "fixed" ? "Fixed" : "Session",
        },
        providerInfo: {
            id: providerEntity.id || null,
            name: providerEntity.name || "Unknown Provider",
            email: providerEntity.email || providerEntity.user?.email || "No Email Provided",
            typeLabel: `Submitted By ${providerType}`
        },
        images: serviceData.images || [],
    };

    return (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', justifyContent: 'flex-end', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
            <Box sx={{ width: '100%', maxWidth: '650px', ...glassSx, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* --- Header --- */}
                <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: theme.palette.divider, display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
                    <Button
                        onClick={onClose}
                        sx={{
                            position: 'absolute', top: 24, left: 24, minWidth: '36px', width: '36px', height: '36px', borderRadius: '50%',
                            bgcolor: 'action.hover', color: 'text.secondary', '&:hover': { bgcolor: 'action.selected', color: 'text.primary' }
                        }}
                    >
                        ✕
                    </Button>
                    <Box sx={{ textAlign: 'right', mt: 4 }}>
                        <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 700, color: 'text.primary' }}>{mappedService.title}</Typography>
                        <Box component="span" sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1.5, mt: 1.5, px: 2, py: 0.5,
                            bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main', fontSize: '0.7rem', fontWeight: 700,
                            letterSpacing: '0.1em', borderRadius: '999px', border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}>
                            STATUS: {mappedService.status.toUpperCase()}
                            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                        </Box>
                    </Box>
                </Box>

                {/* --- Content --- */}
                <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* معرض الصور */}
                    {mappedService.images.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, uppercase: true, letterSpacing: '0.12em', mb: 1.5 }}>Service Images</Typography>
                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.divider, borderRadius: '4px' } }}>
                                {mappedService.images.map((img) => (
                                    <Box
                                        key={img.id}
                                        component="img"
                                        src={img.url}
                                        alt={img.alt || "Service Image"}
                                        sx={{ width: 192, height: 128, objectFit: 'cover', borderRadius: '10px', border: '1px solid', borderColor: theme.palette.divider, flexShrink: 0 }}
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* معلومات الناشر */}
                    <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px', p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>
                            🏢
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.5 }}>
                                {mappedService.providerInfo.typeLabel}
                            </Typography>

                            {mappedService.providerInfo.id ? (
                                <Button
                                    onClick={() => navigate(`/admin-dashboard/companies/${mappedService.providerInfo.id}`)}
                                    sx={{ p: 0, minWidth: 0, fontSize: '0.9rem', fontWeight: 700, color: 'primary.main', textTransform: 'none', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
                                >
                                    {mappedService.providerInfo.name}
                                </Button>
                            ) : (
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: theme.palette.text.primary }}>{mappedService.providerInfo.name}</Typography>
                            )}

                            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 0.5 }}>📧 {mappedService.providerInfo.email}</Typography>
                        </Box>
                    </Box>

                    {/* شبكة المعلومات */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.5 }}>Category</Typography>
                            <Typography sx={{ fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>{mappedService.category}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.5 }}>Rate</Typography>
                            <Typography sx={{ fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>{mappedService.pricing.type} / {mappedService.pricing.amount} {mappedService.pricing.currency}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.5 }}>Created At</Typography>
                            <Typography sx={{ fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>{mappedService.deadline} 📅</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 0.5 }}>Location</Typography>
                            <Typography sx={{ fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>{mappedService.location} 📍</Typography>
                        </Box>
                    </Box>

                    {/* الوصف */}
                    <Box sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: theme.palette.text.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', mb: 1.5 }}>Description & Features</Typography>
                        <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: theme.palette.divider, borderRadius: '12px', p: 3 }}>
                            <Typography sx={{ fontStyle: 'italic', color: theme.palette.text.secondary, lineHeight: 1.7, fontSize: '0.85rem' }}>
                                {mappedService.description}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* --- أزرار الإدارة للأدمن --- */}
                <Box sx={{ p: 4, bgcolor: theme.palette.background.paper, borderTop: '1px solid', borderColor: theme.palette.divider, display: 'flex', gap: 2, mt: 'auto' }}>
                    <Button
                        onClick={onReject}
                        variant="outlined"
                        fullWidth
                        sx={{ py: 1.2, borderRadius: '10px', borderColor: '#b91c1c', color: '#b91c1c', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: 'rgba(185, 28, 28, 0.1)' } }}
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={onApprove}
                        variant="contained"
                        fullWidth
                        sx={{ py: 1.2, borderRadius: '10px', flex: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                        Approve Submission
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}