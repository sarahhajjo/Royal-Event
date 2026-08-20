import React, { useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';

import Herosection from './detailshall-components/Herosection';
import Generalinfo from './detailshall-components/Generalinfo';
import Policiespricing from './detailshall-components/Policiespricing';
import Availabilitycalendar from './detailshall-components/Availabilitycalendar';
import Bookingpipeline from './detailshall-components/Bookingpipeline';
import ServicesProviders from './details-arrangment/ServicesProviders';
import ArrangementProducts from './details-arrangment/ArrangementProducts';

import { fetchProviderBookings, fetchCompanyFreelancers } from '../myCatalogSlice';
import { fixImageUrl } from '../../../../utils/imageUrlHelper';

// استيراد صورة الخلفية المطلوبة
import dashboardBg from '../../../../assets/sidebar-bg.jpg';

// استيراد الألوان الفاخرة
import { GOLD, BROWN_TEXT } from '../../../../utils/colorConstants';

const resolveText = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    if (entity.name_en) return entity.name_en;
    if (entity.name?.en) return entity.name.en;
    if (typeof entity.name === 'string') return entity.name;
    if (entity.en) return entity.en;
    return null;
};

export default function ArrangmentDetailPage({ arrangementId, onBack, onEdit, highlightedBookingId }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { arrangements, bookings = [], companyFreelancers = [] } = useSelector((state) => state.myCatalog || {});
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    useEffect(() => {
        dispatch(fetchProviderBookings());
        dispatch(fetchCompanyFreelancers());
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

    const rawData = arrangements?.find(a => a.id === arrangementId);

    if (!rawData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${dashboardBg})`, backgroundSize: 'cover', filter: 'blur(20px)', zIndex: -2 }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: isDark ? 'rgba(16, 22, 31, 0.85)' : 'rgba(253, 247, 237, 0.8)', zIndex: -1 }} />
                <CircularProgress sx={{ color: GOLD }} />
            </Box>
        );
    }

    const arrangementAvailabilities = (rawData.availabilities && rawData.availabilities.length > 0)
        ? rawData.availabilities
        : (rawData.variants?.[0]?.availabilities || []);

    const productsList = [];
    if (rawData.items && Array.isArray(rawData.items)) {
        rawData.items.forEach(item => {
            const variant = item.variant || item.includedVariant || item.includedvariant;
            if (!variant) return;
            const listing = variant.listing;
            const rawImage = variant.image || variant.images?.[0] || listing?.images?.[0] || listing?.image || null;

            productsList.push({
                name: resolveText(listing?.title) || resolveText(variant.variant_name) || 'Product',
                variants: [{
                    colorName: resolveText(variant.variant_name) || 'Standard',
                    price: variant.price || 0,
                    currency: variant.currency || rawData.currency || 'SYP',
                    stock: item.quantity,
                    image: fixImageUrl(rawImage, 'square'),
                }]
            });
        });
    }

    let mappedServices = [];
    if (rawData.freelancers && Array.isArray(rawData.freelancers)) {
        mappedServices = rawData.freelancers.map(f => {
            const actualFreelancer = f.freelancer;
            const user = actualFreelancer?.user;
            const contractInfo = companyFreelancers.find(cf => cf.freelancer_id === actualFreelancer?.id);

            return {
                id: f.id || Math.random().toString(),
                contract_id: f.contract_id,
                name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || actualFreelancer?.brand_name || contractInfo?.freelancer?.brand_name || 'Unknown Freelancer',
                phone: user?.email || contractInfo?.freelancer?.user?.email || 'No contact provided',
                role: contractInfo?.job_offer?.job_title || actualFreelancer?.provider_type || 'Freelancer',
                status: 'available',
                availableDates: 'Flexible Schedule'
            };
        });
    }

    const mappedArrangement = {
        id: rawData.id,
        badge: resolveText(rawData.category) || 'Package',
        name: resolveText(rawData.title) || 'Untitled Arrangement',
        description: resolveText(rawData.description) || '',

        images: rawData.images?.length > 0
            ? rawData.images.map(img => fixImageUrl(img, 'hero'))
            : [fixImageUrl(null, 'hero')],

        generalInfo: {
            description: resolveText(rawData.description) || '',
            management: providerData.brand_name || 'Company Management',
            managementLogo: providerData.avatar || null,
            primaryContact: providerData.user?.email || 'No email provided',
            primaryPhone: providerData.user?.phone || rawData.secondary_contact_number || '',
            secondaryPhone: rawData.secondary_contact_number || '',
            district: resolveText(rawData.district) || 'Unspecified District',
            category: resolveText(rawData.category) || 'Unspecified Category',
        },

        products: productsList,

        policies: {
            priceAmount: rawData.price ? parseFloat(rawData.price).toLocaleString() : '0',
            currency: rawData.currency || 'SYP',
            capacity: rawData.capacity || 'Not specified',
            priceType: rawData.price_type?.toUpperCase() || 'FIXED',

            cancel_before_acceptance: !!rawData.cancel_policies?.before_acceptance,
            cancel_after_acceptance: !!rawData.cancel_policies?.after_acceptance,
            cancel_before_payment: !!rawData.cancel_policies?.before_payment,

            cancelPolicies: {
                beforeAcceptance: !!rawData.cancel_policies?.before_acceptance,
                afterAcceptance: !!rawData.cancel_policies?.after_acceptance,
                beforePayment: !!rawData.cancel_policies?.before_payment,
            },
            cancellationNote: 'Policies applied automatically based on provider settings.',
        },

        services: mappedServices
    };

    const handleEdit = () => {
        if (onEdit) onEdit(rawData);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', position: 'relative', pb: 6 }}>

            {/* ── 1. الصورة الخلفية الأساسية للموقع مع "غباش" عالي ── */}
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

            {/* ── 2. طبقة تغميق/تفتيح لضمان وضوح النصوص والكروت الزجاجية ── */}
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
                <Herosection data={{
                    badge: mappedArrangement.badge,
                    name: mappedArrangement.name,
                    description: mappedArrangement.description,
                    images: mappedArrangement.images,
                    onEdit: handleEdit
                }}/>
            </Box>

            {/* ── 5. باقي المحتوى ── */}
            <Box sx={{ mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <Generalinfo data={mappedArrangement.generalInfo}/>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <Policiespricing data={mappedArrangement.policies}/>
                    </Box>
                </Box>

                <ArrangementProducts products={mappedArrangement.products}/>

                <ServicesProviders services={mappedArrangement.services}/>

                <Availabilitycalendar
                    entityId={mappedArrangement.id}
                    entityType="arrangement"
                    availabilities={arrangementAvailabilities}
                    onBookSlot={(slot) => console.log('Book slot clicked', slot)}
                />

                <Box id="booking-pipeline-section" sx={{ mt: 4 }}>
                    <Bookingpipeline
                        entityId={arrangementId}
                        bookingsData={bookings}
                        highlightedBookingId={highlightedBookingId}
                    />
                </Box>
            </Box>
        </Box>
    );
}