import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, TextField, Stack, Button, IconButton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import BusinessCenterOutlinedIcon  from '@mui/icons-material/BusinessCenterOutlined';
import EmailOutlinedIcon           from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon     from '@mui/icons-material/PhoneIphoneOutlined';
import VerifiedUserOutlinedIcon    from '@mui/icons-material/VerifiedUserOutlined';
import ArticleOutlinedIcon         from '@mui/icons-material/ArticleOutlined';
import ArrowBackIcon               from '@mui/icons-material/ArrowBack';
import StarIcon                    from '@mui/icons-material/Star';
import ChevronLeftIcon             from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon            from '@mui/icons-material/ChevronRight';
import CalendarMonthOutlinedIcon   from '@mui/icons-material/CalendarMonthOutlined';

import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedFreelancer, fetchFreelancerBlockedDates } from './jobManagementSlice';
import dayjs from 'dayjs';

// 💡 استيراد كل الثوابت التي قمتِ بتجهيزها
import {
    GOLD,
    BROWN_TEXT,
    MUTED_TEXT,
    TITLE_TEXT_LIGHT,
    LIGHT_CARD,
    LIGHT_INPUT,
    LIGHT_BORDER,
    DARK_CARD_BACKGROUND,
    DARK_CARD_BORDER,
    DARK_CARD_SHADOW,
    DARK_SURFACE_BG
} from '../../../utils/colorConstants';

// ─── ثوابت ودوال مساعدة للتقويم ───
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'Am' : 'Pm';
    return `${hour12} ${period}`;
});

const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// ─── مكون عرض الكرت في التقويم (قراءة فقط) ───
function ReadOnlyEventCard({ event, isDark }) {
    const timeDisplay = event.start_time && event.end_time
        ? `${formatDisplayTime(event.start_time)} - ${formatDisplayTime(event.end_time)}`
        : 'All Day';

    return (
        <Box
            sx={{
                bgcolor: isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.08),
                border: `1px solid ${isDark ? alpha(GOLD, 0.3) : alpha(GOLD, 0.6)}`,
                borderRadius: 2,
                px: 1,
                py: 0.5,
                width: '100%',
                maxWidth: 110,
                flexShrink: 0,
                mb: 0.5,
                userSelect: 'none',
                position: 'relative',
                zIndex: 10
            }}
        >
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#ffffff' : '#1A120D', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {event.note || 'Blocked Time'}
            </Typography>
            <Typography sx={{ fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT, lineHeight: 1.2, mt: 0.5, whiteSpace: 'nowrap', fontWeight: 500 }}>
                {timeDisplay}
            </Typography>
        </Box>
    );
}

export default function FreelancerProfileView() {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { selectedFreelancer, blockedDates } = useSelector((state) => state.jobManagement);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewMonth, setViewMonth] = useState(dayjs());

    useEffect(() => {
        if (selectedFreelancer?.id) {
            dispatch(fetchFreelancerBlockedDates(selectedFreelancer.id));
        }
    }, [selectedFreelancer, dispatch]);

    if (!selectedFreelancer) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>No applicant selected.</Typography>
                <Button onClick={() => dispatch(clearSelectedFreelancer())} sx={{ mt: 2, color: GOLD }}>Go Back</Button>
            </Box>
        );
    }

    const user = selectedFreelancer.user || {};
    const provider = selectedFreelancer || {};
    const freelancerDetails = selectedFreelancer.freelancer_details || {};

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
    const initial = fullName !== 'N/A' ? fullName.charAt(0).toUpperCase() : '?';
    const email = user.email || 'N/A';
    const phone = user.phone || 'Not Provided';
    const isVerified = provider.is_verified === 1 || provider.is_verified === true;
    const createdAt = user.created_at ? dayjs(user.created_at).format('MMM DD, YYYY') : 'N/A';

    const brandName = provider.brand_name || 'N/A';
    const moderationStatus = provider.moderation_status || 'N/A';
    const providerType = provider.provider_type || 'N/A';
    const rating = provider.rating || 'N/A';

    const nationalId = freelancerDetails.national_id || 'N/A';
    const experienceYears = freelancerDetails.experience_years ? `${freelancerDetails.experience_years} Years` : 'N/A';
    const addressDetails = freelancerDetails.address_details || 'Not Provided';

    const isPhoneVerified = !!user.phone_verified_at;
    const isEmailVerified = !!user.email_verified_at;

    const industryCategories = provider.categories && provider.categories.length > 0
        ? provider.categories.map(c => c.name?.en || c.name?.ar || 'Unknown').join(' • ')
        : 'N/A';

    // 💡 استخدام الثوابت الجديدة لإنشاء تأثير الزجاج (Glassmorphism)
    const cardBg        = isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD;
    const cardBorder    = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
    const cardShadow    = isDark ? DARK_CARD_SHADOW : '0 8px 32px rgba(0,0,0,0.08)';

    const inputBg       = isDark ? DARK_SURFACE_BG : LIGHT_INPUT;
    const dividerColor  = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    const textPrimary   = isDark ? '#ffffff' : '#1A120D';
    const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT;

    const card = {
        backgroundColor: cardBg,
        border: cardBorder,
        borderRadius: 3,
        p: 3,
        boxShadow: cardShadow,
        backdropFilter: 'blur(12px)', // 💡 تأثير الزجاج
        WebkitBackdropFilter: 'blur(12px)',
    };

    const inp = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: inputBg,
            borderRadius: 1.5,
            backdropFilter: 'blur(4px)',
            '& fieldset': { borderColor: dividerColor }
        },
        '& .MuiInputBase-input': { fontSize: '0.88rem', padding: '10px 14px', color: textPrimary },
        '& .Mui-disabled': { WebkitTextFillColor: textPrimary, opacity: 0.95 }
    };

    const FieldLabel = ({ children }) => (
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textSecondary, mb: 0.75, display: 'block' }}>
            {children}
        </Typography>
    );

    const CardHeader = ({ icon: Icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Icon sx={{ color: isDark ? GOLD : BROWN_TEXT, fontSize: 20 }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: textPrimary }}>{title}</Typography>
        </Box>
    );

    // ─── متغيرات التقويم ───
    const startOfMonth = viewMonth.startOf('month');
    const daysInMonth = viewMonth.daysInMonth();
    const startDayOfWeek = startOfMonth.day();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const calendarDays = Array(startOffset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const handlePrevMonth = () => setViewMonth(viewMonth.subtract(1, 'month'));
    const handleNextMonth = () => setViewMonth(viewMonth.add(1, 'month'));
    const handleDaySelect = (day) => {
        const newDate = viewMonth.date(day);
        setSelectedDate(newDate);
    };

    const currentDayOfWeek = selectedDate.day();
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayOfWeek = selectedDate.add(diffToMonday, 'day');

    const dynamicWeekColumns = Array.from({ length: 7 }, (_, i) => {
        const date = mondayOfWeek.add(i, 'day');
        return { fullDate: date, date: date.date(), label: date.format('ddd') };
    });

    const handleToday = () => {
        const today = dayjs();
        setSelectedDate(today);
        setViewMonth(today);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 3 } }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => dispatch(clearSelectedFreelancer())}
                        sx={{ color: textSecondary, mb: 1, textTransform: 'none', '&:hover': { color: GOLD } }}
                    >
                        Back to Applicants
                    </Button>
                    <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 100, color: isDark ? GOLD : TITLE_TEXT_LIGHT, mb: 0.5, letterSpacing: '0.02em' }}>
                        Applicant Profile
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: textSecondary, fontWeight: 400 }}>
                        Detailed view of the freelancer's credentials, experience, and system profile.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>

                {/* ── العمود الأيسر ── */}
                <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ width: 96, height: 96, border: `2px solid ${GOLD}`, bgcolor: isDark ? DARK_SURFACE_BG : alpha(GOLD, 0.15), color: isDark ? GOLD : BROWN_TEXT, fontSize: '2.5rem', mb: 1.5 }}>
                                    {initial}
                                </Avatar>
                                <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: textPrimary, mb: 0.3, textTransform: 'capitalize' }}>
                                    {fullName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: GOLD, textTransform: 'uppercase', fontWeight: 700 }}>
                                    {providerType}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                    <StarIcon sx={{ color: GOLD, fontSize: 18 }} />
                                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: textPrimary }}>
                                        {rating}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={0} divider={<Box sx={{ height: '1px', backgroundColor: dividerColor }} />}>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
                                    <EmailOutlinedIcon sx={{ color: isDark ? textSecondary : BROWN_TEXT, fontSize: 18, mt: '2px' }} />
                                    <Box><Typography sx={{ fontSize: '0.6rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>Email Address</Typography><Typography sx={{ fontSize: '0.85rem', color: textPrimary, fontWeight: 600 }}>{email}</Typography></Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
                                    <PhoneIphoneOutlinedIcon sx={{ color: isDark ? textSecondary : BROWN_TEXT, fontSize: 18, mt: '2px' }} />
                                    <Box><Typography sx={{ fontSize: '0.6rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>Contact Number</Typography><Typography sx={{ fontSize: '0.85rem', color: textPrimary, fontWeight: 600 }}>{phone}</Typography></Box>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: textSecondary, mb: 2 }}>Verification & Status</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                                <Typography sx={{ fontSize: '0.9rem', color: textPrimary, fontWeight: 600 }}>Identity Verification</Typography>
                                <Box sx={{ border: `1px solid ${isVerified ? '#2ecc71' : '#b05050'}`, color: isVerified ? '#2ecc71' : '#b05050', px: 1.2, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 800 }}>{isVerified ? 'VERIFIED' : 'PENDING'}</Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '0.9rem', color: textPrimary, fontWeight: 600 }}>Joined Platform</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: textSecondary, fontWeight: 500 }}>{createdAt}</Typography>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ ...card, p: 2.5 }}>
                            <CardHeader icon={CalendarMonthOutlinedIcon} title="Availability" />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? GOLD : TITLE_TEXT_LIGHT, fontWeight: 700, fontSize: '1.1rem' }}>{viewMonth.format('MMMM YYYY')}</Typography>
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton onClick={handlePrevMonth} size="small" sx={{ color: textSecondary, padding: '4px', '&:hover': { bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05) } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                    <IconButton onClick={handleNextMonth} size="small" sx={{ color: textSecondary, padding: '4px', '&:hover': { bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05) } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                </Stack>
                            </Stack>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
                                {WEEK_DAYS.map((d) => <Typography key={d} sx={{ fontSize: '11px', color: textSecondary, fontWeight: 700, pb: 0.5 }}>{d}</Typography>)}
                                {calendarDays.map((day, i) => {
                                    const isSelected = day === selectedDate.date() && viewMonth.isSame(selectedDate, 'month');
                                    const isToday = day === dayjs().date() && viewMonth.isSame(dayjs(), 'month');
                                    return (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
                                            {day && (
                                                <Box onClick={() => handleDaySelect(day)} sx={{
                                                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                                                    bgcolor: isSelected ? GOLD : isToday ? (isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.1)) : 'transparent',
                                                    color: isSelected ? '#1A120D' : isToday ? textPrimary : textSecondary,
                                                    fontWeight: isSelected ? 800 : 500, '&:hover': { bgcolor: isSelected ? '#d4b06a' : (isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05)) }
                                                }}>{day}</Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Stack>
                </Box>

                {/* ── العمود الأيمن ── */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={2.5}>
                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={BusinessCenterOutlinedIcon} title="Professional Credentials" />

                            <Box sx={{ mb: 2 }}>
                                <FieldLabel>Brand / Stage Name</FieldLabel>
                                <TextField fullWidth size="small" value={brandName} disabled sx={inp} />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>National ID</FieldLabel>
                                    <TextField fullWidth size="small" value={nationalId} disabled sx={inp} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Experience Years</FieldLabel>
                                    <TextField fullWidth size="small" value={experienceYears} disabled sx={inp} />
                                </Box>
                            </Box>

                            <Box>
                                <FieldLabel>Expertise Categories</FieldLabel>
                                <TextField fullWidth size="small" value={industryCategories} disabled sx={inp} />
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={VerifiedUserOutlinedIcon} title="Account Status" />

                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Moderation Status</FieldLabel>
                                    <TextField fullWidth size="small" value={moderationStatus} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Provider Type</FieldLabel>
                                    <TextField fullWidth size="small" value={providerType} disabled sx={{ ...inp, textTransform: 'capitalize' }} />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Phone Verified</FieldLabel>
                                    <Typography sx={{ fontSize: '0.95rem', color: isPhoneVerified ? '#2ecc71' : '#b05050', fontWeight: 700 }}>
                                        {isPhoneVerified ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FieldLabel>Email Verified</FieldLabel>
                                    <Typography sx={{ fontSize: '0.95rem', color: isEmailVerified ? '#2ecc71' : '#b05050', fontWeight: 700 }}>
                                        {isEmailVerified ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={card}>
                            <CardHeader icon={ArticleOutlinedIcon} title="Platform Presentation" />
                            <FieldLabel>Address Details</FieldLabel>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={addressDetails}
                                disabled
                                sx={{ ...inp, '& .MuiInputBase-input': { padding: '12px 14px' } }}
                            />
                        </Paper>

                        <Paper elevation={0} sx={{ ...card, height: 600, display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? GOLD : TITLE_TEXT_LIGHT, fontWeight: 700, fontSize: '1.25rem' }}>
                                    Schedule: {selectedDate.format('MMMM DD - YYYY')}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button onClick={handleToday} variant="text" size="small" sx={{ color: textSecondary, bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05), borderRadius: 4, textTransform: 'none', px: 2, fontWeight: 600, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.1) } }}>Today</Button>
                                    <IconButton onClick={() => { setSelectedDate(selectedDate.subtract(1, 'day')); setViewMonth(selectedDate.subtract(1, 'day')); }} size="small" sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05) } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                    <IconButton onClick={() => { setSelectedDate(selectedDate.add(1, 'day')); setViewMonth(selectedDate.add(1, 'day')); }} size="small" sx={{ color: textSecondary, '&:hover': { bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05) } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                </Stack>
                            </Stack>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: 1, textAlign: 'center', pb: 2, borderBottom: `1px solid ${dividerColor}` }}>
                                <Typography sx={{ fontSize: '10px', color: textSecondary, textAlign: 'left', alignSelf: 'flex-end', pb: 0.5, fontWeight: 700 }}>GMT+8</Typography>
                                {dynamicWeekColumns.map((c) => {
                                    const isSelected = c.fullDate.isSame(selectedDate, 'day');
                                    return (
                                        <Box key={c.date} onClick={() => { setSelectedDate(c.fullDate); setViewMonth(c.fullDate); }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, borderRadius: 3, cursor: 'pointer', transition: '0.2s', bgcolor: isSelected ? GOLD : 'transparent', '&:hover': { bgcolor: isSelected ? '#d4b06a' : (isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05)) } }}>
                                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#1A120D' : textPrimary }}>{String(c.date).padStart(2, '0')}</Typography>
                                            <Typography sx={{ fontSize: '10px', fontWeight: 600, color: isSelected ? 'rgba(20, 14, 12, 0.8)' : textSecondary }}>{c.label}</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.2), borderRadius: '4px' } }}>
                                {HOURS.map((hourLabel, hourIndex) => {
                                    return (
                                        <Box key={hourLabel} sx={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: 1, alignItems: 'flex-start', py: 2, borderBottom: `1px solid ${dividerColor}` }}>
                                            <Typography sx={{ fontSize: '11px', color: textSecondary, pt: 1, fontWeight: 600 }}>{hourLabel}</Typography>

                                            {dynamicWeekColumns.map((c) => {
                                                const cellEvents = blockedDates.filter(b => {
                                                    const isSameDay = dayjs(b.blocked_date).isSame(c.fullDate, 'day');
                                                    if (!isSameDay) return false;

                                                    if (!b.start_time || !b.end_time) {
                                                        return hourIndex === 0;
                                                    }

                                                    const startHour = parseInt(b.start_time.split(':')[0], 10);
                                                    const endHour = parseInt(b.end_time.split(':')[0], 10);

                                                    return hourIndex === startHour || hourIndex === endHour;
                                                });

                                                return (
                                                    <Box key={c.date} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        {cellEvents.map((evt, idx) => <ReadOnlyEventCard key={idx} event={evt} isDark={isDark} />)}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>

                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}