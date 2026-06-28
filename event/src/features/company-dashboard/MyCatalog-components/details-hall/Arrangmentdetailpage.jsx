import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';

// ── Components ──────────────────────────────────────────
import Herosection          from './detailshall-components/Herosection';
import Generalinfo          from './detailshall-components/Generalinfo';
import Policiespricing      from './detailshall-components/Policiespricing';
import Availabilitycalendar from './detailshall-components/Availabilitycalendar';
import Bookingpipeline      from './detailshall-components/Bookingpipeline';
import ServicesProviders    from './details-arrangment/ServicesProviders';
import ArrangementProducts  from './details-arrangment/ArrangementProducts';

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

export default function ArrangmentDetailPage({ arrangementId, onBack }) {
    const theme  = useTheme();

    const { arrangements } = useSelector((state) => state.myCatalog || {});
    // 💡 جلب بيانات بروفايل الشركة الحالي من الستيت الموحد
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    const rawData = arrangements?.find(a => a.id === arrangementId);

    if (!rawData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const productsMap = {};
    if (rawData.items && Array.isArray(rawData.items)) {
        rawData.items.forEach(item => {
            const variant = item.variant;
            const listing = variant?.listing;
            if (!listing) return;

            const listId = listing.id;
            if (!productsMap[listId]) {
                productsMap[listId] = {
                    name: listing.title?.en || listing.title || 'Product',
                    description: listing.description?.en || listing.description || '',
                    variants: []
                };
            }

            productsMap[listId].variants.push({
                colorName: variant.variant_name?.en || variant.variant_name?.ar || variant.variant_name || 'Default Option',
                color: { hex: '#c0c0c0' },
                price: variant.price || 0,
                currency: variant.currency || 'USD',
                stock: item.quantity,
                image: variant.image,
                priceNote: `Included QTY: ${item.quantity}`,
            });
        });
    }

    const mappedArrangement = {
        id: rawData.id,
        badge: rawData.category?.name?.en || rawData.category?.name?.ar || rawData.category?.name || 'Package',
        name: rawData.title?.en || rawData.title || 'Untitled Arrangement',
        description: rawData.description?.en || rawData.description || '',

        images: rawData.images?.length > 0
            ? rawData.images.map(img => fixImageUrl(img.url || img.path))
            : [fixImageUrl(null)],

        // 💡 ربط بيانات بروفايل الشركة والممثل القادمة من الباك إند ومعالجة مرونة الحقول
        generalInfo: {
            description: rawData.description?.en || rawData.description || '',
            management: providerData.brand_name || 'Company Management',
            managementLogo: providerData.avatar || null,
            primaryContact: providerData.user?.email || 'No email provided',
            primaryPhone: providerData.user?.phone || rawData.secondary_contact_number || '',
            secondaryPhone: '',
            district: rawData.district?.name_en || rawData.district?.name_ar || rawData.district?.name || 'Unspecified District',
            category: rawData.category?.name_en || rawData.category?.name_ar || rawData.category?.name || 'Unspecified Category',
        },

        products: Object.values(productsMap),

        policies: {
            priceAmount: rawData.price ? rawData.price.toLocaleString() : '0',
            capacity: rawData.capacity || 'Not specified',
            priceType: rawData.price_type?.toUpperCase() || 'FIXED',
            cancelPolicies: {
                beforeAcceptance: !!rawData.cancel_policies?.before_acceptance,
                afterAcceptance: !!rawData.cancel_policies?.after_acceptance,
                beforePayment: !!rawData.cancel_policies?.before_payment,
            },
            cancellationNote: 'Full refund if cancelled 48h before the event date after acceptance.',
        },

        services: rawData.freelancers?.length > 0 ? rawData.freelancers : []
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100%', backgroundColor: theme.palette.background.default, pb: 6 }}>
            <Box sx={{ position: 'relative', width: '100%' }}>
                <Herosection data={{ badge: mappedArrangement.badge, name: mappedArrangement.name, description: mappedArrangement.description, images: mappedArrangement.images }} />
                <Button onClick={onBack} startIcon={<ArrowBackIcon sx={{ fontSize: '1rem !important' }} />} sx={{ position: 'absolute', top: 20, left: 24, zIndex: 10, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', color: theme.palette.mode === 'dark' ? '#fff' : '#2B211E', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'none', px: 2, py: 0.8, borderRadius: 2, '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' } }}>
                    Back to Catalog
                </Button>
            </Box>

            <Box sx={{ mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <Generalinfo data={mappedArrangement.generalInfo} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <Policiespricing data={mappedArrangement.policies} />
                    </Box>
                </Box>

                <ArrangementProducts products={mappedArrangement.products} />
                <ServicesProviders services={mappedArrangement.services} />
                <Availabilitycalendar entityId={mappedArrangement.id} entityType="arrangement" availabilities={rawData.availabilities} />
                <Bookingpipeline entityId={mappedArrangement.id} entityType="arrangement" />
            </Box>
        </Box>
    );
}