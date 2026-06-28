import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';

// ── Components ──────────────────────────────────────────
import HeroSection          from './detailshall-components/Herosection';
import GeneralInfo          from './detailshall-components/Generalinfo';
import PoliciesPricing      from './detailshall-components/Policiespricing';
import AvailabilityCalendar from './detailshall-components/Availabilitycalendar';
import BookingPipeline      from './detailshall-components/Bookingpipeline';

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

export default function Halldetailpage({ hallId, onBack }) {
    const theme = useTheme();

    const { services: halls } = useSelector((state) => state.myCatalog || {});
    // 💡 استدعاء البروفايل للصالات
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    const rawData = halls?.find(h => h.id === hallId);

    if (!rawData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
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

        // 💡 ربط الحقول ببيانات المستخدم والشركة الحقيقية وتصحيح مسار الحقول الهيكلية
        generalInfo: {
            description: rawData.description?.en || rawData.description || '',
            management: providerData.brand_name || 'Company Management',
            managementLogo: providerData.avatar || null,
            primaryContact: providerData.user?.email || 'No contact provided',
            primaryPhone: providerData.user?.phone || rawData.secondary_contact_number || '',
            secondaryPhone: '',
            district: rawData.district?.name?.en || rawData.district?.name?.ar || rawData.district?.name || 'Unknown',
            category: rawData.category?.name?.en || rawData.category?.name?.ar || rawData.category?.name || 'Category',
        },

        policies: {
            priceAmount: firstVariant.price ? firstVariant.price.toLocaleString() : '0',
            currency: firstVariant.currency || 'USD',
            capacity: firstVariant.stock || 'Not specified',
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

    const handleEdit    = () => console.log('Edit details clicked');
    const handlePublish = () => console.log('Publish venue clicked');
    const handleBookSlot = ({ day, year, month, slot }) => console.log('Book slot:', { day, year, month, slot });

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', pb: 6, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
                <Button onClick={onBack} sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#2B211E', bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', textTransform: 'none', px: 2, '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' } }}>
                    <ArrowBackIcon sx={{ fontSize: '1rem !important', mr: 1 }} />
                    Back to Catalog
                </Button>
            </Box>

            <HeroSection data={{ ...mappedHall, onEdit: handleEdit, onPublish: handlePublish }} />

            <Box sx={{ mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <GeneralInfo data={mappedHall.generalInfo} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', mb:'1.6%' }}>
                        <PoliciesPricing data={mappedHall.policies} />
                    </Box>
                </Box>

                <AvailabilityCalendar availabilities={mappedHall.availabilities} onBookSlot={handleBookSlot} />
                <BookingPipeline />
            </Box>
        </Box>
    );
}