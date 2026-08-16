import React from 'react';
import { Box, Typography, Drawer, IconButton, Paper, Avatar, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { T, typography } from '../Theme.jsx';
import dayjs from 'dayjs';

export default function ListingDetailsDrawer({ open, onClose, item }) {
    if (!item) return null;

    // استخلاص البيانات بأمان تام
    const titleText = typeof item.title === 'object' ? (item.title?.en || item.title?.ar || 'Untitled') : (item.title || 'Untitled');
    const descText = typeof item.description === 'object' ? (item.description?.en || item.description?.ar || '') : (item.description || 'No description provided.');

    // الصور
    const images = item.images && item.images.length > 0
        ? item.images.map(img => img.url || img)
        : [item.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400"];

    // معلومات المزود (Provider / Company)
    const providerName = item.company?.name || item.provider?.brand_name || item.submittedBy || 'Unknown Provider';
    const providerEmail = item.company?.email || item.provider?.email || 'No Email Provided';
    const providerAvatar = item.company?.avatar || item.provider?.avatar || '';
    const initial = providerName !== 'Unknown Provider' ? providerName.charAt(0).toUpperCase() : 'U';

    // الحالة
    const status = item.status || item.moderation_status || 'PENDING_APPROVAL';
    const categoryName = item.category?.name?.en || item.category?.name || item.category_name || 'General';
    const rateText = item.price ? `${item.pricing_type || 'Fixed'} / ${item.price} USD` : (item.rate || 'N/A');
    const locationText = item.location || item.address || 'Al-Adawi';
    const createdAt = item.created_at ? dayjs(item.created_at).format('DD MMM YYYY') : '12 Jul 2026';

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 520, md: 580 },
                    bgcolor: T.pageBg,
                    p: 3.5,
                    overflowY: 'auto',
                    borderLeft: `1px solid ${T.border}`
                }
            }}
        >
            {/* 👑 زر الإغلاق وعنوان السلايدر */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ border: `1px solid ${T.border}`, borderRadius: '50%', color: T.textMuted, '&:hover': { color: T.gold, borderColor: T.gold } }}
                >
                    <CloseIcon sx={{ fontSize: '18px' }} />
                </IconButton>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 700, color: T.textPrimary, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {titleText}
                    </Typography>
                    <Chip
                        label={`STATUS: ${status.toUpperCase()}`}
                        size="small"
                        sx={{
                            mt: 0.8,
                            bgcolor: status === 'approved' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)',
                            color: status === 'approved' ? '#2ecc71' : '#d4ac0d',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            border: `1px solid ${status === 'approved' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(241, 196, 15, 0.3)'}`
                        }}
                    />
                </Box>
            </Box>

            {/* 👑 قسم صور الخدمة (Service Images) */}
            <Box sx={{ mb: 3.5 }}>
                <Typography sx={{ ...typography.sectionLabel, mb: 1.5 }}>
                    Service Images
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: T.border, borderRadius: 2 } }}>
                    {images.map((imgUrl, idx) => (
                        <Box
                            key={idx}
                            component="img"
                            src={imgUrl}
                            alt={`Service preview ${idx}`}
                            sx={{
                                width: 160,
                                height: 110,
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: `1px solid ${T.border}`,
                                flexShrink: 0
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* 👑 كرت معلومات المزود (Submitted by Provider) */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3.5,
                    bgcolor: T.cardBg,
                    border: `1px solid ${T.border}`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <Avatar src={providerAvatar} sx={{ width: 44, height: 44, bgcolor: T.avatarBg, color: T.gold, fontWeight: 700, borderRadius: '8px', border: `1px solid ${T.border}` }}>
                    {initial}
                </Avatar>
                <Box>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
                        Submitted by Provider
                    </Typography>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: T.textPrimary }}>
                        {providerName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: T.textMuted }}>
                        {providerEmail}
                    </Typography>
                </Box>
            </Paper>

            {/* 👑 شبكة المعلومات (Category, Rate, Created At, Location) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3.5, pb: 3, borderBottom: `1px solid ${T.border}` }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                        <CategoryOutlinedIcon sx={{ fontSize: '16px', color: T.gold }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Category</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.textPrimary, pl: 2.8 }}>{categoryName}</Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                        <AttachMoneyOutlinedIcon sx={{ fontSize: '16px', color: T.gold }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Rate</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.textPrimary, pl: 2.8 }}>{rateText}</Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: '15px', color: T.gold }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Created At</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.textPrimary, pl: 2.8 }}>{createdAt}</Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: '16px', color: T.gold }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: T.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>Location</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.textPrimary, pl: 2.8 }}>{locationText}</Typography>
                </Box>
            </Box>

            {/* 👑 قسم الوصف والتفاصيل (Description & Features) */}
            <Box>
                <Typography sx={{ ...typography.sectionLabel, mb: 1.5 }}>
                    Description & Features
                </Typography>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        bgcolor: T.cardBg,
                        border: `1px solid ${T.border}`,
                        borderRadius: '10px'
                    }}
                >
                    <Typography sx={{ fontSize: '0.85rem', color: T.textPrimary, lineHeight: 1.6, fontFamily: typography.fontFamily }}>
                        {descText}
                    </Typography>
                </Paper>
            </Box>

        </Drawer>
    );
}