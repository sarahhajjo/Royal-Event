import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';

import HeroSection            from './detailshall-components/Herosection';
import GeneralInfo            from './detailshall-components/Generalinfo';
import ProductOptionsPricing  from './details-product/ProductOptionsPricing';
import AvailabilityCalendar   from './detailshall-components/Availabilitycalendar';
import BookingPipeline        from './detailshall-components/Bookingpipeline';
import { fetchProviderBookings } from "../myCatalogSlice";
import { fixImageUrl } from "../../../../utils/imageUrlHelper";

// 💡 استيراد صورة الخلفية والألوان الفاخرة
import dashboardBg from '../../../../assets/sidebar-bg.jpg';
import {
    GOLD, BROWN_TEXT,
    LIGHT_CARD, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER,
    DARK_CARD_SHADOW
} from '../../../../utils/colorConstants';

const getHexFromColorName = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('red')) return '#b05050';
    if (lowerName.includes('pink')) return '#e297a6';
    if (lowerName.includes('blue')) return '#4267B2';
    if (lowerName.includes('black')) return '#222222';
    if (lowerName.includes('white')) return '#f5f5f5';
    if (lowerName.includes('green')) return '#4CAF50';
    if (lowerName.includes('silver')) return '#C0C0C0';
    if (lowerName.includes('gold')) return '#D4AF37';
    return '#c5a059';
};

const resolveText = (field, fallback = 'Untitled') => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field.en || field.ar || fallback;
};

export default function Productdetailpage({ productId, onBack, onEdit, highlightedBookingId }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    const { products = [], bookings = [] } = useSelector((state) => state.myCatalog || {});
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    useEffect(() => {
        dispatch(fetchProviderBookings());
    }, [dispatch]);

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

    const rawProduct = products.find(p => p.id === productId);

    if (!rawProduct) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', filter: 'blur(20px)', zIndex: -2 }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: isDark ? 'rgba(16, 22, 31, 0.85)' : 'rgba(253, 247, 237, 0.8)', zIndex: -1 }} />
                <CircularProgress sx={{ color: GOLD }} />
            </Box>
        );
    }

    const mappedVariants = rawProduct.variants?.map(v => {
        const cName = resolveText(v.variant_name, resolveText(v.name, 'Default'));

        return {
            id:             v.id,
            colorName:      cName,
            colorHex:       getHexFromColorName(cName),
            images:         v.images?.length > 0 ? v.images.map(img => fixImageUrl(img)) : [fixImageUrl(null)],
            quantity:       v.stock_quantity || v.stock || 0,
            price:          v.price || 0,
            currency:       v.currency || 'SYP',
            paymentType:    v.price_type || 'fixed',
            availabilities: v.availabilities || []
        };
    }) || [];

    const activeVariant = mappedVariants[selectedVariantIndex] || {};

    const catName = resolveText(rawProduct.category?.name, 'Product');
    const distName = resolveText(rawProduct.district?.name, 'Unknown District');

    const mappedProduct = {
        badge:          catName,
        name:           resolveText(rawProduct.title),
        description:    resolveText(rawProduct.description, ''),
        management:     providerData.brand_name || 'Company Management',
        managementLogo: providerData.avatar || null,
        primaryContact: providerData.user?.email || 'No email provided',
        primaryPhone:   providerData.user?.phone || 'No phone provided',
        secondaryPhone: rawProduct.secondary_contact_number || '',
        district:       distName,
        category:       catName,
    };

    const cancellationPolicies = {
        beforeAcceptance: !!rawProduct.cancel_before_acceptance,
        afterAcceptance:  !!rawProduct.cancel_after_acceptance,
        beforePayment:    !!rawProduct.cancel_before_payment,
    };

    const handleEdit = () => {
        if (onEdit) onEdit(rawProduct);
    };

    const handlePublish = () => console.log('Publish product clicked');
    const handleBookSlot = ({ day, year, month, slot }) => console.log('Book slot:', { day, year, month, slot });

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', position: 'relative', pb: 6 }}>

            {/* ── 1. الصورة الخلفية الأساسية ── */}
            <Box
                sx={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover',
                    backgroundPosition: 'center', filter: 'blur(22px)', transform: 'scale(1.1)', zIndex: -2,
                }}
            />

            {/* ── 2. طبقة التغميق/التفتيح ── */}
            <Box
                sx={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: isDark ? 'rgba(16, 22, 31, 0.75)' : 'rgba(253, 247, 237, 0.7)', zIndex: -1,
                }}
            />

            {/* ── 3. الحاوية المركزية ── */}
            <Box sx={{ width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 }, pt: 4 }}>

                {/* زر العودة */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
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
                            '&:hover': { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)', borderColor: GOLD }
                        }}
                    >
                        Back to Catalog
                    </Button>
                </Box>

                {/* 💡 4. قسم الـ Hero */}
                <Box
                    sx={{
                        position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden',
                        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                        boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.15)', mb: 4,

                        // 💡 إعطاء ظل قوي للنص ليبقى مقروءاً تماماً حتى لو اختفى التدرج الأسود
                        '& .MuiTypography-root': {
                            textShadow: isDark ? '0px 2px 10px rgba(0,0,0,0.9) !important' : '0px 2px 8px rgba(255,255,255,0.8) !important'
                        }
                    }}
                >
                    <HeroSection
                        data={{
                            badge:       mappedProduct.badge,
                            name:        mappedProduct.name,
                            description: mappedProduct.description,
                            images:      activeVariant.images,
                            onEdit:      handleEdit,
                            onPublish:   handlePublish,
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>

                    {/* 💡 5. الكود السحري لفرض التصميم الزجاجي على GeneralInfo وإلغاء لونه البني القديم */}
                    <Box sx={{
                        flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
                        '& > div, & > section, & > article': {
                            backgroundColor: 'transparent !important',
                            background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                            backdropFilter: 'blur(16px) !important',
                            WebkitBackdropFilter: 'blur(16px) !important',
                            border: isDark ? `${DARK_CARD_BORDER} !important` : `1px solid ${LIGHT_BORDER} !important`,
                            boxShadow: 'none !important',
                            borderRadius: '24px !important',
                        }
                    }}>
                        <GeneralInfo data={mappedProduct} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <ProductOptionsPricing
                            policies={cancellationPolicies}
                            variants={mappedVariants}
                            selectedIndex={selectedVariantIndex}
                            onColorSelect={(index) => setSelectedVariantIndex(index)}
                            material={rawProduct.material_composition}
                        />
                    </Box>
                </Box>

                <AvailabilityCalendar availabilities={activeVariant.availabilities} onBookSlot={handleBookSlot} />

                <Box id="booking-pipeline-section" sx={{ mt: 4 }}>
                    <BookingPipeline
                        entityId={productId}
                        bookingsData={bookings}
                        highlightedBookingId={highlightedBookingId}
                    />
                </Box>
            </Box>
        </Box>
    );
}