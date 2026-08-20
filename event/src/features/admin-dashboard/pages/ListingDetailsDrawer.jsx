import React from 'react';
import { Box, Typography, Drawer, IconButton, Paper, Avatar, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import dayjs from 'dayjs';

const L = {
    bg:          '#FAF0D5',
    paper:       '#EFE4C9',
    primary:     '#b38c45',
    textPrimary: '#2B211E',
    textMuted:   '#7A6F5E',
    border:      '#DCCBA0',
};

const paperSx = {
    width: { xs: '100%', sm: '70%', md: '50%' },
    bgcolor: L.bg,
    backgroundColor: L.bg,
    backgroundImage: 'none',
    color: L.textPrimary,
    p: { xs: 3, md: 5 },
    overflowY: 'auto',
    borderLeft: `1px solid ${L.border}`,
    boxShadow: '-10px 0 30px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    fontFamily: "'Inter', sans-serif",
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-thumb': { bgcolor: L.border, borderRadius: 3 }
};

// 👑 الدالة السحرية لتصحيح مسار الصور ديناميكياً
const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400";

    // إذا كان الرابط كامل أصلاً، نرجعه كما هو
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // جلب الرابط الأساسي من البيئة
    const mode = import.meta.env.VITE_ENV_MODE || 'ngrok';
    const apiUrl = mode === 'ngrok'
        ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
        : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

    // إزالة كلمة /api من النهاية لكي نحصل على رابط السيرفر الأساسي فقط
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');

    // إضافة / قبل مسار الصورة في حال لم يكن موجوداً
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};

export default function ListingDetailsDrawer({ open, onClose, item }) {
    if (!item) return null;

    // 👑 التحقق هل العنصر عبارة عن وظيفة (Job Offer) بناءً على الحقول الواردة
    const isJob = item.type === 'job' || item.job_title !== undefined;

    // استخراج النصوص حسب نوع العنصر
    const titleText = isJob
        ? item.job_title
        : (typeof item.title === 'object' ? (item.title?.en || item.title?.ar || 'Untitled') : (item.title || 'Untitled'));

    const descText = isJob
        ? item.job_requirements_and_scope
        : (typeof item.description === 'object' ? (item.description?.en || item.description?.ar || '') : (item.description || 'No description provided.'));

    // 👑 تطبيق دالة تصحيح الصور هنا
    const images = !isJob && item.images && item.images.length > 0
        ? item.images.map(img => getImageUrl(img.url || img))
        : [getImageUrl(item.imageUrl)];

    // معلومات المزود / الشركة
    const providerName = item.provider?.brand_name || item.provider?.name || item.company?.name || 'Unknown Provider';
    const providerEmail = item.contact_info || item.provider?.email || item.company?.email || null;
    const initial = providerName !== 'Unknown Provider' ? providerName.charAt(0).toUpperCase() : 'U';

    const status = item.status || item.moderation_status || 'PENDING_APPROVAL';
    const isApproved = status.toLowerCase() === 'approved';
    const categoryName = isJob ? (item.service?.name || item.event_type || 'Job Offer') : (item.category?.name?.en || item.category?.name || 'General');

    // التنسيق الخاص بالراتب أو الأجر للوظيفة أو السعر للخدمة
    const rateText = isJob
        ? `${item.salary} USD (${item.payment_system || 'Fixed'})`
        : (item.price ? `${item.pricing_type || 'Fixed'} / ${item.price} USD` : (item.rate || 'N/A'));

    const locationText = item.location || item.district?.name || 'Al-Adawi';
    const createdAt = item.created_at ? dayjs(item.created_at).format('DD MMM YYYY') : '12 Jul 2026';

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{ zIndex: 1300 }}
            slotProps={{
                backdrop: { sx: { backgroundColor: 'rgba(28, 23, 18, 0.35)' } },
                paper: { sx: paperSx }
            }}
            PaperProps={{ sx: paperSx }}
        >
            {/* الرأس */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: L.textMuted,
                        border: `1.5px solid ${L.border}`,
                        borderRadius: '50%',
                        width: 34, height: 34, flexShrink: 0,
                        '&:hover': { color: L.primary, borderColor: L.primary, bgcolor: 'transparent' }
                    }}
                >
                    <CloseIcon sx={{ fontSize: '17px' }} />
                </IconButton>

                <Box sx={{ textAlign: 'right', flex: 1, ml: 3, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: { xs: '1.3rem', md: '1.6rem' },
                            color: L.textPrimary,
                            fontWeight: 600,
                            lineHeight: 1.2,
                            mb: 1,
                            wordBreak: 'break-word'
                        }}
                    >
                        {titleText}
                    </Typography>
                    <Chip
                        icon={
                            <Box sx={{
                                width: 6, height: 6, borderRadius: '50%',
                                bgcolor: isApproved ? '#2ecc71' : L.primary,
                                ml: '8px !important'
                            }} />
                        }
                        label={`STATUS: ${status.toUpperCase()}`}
                        size="small"
                        sx={{
                            bgcolor: isApproved ? 'rgba(46, 204, 113, 0.1)' : L.paper,
                            color: isApproved ? '#2ecc71' : L.primary,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            letterSpacing: 0.5,
                            borderRadius: '20px',
                            border: `1px solid ${isApproved ? 'rgba(46, 204, 113, 0.3)' : L.border}`,
                            flexDirection: 'row-reverse',
                            '& .MuiChip-icon': { order: 2 }
                        }}
                    />
                </Box>
            </Box>

            {/* صور الخدمة */}
            {!isJob && (
                <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: L.primary, mb: 1.2 }}>
                        Service Images
                    </Typography>
                    <Box sx={{
                        display: 'flex', gap: 2, overflowX: 'auto', pb: 1.2,
                        '&::-webkit-scrollbar': { height: 4 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: L.border, borderRadius: 2 }
                    }}>
                        {images.map((imgUrl, idx) => (
                            <Box
                                key={idx}
                                component="img"
                                src={imgUrl}
                                alt={`Preview ${idx}`}
                                sx={{
                                    width: 220, height: 150, borderRadius: '10px',
                                    objectFit: 'cover', border: `1px solid ${L.border}`, flexShrink: 0
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* كرت المزود أو الشركة */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5, bgcolor: L.paper, border: `1px solid ${L.border}`,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2, width: '100%'
                }}
            >
                <Avatar
                    sx={{
                        width: 48, height: 48, fontSize: '1.15rem',
                        bgcolor: L.bg, color: L.primary, fontWeight: 800,
                        borderRadius: '10px', border: `1px solid ${L.border}`
                    }}
                >
                    {initial}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: L.primary, mb: 0.4 }}>
                        {isJob ? 'Company / Provider' : 'Submitted by Provider'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: L.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {providerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                        <Typography sx={{ fontSize: '0.78rem', color: L.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {providerEmail || 'No Contact Provided'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* شبكة المعلومات */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 3, columnGap: 4, pb: 3, borderBottom: `1px solid ${L.border}` }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                        <CategoryOutlinedIcon sx={{ fontSize: '16px', color: L.primary }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: L.primary }}>
                            {isJob ? 'Event Type' : 'Category'}
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: L.textPrimary, pl: 2.8 }}>{categoryName}</Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                        <AttachMoneyOutlinedIcon sx={{ fontSize: '16px', color: L.primary }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: L.primary }}>
                            {isJob ? 'Salary' : 'Rate'}
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: L.textPrimary, pl: 2.8 }}>{rateText}</Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: '15px', color: L.primary }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: L.primary }}>
                            {isJob ? 'Start Date' : 'Created At'}
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: L.textPrimary, pl: 2.8 }}>
                        {isJob ? (item.job_start_date || 'N/A') : createdAt}
                    </Typography>
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: '16px', color: L.primary }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: L.primary }}>
                            {isJob ? 'Experience' : 'Location'}
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: L.textPrimary, pl: 2.8 }}>
                        {isJob ? (item.experience_level || 'General') : locationText}
                    </Typography>
                </Box>
            </Box>

            {/* الوصف أو المتطلبات */}
            <Box sx={{ width: '100%', pb: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: L.primary, mb: 1.2 }}>
                    {isJob ? 'Job Requirements & Scope' : 'Description & Features'}
                </Typography>
                <Paper
                    elevation={0}
                    sx={{ p: 2.5, bgcolor: L.paper, border: `1px solid ${L.border}`, borderRadius: '10px' }}
                >
                    <Typography sx={{ fontSize: '0.88rem', color: L.textPrimary, lineHeight: 1.7, wordBreak: 'break-word' }}>
                        {descText}
                    </Typography>
                </Paper>
            </Box>

        </Drawer>
    );
}