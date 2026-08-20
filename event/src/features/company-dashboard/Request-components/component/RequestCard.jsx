import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Avatar, Typography, Button, IconButton, Collapse, Chip, CircularProgress, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
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
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';
import { getStatusConfig } from './statusConfig';
import { buildRequestTimeline } from './buildRequestTimeline';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentReceipt, selectReceiptById } from './../RequestSlice';

// 💡 استيراد دالة معالجة الصور من ملف الـ helper لتعمل ديناميكياً مع ngrok/local
import { fixImageUrl } from '../../../../utils/imageUrlHelper';

// الألوان الزجاجية
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../utils/colorConstants';

// ─── Utility Functions ───────────────────────────────────────────────────────

const resolveColor = (theme, colorValue) => {
    if (!colorValue) return GOLD;
    if (colorValue.includes('.')) {
        const [paletteKey, shade] = colorValue.split('.');
        return theme.palette[paletteKey]?.[shade] || colorValue;
    }
    return colorValue;
};

const resolveText = (field, fallback = 'Untitled') => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    return field.en || field.ar || fallback;
};

const getHexFromColorName = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('red') || lowerName.includes('أحمر')) return '#b05050';
    if (lowerName.includes('pink') || lowerName.includes('زهري')) return '#e297a6';
    if (lowerName.includes('blue') || lowerName.includes('أزرق')) return '#4267B2';
    if (lowerName.includes('black') || lowerName.includes('أسود')) return '#222222';
    if (lowerName.includes('white') || lowerName.includes('أبيض')) return '#f5f5f5';
    if (lowerName.includes('green') || lowerName.includes('أخضر')) return '#4CAF50';
    if (lowerName.includes('silver') || lowerName.includes('فضي')) return '#C0C0C0';
    if (lowerName.includes('gold') || lowerName.includes('ذهبي')) return '#D4AF37';
    return GOLD;
};

// ─── Included Product Card ───────────────────────────────────────────────────

const IncludedProductCard = ({ item }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 💡 استخدام الدالة الديناميكية المستوردة
    const image = fixImageUrl(item.image);
    const title = resolveText(item.item_name) || 'Included Product';
    const qty = item.quantity || 1;
    const colorName = item.metadata?.color || 'Standard';
    const cssColor = getHexFromColorName(colorName);

    return (
        <Box sx={{ display: 'flex', minWidth: 320, maxWidth: 350, flexShrink: 0, p: 1.5, background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 3, gap: 2, transition: 'border-color 0.2s', '&:hover': { borderColor: GOLD } }}>
            <Box sx={{ width: 80, height: 80, borderRadius: 2, backgroundColor: isDark ? '#140e0c' : '#ffffff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', py: 0.5 }}>
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 0.5, textTransform: 'capitalize' }}>{title}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: GOLD }}>Included in Package</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    {item.metadata?.color ? (
                        <Tooltip title={`${colorName}`} placement="top"><Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: cssColor, border: `2px solid ${isDark ? '#1c1512' : '#fcf8f0'}`, outline: `1px solid ${GOLD}`, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} /></Tooltip>
                    ) : <Box />}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: isDark ? '#ffffff' : BROWN_TEXT }}>QTY:</Typography>
                        <Box sx={{ px: 1.5, py: 0.2, border: `1px solid ${GOLD}`, borderRadius: 1, fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, backgroundColor: isDark ? '#140e0c' : '#ffffff' }}>{qty}</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

// ─── Included Staff Card ─────────────────────────────────────────────────────

const IncludedStaffCard = ({ freelancerData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const name = freelancerData.name || 'Service Provider';
    const role = 'Included Staff';

    return (
        <Box sx={{ width: 260, flexShrink: 0, background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 2, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(GOLD, 0.15), color: GOLD, border: `1px solid ${alpha(GOLD, 0.3)}`, fontWeight: 'bold' }}>{name?.charAt(0)?.toUpperCase()}</Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography noWrap sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>{name}</Typography>
                    <Typography noWrap sx={{ color: GOLD, fontSize: '0.75rem' }}>{role}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: '#4caf50' }} />
                <Typography sx={{ color: '#4caf50', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>AVAILABLE</Typography>
            </Box>
        </Box>
    );
};

// ─── Main Request Card ───────────────────────────────────────────────────────

const StatItem = ({ icon: Icon, label, color, isDark }) => (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
        <Icon sx={{ fontSize: 16, color: color || (isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT) }} />
        <Typography variant="caption" sx={{ color: color || (isDark ? '#ffffff' : BROWN_TEXT), fontWeight: 600 }}>{label}</Typography>
    </Stack>
);

const RequestCard = ({ request, onView, onAccept, onReject }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState(false);
    const [productsExpanded, setProductsExpanded] = useState(false);
    const [servicesExpanded, setServicesExpanded] = useState(false);

    const paymentId = request.payment_id;
    const receiptData = useSelector(state => selectReceiptById(state, paymentId));
    const receiptImage = receiptData?.url || null;
    const isPdf = receiptData?.isPdf || false;

    const [openReceiptModal, setOpenReceiptModal] = useState(false);
    const [receiptError, setReceiptError] = useState(false);

    const activeListing = request.listing || {};
    const activeVariant = request.variant || activeListing.variant || {};
    const dynamicAttrs = activeVariant.dynamic_attributes || {};

    useEffect(() => {
        if (['confirmed', 'completed'].includes(request.status) && paymentId && !receiptData && !receiptError) {
            dispatch(fetchPaymentReceipt(paymentId)).unwrap().catch(() => setReceiptError(true));
        }
    }, [request.status, paymentId, receiptData, receiptError, dispatch]);

    const config = getStatusConfig(request.status);
    const safeAccentColor = resolveColor(theme, config.accentColor);
    const StatusIcon = config.BadgeIcon;
    const timeline = buildRequestTimeline(request);

    const shift = request.shift || request.day_schedule?.shifts?.[0] || null;
    const displayDate = request.booked_date ? dayjs(request.booked_date).format('MMM DD, YYYY') : 'No Date';
    const displayShift = shift ? `${dayjs(`2000-01-01T${shift.start_time}`).format('hh:mm A')} - ${dayjs(`2000-01-01T${shift.end_time}`).format('hh:mm A')}` : null;

    const customerName = request.customerName || request.customer?.name || 'Unknown Client';
    const rawPhone = request.phone || request.customer?.phone;
    const rawEmail = request.email || request.customer?.email;
    const hasPhone = rawPhone && rawPhone !== 'No phone' && String(rawPhone).trim() !== '';
    const hasEmail = rawEmail && String(rawEmail).trim() !== '';
    const displayContact = hasPhone ? rawPhone : (hasEmail ? rawEmail : 'No contact info');
    const contactHref = hasPhone ? `tel:${rawPhone}` : (hasEmail ? `mailto:${rawEmail}` : null);

    const scrollbarStyle = {
        '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? 'rgba(197,160,89,0.5)' : 'rgba(197,160,89,0.4)', borderRadius: '10px' }
    };

    return (
        <Box
            sx={{
                width: 990, position: 'relative',
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                backdropFilter: 'blur(16px)',
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 3,
                pl: 3, pr: { xs: 2, sm: 3 }, py: 2.5, mb: 3, overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: safeAccentColor },
            }}
        >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <IconButton size="small" disableRipple sx={{ bgcolor: alpha(safeAccentColor, 0.15), color: safeAccentColor, width: 32, height: 32 }}>
                        <StatusIcon fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="caption" sx={{ color: safeAccentColor, fontWeight: 700, letterSpacing: 1, display: 'block', fontSize: 11, textTransform: 'uppercase' }}>
                            {config.badgeLabel || request.status}
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>
                            Order: #{request.id?.substring(0, 8).toUpperCase()}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>{request.timeAgo || request.created_at_human}</Typography>
                    <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%' }}>
                {/* --- 1. Left Section --- */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT }}>
                            {resolveText(activeListing.title) || 'Service Request'}
                        </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {resolveText(activeListing.description) || 'No description available for this request.'}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', rowGap: 1 }}>
                        <Chip size="small" label={activeListing.listing_type} sx={{ bgcolor: alpha(GOLD, 0.1), color: GOLD, fontSize: '10px', textTransform: 'capitalize', fontWeight: 600 }} />
                        {activeVariant.price_type && (
                            <Chip size="small" label={`Price Type: ${activeVariant.price_type}`} sx={{ bgcolor: 'transparent', color: GOLD, fontSize: '10px', textTransform: 'capitalize', fontWeight: 700, border: `1px dashed ${GOLD}` }} />
                        )}
                    </Stack>

                    {/* Booking Types */}
                    {['hall', 'service'].includes(activeListing.listing_type) && (
                        <Box sx={{ mb: 3, p: 1.5, bgcolor: alpha(GOLD, 0.05), border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PeopleAltOutlinedIcon sx={{ color: GOLD }} />
                            <Typography variant="caption" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 600, fontSize: '0.9rem' }}>
                                Booked Capacity: <span style={{color: GOLD}}>{dynamicAttrs.capacity || 'N/A'} Persons</span>
                            </Typography>
                        </Box>
                    )}

                    {activeListing.listing_type === 'physical_product' && (
                        <Box sx={{ mb: 3, p: 1.5, background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, borderRadius: 2, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: isDark ? '#140e0c' : '#ffffff', border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, overflow: 'hidden', flexShrink: 0 }}>
                                {/* 💡 استخدام الدالة الديناميكية المستوردة */}
                                <img src={fixImageUrl(activeListing.images?.[0])} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isDark ? '#ffffff' : BROWN_TEXT }}>{resolveText(activeVariant.name || activeVariant.variant_name)}</Typography>
                                <Typography variant="caption" sx={{ color: GOLD, display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                                    {parseInt(request.price || 0).toLocaleString()} {request.currency}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tooltip title={dynamicAttrs.color || 'Standard'}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: getHexFromColorName(dynamicAttrs.color), border: `1px solid ${GOLD}` }} /></Tooltip>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>Color</Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: isDark ? '#ffffff' : BROWN_TEXT }}>Requested QTY: <span style={{color: GOLD}}>{request.quantity}</span></Typography>
                                </Stack>
                            </Box>
                        </Box>
                    )}

                    {activeListing.listing_type === 'package' && (
                        <Box sx={{ mb: 3 }}>
                            <Stack spacing={2}>
                                {activeVariant.items?.length > 0 && (
                                    <Box>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" onClick={() => setProductsExpanded(!productsExpanded)} sx={{ cursor: 'pointer', mb: productsExpanded ? 1.5 : 0 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Inventory2OutlinedIcon sx={{ fontSize: 16, color: GOLD }} />
                                                <Typography variant="caption" sx={{ color: GOLD, fontWeight: 'bold', letterSpacing: 1 }}>INCLUDED PRODUCTS</Typography>
                                            </Stack>
                                            <IconButton size="small" sx={{ p: 0, color: GOLD, transform: productsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}><ExpandMoreIcon fontSize="small" /></IconButton>
                                        </Stack>
                                        <Collapse in={productsExpanded} timeout="auto" unmountOnExit>
                                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, pt: 0.5, ...scrollbarStyle }}>
                                                {activeVariant.items.map((item) => <IncludedProductCard key={item.id} item={item} />)}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                )}

                                {activeVariant.freelancers?.length > 0 && (
                                    <Box>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" onClick={() => setServicesExpanded(!servicesExpanded)} sx={{ cursor: 'pointer', mb: servicesExpanded ? 1.5 : 0 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: GOLD }} />
                                                <Typography variant="caption" sx={{ color: GOLD, fontWeight: 'bold', letterSpacing: 1 }}>INCLUDED SERVICES / STAFF</Typography>
                                            </Stack>
                                            <IconButton size="small" sx={{ p: 0, color: GOLD, transform: servicesExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}><ExpandMoreIcon fontSize="small" /></IconButton>
                                        </Stack>
                                        <Collapse in={servicesExpanded} timeout="auto" unmountOnExit>
                                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, pt: 0.5, ...scrollbarStyle }}>
                                                {activeVariant.freelancers.map((f) => <IncludedStaffCard key={f.id} freelancerData={f} />)}
                                            </Box>
                                        </Collapse>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    )}

                    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', rowGap: 1.5, mt: 1 }}>
                        <StatItem icon={CalendarTodayOutlinedIcon} label={displayDate} isDark={isDark} />
                        {displayShift && <StatItem icon={AccessTimeOutlinedIcon} label={displayShift} color={safeAccentColor} isDark={isDark} />}
                        <StatItem icon={ConfirmationNumberOutlinedIcon} label={`#${request.id?.substring(0, 8).toUpperCase()}`} isDark={isDark} />
                        <StatItem icon={SellOutlinedIcon} label={`Total Price: ${parseInt(request.offerValue || request.price || 0).toLocaleString()} ${request.currency || 'SYP'}`} color={GOLD} isDark={isDark} />
                    </Stack>
                </Box>

                {/* --- 2. Middle Section: Receipt --- */}
                {['confirmed', 'completed'].includes(request.status) && (
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        minWidth: { xs: '100%', md: 140 },
                        borderLeft: { md: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}` },
                        borderRight: { md: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}` },
                        borderTop: { xs: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}`, md: 'none' },
                        borderBottom: { xs: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}`, md: 'none' },
                        py: { xs: 3, md: 0 }, px: 2, mx: { md: 1 }
                    }}>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontWeight: 'bold', mb: 1.5, letterSpacing: 1 }}>RECEIPT</Typography>
                        <Box
                            onClick={() => paymentId && !receiptError && setOpenReceiptModal(true)}
                            sx={{
                                width: 80, height: 100, borderRadius: 2, border: `2px solid ${GOLD}`,
                                bgcolor: isDark ? '#1c1512' : '#ffffff', overflow: 'hidden',
                                cursor: (!paymentId || receiptError) ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                transition: 'all 0.2s', '&:hover': { transform: (!paymentId || receiptError) ? 'none' : 'scale(1.05)', boxShadow: (!paymentId || receiptError) ? 'none' : `0 4px 12px ${alpha(GOLD, 0.3)}` }
                            }}
                        >
                            {!paymentId || receiptError ? (
                                <Typography variant="caption" color="error" sx={{ fontSize: '10px', p: 1, fontWeight: 'bold' }}>No Receipt</Typography>
                            ) : receiptImage ? (
                                isPdf ? (
                                    <PictureAsPdfOutlinedIcon sx={{ color: '#ef5350', fontSize: 40 }} />
                                ) : (
                                    <img src={receiptImage} alt="Receipt Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )
                            ) : (
                                <CircularProgress size={24} sx={{ color: GOLD }} />
                            )}
                        </Box>
                        <Typography variant="caption" sx={{ color: GOLD, mt: 1.5, cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }} onClick={() => setOpenReceiptModal(true)}>
                            Click to View
                        </Typography>
                    </Box>
                )}

                {/* --- 3. Right Section: Customer Info & Buttons --- */}
                <Stack spacing={1.5} sx={{ minWidth: { sm: 220 }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: 'center' }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT }}>{customerName}</Typography>
                            <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, display: 'block', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {displayContact}
                            </Typography>
                        </Box>
                        <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(GOLD, 0.15), color: GOLD, border: `1px solid ${GOLD}` }}>{customerName.charAt(0)}</Avatar>
                    </Stack>

                    <Stack spacing={1} sx={{ width: '100%', maxWidth: 220, mt: 1 }}>
                        {request.status === 'pending' && (
                            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <Button variant="outlined" fullWidth onClick={() => onReject?.(request)} sx={{ borderRadius: 2, color: '#ef5350', borderColor: '#ef5350', '&:hover': { borderColor: '#d32f2f', bgcolor: alpha('#ef5350', 0.1) } }}>REJECT</Button>
                                <Button variant="contained" fullWidth onClick={() => onAccept?.(request)} sx={{ borderRadius: 2, bgcolor: '#4caf50', color: '#fff', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: '#388e3c', boxShadow: 'none' } }}>ACCEPT</Button>
                            </Stack>
                        )}

                        <Button
                            variant="outlined"
                            fullWidth
                            {...(contactHref ? { component: 'a', href: contactHref } : { disabled: true })}
                            sx={{ borderRadius: 2, borderColor: GOLD, color: GOLD, '&:hover': { borderColor: GOLD, bgcolor: alpha(GOLD, 0.1) }, '&.Mui-disabled': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER, color: isDark ? 'rgba(255,255,255,0.3)' : MUTED_TEXT } }}
                        >
                            CONTACT
                        </Button>

                        <Button variant="contained" fullWidth onClick={() => onView?.(request)} sx={{ borderRadius: 2, bgcolor: config.buttonColor, color: (config.buttonColor === GOLD) ? '#131110' : '#ffffff', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: config.buttonColor, opacity: 0.8, boxShadow: `0 4px 12px ${alpha(resolveColor(theme, config.buttonColor), 0.3)}` } }}>{config.buttonLabel}</Button>
                    </Stack>
                </Stack>
            </Stack>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ pt: 3, mt: 2.5, borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}` }}>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, letterSpacing: 1, display: 'block', mb: 2, fontSize: 11 }}>REQUEST TIMELINE</Typography>
                    <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
                        {timeline.map((step, idx) => (
                            <React.Fragment key={`${step.label}-${idx}`}>
                                <Stack sx={{ alignItems: 'center', minWidth: 84 }}>
                                    <Box sx={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: step.completed ? (step.isTerminalNegative ? '#ef5350' : GOLD) : 'transparent', border: '2px solid', borderColor: step.completed ? (step.isTerminalNegative ? '#ef5350' : GOLD) : (isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER) }}>
                                        {step.completed && (step.isTerminalNegative ? <CloseIcon sx={{ fontSize: 14, color: '#fff' }} /> : <CheckIcon sx={{ fontSize: 14, color: '#131110' }} />)}
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT, textAlign: 'center' }}>{step.label}</Typography>
                                </Stack>
                                {idx < timeline.length - 1 && <Box sx={{ flex: 1, mt: '10px', borderTop: '2px dotted', borderColor: step.completed ? GOLD : (isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER) }} />}
                            </React.Fragment>
                        ))}
                    </Stack>
                </Box>
            </Collapse>

            {/* Receipt Modal */}
            <Dialog
                open={openReceiptModal}
                onClose={() => setOpenReceiptModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD, backdropFilter: 'blur(16px)', border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: 3, backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', color: GOLD, fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                        Payment Receipt
                    </Typography>
                    <IconButton onClick={() => setOpenReceiptModal(false)} size="small" sx={{color: isDark ? '#ffffff' : BROWN_TEXT}}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, borderColor: isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER }}>
                    {receiptError ? (
                        <Typography color="error" fontWeight="bold">Receipt not found or link is broken.</Typography>
                    ) : receiptImage ? (
                        isPdf ? (
                            <iframe src={receiptImage} title="Payment Receipt PDF" width="100%" height="500px" style={{ border: 'none', borderRadius: '8px' }} />
                        ) : (
                            <img src={receiptImage} alt="Payment Receipt" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER}` }} />
                        )
                    ) : (
                        <CircularProgress sx={{ color: GOLD }} />
                    )}
                </DialogContent>
            </Dialog>

        </Box>
    );
};

RequestCard.propTypes = { request: PropTypes.object.isRequired, onView: PropTypes.func, onAccept: PropTypes.func, onReject: PropTypes.func };

export default RequestCard;