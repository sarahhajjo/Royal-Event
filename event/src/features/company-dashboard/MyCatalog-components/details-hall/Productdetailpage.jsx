import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';

import HeroSection           from './detailshall-components/HeroSection';
import GeneralInfo           from './detailshall-components/GeneralInfo';
import ProductOptionsPricing from './details-product/ProductOptionsPricing';
import AvailabilityCalendar  from './detailshall-components/Availabilitycalendar';
import BookingPipeline       from './detailshall-components/BookingPipeline';

const fixImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/1200x600?text=No+Image";
    const BACKEND_URL = 'http://127.0.0.1:8000';
    let finalUrl = url;
    if (finalUrl.includes('/uploads/') && !finalUrl.includes('/storage/')) {
        finalUrl = finalUrl.replace('/uploads/', '/storage/uploads/');
    }
    if (finalUrl.startsWith('http')) return finalUrl;
    const cleanPath = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
    if (cleanPath.startsWith('/storage/')) return `${BACKEND_URL}${cleanPath}`;
    return `${BACKEND_URL}/storage${cleanPath}`;
};

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

export default function Productdetailpage({ productId, onBack }) {
    const theme = useTheme();
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    const { products = [] } = useSelector((state) => state.myCatalog || {});
    // 💡 جلب بيانات بروفايل الشركة للمنتجات
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    const rawProduct = products.find(p => p.id === productId);

    if (!rawProduct) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }
    const resolveText = (field) => {
        if (!field) return 'Untitled';
        if (typeof field === 'string') return field;
        return field.en || field.ar || 'Untitled';
    };
    const mappedVariants = rawProduct.variants?.map(v => ({
        id:             v.id,
        colorName:      v.name?.en || v.name?.ar || 'Default',
        colorHex:       getHexFromColorName(v.name?.en),

        // 💡 الصور الآن موجودة بداخل الـ variant نفسه في JSON
        images:         v.images?.length > 0
            ? v.images.map(img => fixImageUrl(img.path))
            : [fixImageUrl(null)], // أو صورة افتراضية

        quantity:       v.stock || 0,
        price:          v.price || 0,
        currency:       v.currency || 'SAR',
        paymentType:    v.price_type || 'fixed',
        availabilities: v.availabilities || []
    })) || [];
    const activeVariant = mappedVariants[selectedVariantIndex] || {};

    // 💡 تصحيح مسار جلب الحقول المدمجة (category و district) لتعمل مع كافة هياكل الباك إند
    const mappedProduct = {
        // 💡 تصحيح مسار الوصول لبيانات التصنيف والمنطقة (name_en/ar)
        badge:       rawProduct.category?.name_en || rawProduct.category?.name_ar || 'Product',
        name:        resolveText(rawProduct.title),
        description: rawProduct.description?.en || rawProduct.description?.ar || rawProduct.description || '',

        management:     providerData.brand_name || 'Company Management',
        managementLogo: providerData.avatar || null,
        primaryContact: providerData.user?.email || 'No email provided',
        primaryPhone:   providerData.user?.phone || 'No phone provided',
        secondaryPhone: '',

        district:    rawProduct.district?.name_en || rawProduct.district?.name_ar || 'Unknown District',
        category:    rawProduct.category?.name_en || rawProduct.category?.name_ar || 'Unknown Category',
    };
    const cancellationPolicies = {
        beforeAcceptance: rawProduct.cancel_before_acceptance,
        afterAcceptance:  rawProduct.cancel_after_acceptance,
        beforePayment:    rawProduct.cancel_before_payment,
    };

    const handleEdit    = () => console.log('Edit product clicked');
    const handlePublish = () => console.log('Publish product clicked');
    const handleBookSlot = ({ day, year, month, slot }) => console.log('Book slot:', { day, year, month, slot });

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pb: 6, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
                <Button onClick={onBack} startIcon={<ArrowBackIcon sx={{ fontSize: '1rem !important' }} />} sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', color: theme.palette.mode === 'dark' ? '#fff' : '#2B211E', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'none', px: 2, py: 0.8, borderRadius: 2, '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' } }}>
                    Back to Catalog
                </Button>
            </Box>

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

            <Box sx={{ mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        {/* 💡 التعديل الجذري: تحويل الخاصية من venue إلى data لتطابق الهيكل الجديد */}
                        <GeneralInfo data={mappedProduct} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <ProductOptionsPricing
                            policies={cancellationPolicies}
                            variants={mappedVariants}
                            selectedIndex={selectedVariantIndex}
                            onColorSelect={(index) => setSelectedVariantIndex(index)}
                        />
                    </Box>
                </Box>

                <AvailabilityCalendar availabilities={activeVariant.availabilities} onBookSlot={handleBookSlot} />
                <BookingPipeline />
            </Box>
        </Box>
    );
}