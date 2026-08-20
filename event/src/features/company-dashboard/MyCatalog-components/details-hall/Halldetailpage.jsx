import React, { useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';

import HeroSection          from './detailshall-components/Herosection';
import GeneralInfo          from './detailshall-components/Generalinfo';
import PoliciesPricing      from './detailshall-components/Policiespricing';
import AvailabilityCalendar from './detailshall-components/Availabilitycalendar';
import BookingPipeline      from './detailshall-components/Bookingpipeline';

import { fetchProviderBookings } from '../myCatalogSlice';
import { fixImageUrl } from "../../../../utils/imageUrlHelper";

// استيراد صورة الخلفية المطلوبة والألوان الفاخرة
import dashboardBg from '../../../../assets/sidebar-bg.jpg';
import { GOLD, BROWN_TEXT } from '../../../../utils/colorConstants';

export default function Halldetailpage({ hallId, onBack, onEdit, highlightedBookingId }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { services: halls, bookings = [] } = useSelector((state) => state.myCatalog || {});
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    useEffect(() => {
        dispatch(fetchProviderBookings());
    }, [dispatch]);

    // التمرير التلقائي لقسم الحجوزات
    useEffect(() => {
        if (highlightedBookingId) {
            const timer = setTimeout(() => {
                const section = document.getElementById('booking-pipeline-section');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [highlightedBookingId]);

    const rawData = halls?.find(h => h.id === hallId);

    if (!rawData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
                {/* خلفية شاشة التحميل */}
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', filter: 'blur(20px)', zIndex: -2 }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: isDark ? 'rgba(16, 22, 31, 0.85)' : 'rgba(253, 247, 237, 0.8)', zIndex: -1 }} />
                <CircularProgress sx={{ color: GOLD }} />
            </Box>
        );
    }

    const firstVariant = rawData.variants?.[0] || {};

    const mappedHall = {
        id: rawData.id,
        badge: rawData.category?.name?.en || rawData.category?.name?.ar || rawData.category?.name || 'Banquet Hall',
        name: rawData.title?.en || rawData.title || 'Untitled Hall',
        description: rawData.description?.en || rawData.description || '',

        images: rawData.images?.length > 0
            ? rawData.images.map(img => fixImageUrl(img.url || img.path))
            : [fixImageUrl(null)],

        generalInfo: {
            description: rawData.description?.en || rawData.description || '',
            management: providerData.brand_name || 'Company Management',
            managementLogo: providerData.avatar || null,
            primaryContact: providerData.user?.email || 'No contact provided',
            primaryPhone: providerData.user?.phone || rawData.secondary_contact_number || '',
            secondaryPhone: rawData.secondary_contact_number || '',
            district: rawData.district?.name?.en || rawData.district?.name?.ar || rawData.district?.name || 'Unknown',
            category: rawData.category?.name?.en || rawData.category?.name?.ar || rawData.category?.name || 'Category',
        },

        policies: {
            priceAmount: firstVariant.price ? firstVariant.price.toLocaleString() : '0',
            currency: firstVariant.currency || 'USD',
            capacity: firstVariant.stock_quantity || firstVariant.stock || 'Not specified',
            priceType: firstVariant.price_type?.toUpperCase() || 'HOURLY',
            cancelPolicies: {
                beforeAcceptance: !!rawData.cancel_before_acceptance,
                afterAcceptance: !!rawData.cancel_after_acceptance,
                beforePayment: !!rawData.cancel_before_payment,
            },
            cancellationNote: 'Policies applied automatically based on provider settings.',
        },

        availabilities: firstVariant.availabilities || []
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(rawData);
        }
    };

    const handlePublish = () => console.log('Publish venue clicked');
    const handleBookSlot = ({ day, year, month, slot }) => console.log('Book slot:', { day, year, month, slot });

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', position: 'relative', pb: 6 }}>

            {/* ── 1. الصورة الخلفية المضببة ── */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${dashboardBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(22px)',
                    transform: 'scale(1.1)',
                    zIndex: -2,
                }}
            />

            {/* ── 2. طبقة التغميق/التفتيح لتوضيح المحتوى ── */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: isDark ? 'rgba(16, 22, 31, 0.75)' : 'rgba(253, 247, 237, 0.7)',
                    zIndex: -1,
                }}
            />

            {/* 💡 3. زر العودة أصبح خارج صندوق الصورة (في الأعلى بمحاذاة باقي الصفحة) ── */}
            <Box sx={{ width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 }, pt: 3, pb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    onClick={onBack}
                    startIcon={<ArrowBackIcon sx={{ fontSize: '1rem !important' }}/>}
                    sx={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(8px)',
                        color: isDark ? '#fff' : BROWN_TEXT,
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : alpha(BROWN_TEXT, 0.2)}`,
                        fontSize: '0.78rem', fontWeight: 700,
                        textTransform: 'none', px: 2, py: 0.8, borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
                            borderColor: GOLD
                        }
                    }}
                >
                    Back to Catalog
                </Button>
            </Box>

            {/* ── 4. صورة الـ Hero (بدون الزر) ── */}
            <Box sx={{ position: 'relative', width: '100%' }}>
                <HeroSection data={{ ...mappedHall, onEdit: handleEdit, onPublish: handlePublish }} />
            </Box>

            {/* ── 5. باقي المحتوى ── */}
            <Box sx={{ mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <GeneralInfo data={mappedHall.generalInfo} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', mb: '1.6%' }}>
                        <PoliciesPricing data={mappedHall.policies} />
                    </Box>
                </Box>

                <AvailabilityCalendar availabilities={mappedHall.availabilities} onBookSlot={handleBookSlot} />

                {/* 💡 غلاف مع ID لتوجيه السكرول بدقة */}
                <Box id="booking-pipeline-section" sx={{ mt: 4 }}>
                    <BookingPipeline
                        entityId={hallId}
                        bookingsData={bookings}
                        highlightedBookingId={highlightedBookingId}
                    />
                </Box>
            </Box>
        </Box>
    );
}