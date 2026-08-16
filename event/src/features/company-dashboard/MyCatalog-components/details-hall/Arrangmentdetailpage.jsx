import React, { useEffect } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

const fixImageUrl = (img, type = 'hero') => {
    const fallback = type === 'square'
        ? "https://placehold.co/400x400/1c1512/c5a059?text=No+Image"
        : "https://placehold.co/1200x600/1c1512/c5a059?text=No+Image";

    if (!img) return fallback;

    let url = '';
    if (typeof img === 'string') {
        url = img;
    } else if (typeof img === 'object') {
        url = img.url || img.full_url || img.original_url || img.path || img.temp_path || '';
    }

    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;

    const BACKEND_URL = 'http://127.0.0.1:8000';
    let cleanPath = url.startsWith('/') ? url : `/${url}`;

    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }

    return `${BACKEND_URL}${cleanPath}`;
};

const resolveText = (entity) => {
    if (!entity) return null;
    if (typeof entity === 'string') return entity;
    if (entity.name_en) return entity.name_en;
    if (entity.name?.en) return entity.name.en;
    if (typeof entity.name === 'string') return entity.name;
    if (entity.en) return entity.en;
    return null;
};

// 💡 استقبال highlightedBookingId في الـ Props
export default function ArrangmentDetailPage({ arrangementId, onBack, onEdit, highlightedBookingId }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { arrangements, bookings = [], companyFreelancers = [] } = useSelector((state) => state.myCatalog || {});
    const { profile } = useSelector((state) => state.providerProfile || {});
    const providerData = profile?.data || {};

    useEffect(() => {
        dispatch(fetchProviderBookings());
        dispatch(fetchCompanyFreelancers());
    }, [dispatch]);

    // 💡 حركة السكرول التلقائي لقسم الحجوزات عند فتح الصفحة بطلب محدد
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
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress color="primary"/>
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
        <Box sx={{width: '100%', minHeight: '100%', backgroundColor: theme.palette.background.default, pb: 6}}>
            <Box sx={{position: 'relative', width: '100%'}}>
                <Herosection data={{
                    badge: mappedArrangement.badge,
                    name: mappedArrangement.name,
                    description: mappedArrangement.description,
                    images: mappedArrangement.images,
                    onEdit: handleEdit
                }}/>
                <Button onClick={onBack} startIcon={<ArrowBackIcon sx={{fontSize: '1rem !important'}}/>} sx={{
                    position: 'absolute', top: 20, left: 24, zIndex: 10,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(8px)', color: theme.palette.mode === 'dark' ? '#fff' : '#2B211E',
                    border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem', fontWeight: 600,
                    textTransform: 'none', px: 2, py: 0.8, borderRadius: 2,
                    '&:hover': {backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'}
                }}>
                    Back to Catalog
                </Button>
            </Box>

            <Box sx={{mt: 3, width: "100%", maxWidth: "1050px", mx: "auto", px: {xs: 2, md: 4}}}>
                <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3, mb: 3, alignItems: 'stretch' }}>
                    <Box sx={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column'}}>
                        <Generalinfo data={mappedArrangement.generalInfo}/>
                    </Box>
                    <Box sx={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column'}}>
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

                {/* 💡 غلاف مع ID لتوجيه السكرول بدقة */}
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