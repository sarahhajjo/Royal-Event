import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Stack, Avatar, Typography, Button, IconButton, Collapse, Chip, CircularProgress, Divider, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';
import { getStatusConfig } from './statusConfig';
import { buildRequestTimeline } from './buildRequestTimeline';

// ─── دوال مساعدة ─────────────────────────────────────────────────────────────

const resolveThemeColor = (theme, path) =>
    path.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), theme.palette) || path;


const getButtonTextColor = (theme, path) => {
    const [base, shade] = path.split('.');
    if (['main', 'light', 'dark'].includes(shade) && theme.palette[base]?.contrastText) {
        return theme.palette[base].contrastText;
    }
    return theme.palette.getContrastText(resolveThemeColor(theme, path));
};

const resolveText = (field, fallback = 'Untitled') => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field.en || field.ar || fallback;
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

const fixImageUrl = (img) => {
    const fallback = "https://placehold.co/400x400/1c1512/c5a059?text=No+Image";
    if (!img) return fallback;
    let url = '';
    if (typeof img === 'string') url = img;
    else if (typeof img === 'object') url = img.url || img.full_url || img.original_url || img.path || img.temp_path || '';
    if (!url || typeof url !== 'string') return fallback;
    if (url.startsWith('http')) return url;
    const BACKEND_URL = 'http://127.0.0.1:8000';
    let cleanPath = url.startsWith('/') ? url : `/${url}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) cleanPath = `/storage${cleanPath}`;
    return `${BACKEND_URL}${cleanPath}`;
};

// ─── المكونات الداخلية للكروت المضمنة ──────────────────────────────────────────

const IncludedProductCard = ({ item }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const variant = item.included_variant || {};
    const listing = variant.listing || {};

    const image = fixImageUrl(variant.image);
    const title = resolveText(listing.title) || resolveText(variant.variant_name);
    const price = parseInt(variant.price || 0).toLocaleString();
    const currency = variant.currency || 'SYP';
    const qty = item.quantity || 1;
    const colorName = resolveText(variant.variant_name, 'Standard');
    const cssColor = getHexFromColorName(colorName);

    return (
        <Box sx={{
            display: 'flex', minWidth: 320, maxWidth: 350, flexShrink: 0, p: 1.5,
            backgroundColor: isDark ? '#1c1512' : '#fcf8f0', border: `1px solid ${border}`,
            borderRadius: 3, gap: 2, transition: 'border-color 0.2s',
            '&:hover': { borderColor: theme.palette.primary.main }
        }}>
            <Box sx={{ width: 80, height: 80, borderRadius: 2, backgroundColor: '#ffffff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${border}` }}>
                <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', py: 0.5 }}>
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: theme.palette.text.primary, mb: 0.5, textTransform: 'capitalize' }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#c5a059' }}>
                        {price} {currency}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Tooltip title={`${colorName}`} placement="top">
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: cssColor, border: `2px solid ${isDark ? '#1c1512' : '#fcf8f0'}`, outline: '1px solid #c5a059', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </Tooltip>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: theme.palette.text.primary }}>QTY:</Typography>
                        <Box sx={{ px: 1.5, py: 0.2, border: `1px solid ${theme.palette.primary.main}`, borderRadius: 1, fontSize: '0.8rem', fontWeight: 700, color: theme.palette.text.primary, backgroundColor: isDark ? '#140e0c' : '#ffffff' }}>
                            {qty}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const IncludedStaffCard = ({ freelancerData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const name = freelancerData.freelancer?.brand_name || 'Freelancer';
    const role = resolveText(freelancerData.service?.name, 'Service Provider');
    const email = freelancerData.freelancer?.user?.email || 'No email provided';
    const phone = freelancerData.freelancer?.user?.phone || null;

    let ContactIcon = phone ? PhoneIcon : MailOutlinedIcon;
    let contactText = phone || email;

    return (
        <Box sx={{
            width: 260, flexShrink: 0, bgcolor: theme.palette.background.paper,
            border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`, borderRadius: 2, p: 1.5,
            display: 'flex', flexDirection: 'column', gap: 1.5, boxShadow: theme.shadows[1]
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: isDark ? 'rgba(197, 160, 89, 0.18)' : 'rgba(179, 140, 69, 0.15)', color: 'primary.main', border: `1px solid ${theme.palette.divider}`, fontWeight: 'bold' }}>
                    {name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography noWrap sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>{name}</Typography>
                    <Typography noWrap sx={{ color: theme.palette.primary.main, fontSize: '0.75rem' }}>{role}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: theme.palette.text.secondary, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactIcon sx={{ fontSize: '1.1rem', opacity: 0.8 }} />
                    <Typography noWrap sx={{ fontSize: '0.8rem' }}>{contactText}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CalendarTodayOutlinedIcon sx={{ fontSize: '1.1rem', mt: 0.2, opacity: 0.8 }} />
                    <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.02em', lineHeight: 1.4 }}>Flexible Schedule</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: '#2e7d32' }} />
                <Typography sx={{ color: '#2e7d32', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    AVAILABLE
                </Typography>
            </Box>
        </Box>
    );
};

// ─── الكرت الأساسي ─────────────────────────────────────────────────────────────

const StatItem = ({ icon: Icon, label, color }) => (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <Icon sx={{ fontSize: 16, color: color || 'text.secondary' }} />
        <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {label}
        </Typography>
    </Stack>
);

StatItem.propTypes = { icon: PropTypes.elementType.isRequired, label: PropTypes.node, color: PropTypes.string };

const RequestCard = ({ request, onView, onAccept, onReject }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // حالات الـ Collapse
    const [expanded, setExpanded] = useState(false);
    const [productsExpanded, setProductsExpanded] = useState(false); // 💡 حالة منتجات البكج
    const [servicesExpanded, setServicesExpanded] = useState(false); // 💡 حالة خدمات البكج

    const [listingData, setListingData] = useState(null);
    const [loadingListing, setLoadingListing] = useState(false);

    const { orderId, timeAgo, customerName, phone, avatarUrl, date, booked_date, shift, eventType, offerLabel, offerValue, reason, status, listing } = request;

    useEffect(() => {
        const listingId = listing?.id;
        if (listingId) {
            setLoadingListing(true);
            axios.get(`http://127.0.0.1:8000/api/listings/${listingId}`)
                .then(res => {
                    if (res.data && res.data.data) {
                        setListingData(res.data.data);
                    }
                })
                .catch(err => console.error("Failed to fetch listing details", err))
                .finally(() => setLoadingListing(false));
        }
    }, [listing?.id]);

    const config = getStatusConfig(status);
    const { BadgeIcon } = config;
    const timeline = buildRequestTimeline(request);

    const displayDate = booked_date ? dayjs(booked_date).format('MMM DD, YYYY') : date || 'No Date';
    const displayShift = shift ? `${dayjs(`2000-01-01T${shift.start_time}`).format('hh:mm A')} - ${dayjs(`2000-01-01T${shift.end_time}`).format('hh:mm A')}` : null;
    const finalTitle = listingData ? (listingData.title?.en || listingData.title?.ar) : (eventType || listing?.title?.en || 'Event Request');

    const scrollbarStyle = {
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? '#4e4639' : '#d1c4a5', borderRadius: '10px' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#c5a059' }
    };


    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: isDark ? alpha('#ffffff', 0.04) : alpha('#000000', 0.03),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                pl: 3, pr: { xs: 2, sm: 3 }, py: 2.5, mb: 3, overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: config.accentColor },
            }}
        >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <IconButton size="small" disableRipple sx={{ bgcolor: alpha(resolveThemeColor(theme, config.accentColor), 0.15), color: config.accentColor, width: 32, height: 32, '&:hover': { bgcolor: alpha(resolveThemeColor(theme, config.accentColor), 0.25) } }}>
                        <BadgeIcon fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="caption" sx={{ color: config.accentColor, fontWeight: 700, letterSpacing: 1, display: 'block', fontSize: 11 }}>
                            {config.badgeLabel}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Order: #{orderId || request.id?.substring(0, 8)}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">{timeAgo}</Typography>
                    <IconButton size="small" onClick={() => setExpanded((prev) => !prev)} sx={{ color: 'text.secondary', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>{finalTitle}</Typography>
                        {loadingListing && <CircularProgress size={14} sx={{ color: 'text.secondary' }} />}
                    </Stack>

                    {config.detailsType === 'reason' && reason && (
                        <Typography variant="body2" sx={{ color: 'error.main', mb: 1, fontWeight: 600 }}>Reason: {reason}</Typography>
                    )}

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {listingData ? (listingData.description?.en || listingData.description?.ar) : 'Loading details...'}
                    </Typography>

                    {listingData && (
                        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
                            {listingData.category && (
                                <Chip size="small" label={resolveText(listingData.category.name)} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontSize: '10px', fontWeight: 600, border: '1px solid', borderColor: 'primary.main' }} />
                            )}
                            {listingData.district && (
                                <Chip size="small" label={resolveText(listingData.district.name)} sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1), color: 'text.secondary', fontSize: '10px', fontWeight: 600 }} />
                            )}
                            <Chip size="small" label={listingData.listing_type} sx={{ bgcolor: alpha(theme.palette.text.secondary, 0.1), color: 'text.secondary', fontSize: '10px', textTransform: 'capitalize', fontWeight: 600 }} />

                            {listingData.variants?.[0]?.price_type && (
                                <Chip size="small" label={`Price Type: ${listingData.variants[0].price_type}`} sx={{ bgcolor: 'transparent', color: 'primary.main', fontSize: '10px', textTransform: 'capitalize', fontWeight: 700, border: '1px dashed', borderColor: 'primary.main' }} />
                            )}
                        </Stack>
                    )}

                    {listingData && (
                        <Box sx={{ mb: 3, mt: 1 }}>

                            {/* الخيارات للمنتجات المادية */}
                            {listingData.listing_type === 'physical_product' && listingData.variants?.length > 0 && (
                                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', mb: 1 }}>
                                        AVAILABLE OPTIONS & PRICES
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {listingData.variants.map((v) => (
                                            <Chip key={v.id} size="small" label={`${v.dynamic_attributes?.color || resolveText(v.variant_name)} - ${parseInt(v.price).toLocaleString()} ${v.currency}`} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', color: 'text.primary', fontWeight: 500 }} />
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* عرض الباقات مع ميزة الطي (Collapse) والأسهم */}
                            {listingData.listing_type === 'package' && listingData.variants?.[0] && (
                                <Stack spacing={2}>

                                    {/* 💡 قسم المنتجات المضمنة */}
                                    {listingData.variants[0].package_items?.length > 0 && (
                                        <Box>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                onClick={() => setProductsExpanded(!productsExpanded)}
                                                sx={{ cursor: 'pointer', mb: productsExpanded ? 1.5 : 0 }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Inventory2OutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', letterSpacing: 1 }}>INCLUDED PRODUCTS</Typography>
                                                </Stack>
                                                <IconButton size="small" sx={{ p: 0, transform: productsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                                    <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                </IconButton>
                                            </Stack>

                                            <Collapse in={productsExpanded} timeout="auto" unmountOnExit>
                                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, pt: 0.5, ...scrollbarStyle }}>
                                                    {listingData.variants[0].package_items.map((item) => (
                                                        <IncludedProductCard key={item.id} item={item} />
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        </Box>
                                    )}

                                    {/* 💡 قسم الفريلانسرز/الخدمات المضمنة */}
                                    {listingData.variants[0].package_freelancers?.length > 0 && (
                                        <Box>
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                onClick={() => setServicesExpanded(!servicesExpanded)}
                                                sx={{ cursor: 'pointer', mb: servicesExpanded ? 1.5 : 0 }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 1 }}>INCLUDED SERVICES / STAFF</Typography>
                                                </Stack>
                                                <IconButton size="small" sx={{ p: 0, transform: servicesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                                    <ExpandMoreIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                </IconButton>
                                            </Stack>

                                            <Collapse in={servicesExpanded} timeout="auto" unmountOnExit>
                                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, pt: 0.5, ...scrollbarStyle }}>
                                                    {listingData.variants[0].package_freelancers.map((f) => (
                                                        <IncludedStaffCard key={f.id} freelancerData={f} />
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        </Box>
                                    )}

                                </Stack>
                            )}
                        </Box>
                    )}

                    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
                        <StatItem icon={CalendarTodayOutlinedIcon} label={displayDate} />
                        {displayShift && <StatItem icon={AccessTimeOutlinedIcon} label={displayShift} />}
                        <StatItem icon={ConfirmationNumberOutlinedIcon} label={`#${orderId || request.id?.substring(0, 5)}`} />
                        {offerLabel && offerValue && <StatItem icon={SellOutlinedIcon} label={`${offerLabel}: ${offerValue}`} color={config.accentColor} />}
                    </Stack>
                </Box>

                <Stack spacing={1.5} sx={{ minWidth: { sm: 190 }, alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>{customerName || request.customer?.name || 'Unknown'}</Typography>
                            <Typography variant="caption" color="textSecondary">{phone || request.customer?.phone || 'No phone'}</Typography>
                        </Box>
                        <Avatar src={avatarUrl} alt={customerName} sx={{ width: 44, height: 44 }} />
                    </Stack>

                    <Stack spacing={1} sx={{ width: '100%', maxWidth: 190 }}>
                        {status === 'pending' && (
                            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <Button variant="outlined" fullWidth onClick={() => onReject?.(request)} sx={{ borderRadius: 2, color: 'error.main', borderColor: 'error.main', '&:hover': { borderColor: 'error.dark', bgcolor: alpha('#f44336', 0.1) } }}>REJECT</Button>
                                <Button variant="contained" fullWidth onClick={() => onAccept?.(request)} sx={{ borderRadius: 2, bgcolor: 'success.main', color: '#fff', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: 'success.dark', boxShadow: 'none' } }}>ACCEPT</Button>
                            </Stack>
                        )}
                        <Button variant="outlined" fullWidth {...(phone ? { component: 'a', href: `tel:${phone}` } : {})} sx={{ borderRadius: 2, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' } }}>Contact</Button>
                        <Button variant="contained" fullWidth onClick={() => onView?.(request)} sx={{ borderRadius: 2, bgcolor: config.buttonColor, color: getButtonTextColor(theme, config.buttonColor), boxShadow: 'none', '&:hover': { bgcolor: config.buttonColor, opacity: 0.9, boxShadow: 'none' } }}>{config.buttonLabel}</Button>
                    </Stack>
                </Stack>
            </Stack>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ pt: 3, mt: 2.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1, display: 'block', mb: 2, fontSize: 11 }}>REQUEST TIMELINE</Typography>
                    <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
                        {timeline.map((step, idx) => (
                            <React.Fragment key={`${step.label}-${idx}`}>
                                <Stack sx={{ alignItems: 'center', minWidth: 84 }}>
                                    <Box sx={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: step.completed ? (step.isTerminalNegative ? 'error.main' : 'primary.main') : 'transparent', border: '2px solid', borderColor: step.completed ? (step.isTerminalNegative ? 'error.main' : 'primary.main') : 'divider' }}>
                                        {step.completed && (step.isTerminalNegative ? <CloseIcon sx={{ fontSize: 14, color: '#fff' }} /> : <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />)}
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>{step.label}</Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center' }}>{step.date}</Typography>
                                </Stack>
                                {idx < timeline.length - 1 && <Box sx={{ flex: 1, mt: '10px', borderTop: '2px dotted', borderColor: step.completed ? 'primary.main' : 'divider' }} />}
                            </React.Fragment>
                        ))}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
};

RequestCard.propTypes = { request: PropTypes.object.isRequired, onView: PropTypes.func, onAccept: PropTypes.func, onReject: PropTypes.func };

export default RequestCard;