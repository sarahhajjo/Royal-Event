import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Avatar, Rating, Chip, Button, Divider, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import dayjs from 'dayjs';

import { useDispatch } from 'react-redux';
import { setSelectedFreelancer } from '../../JobOfferAplicants/jobManagementSlice';

// 💡 استيراد الألوان الموحدة (يرجى التأكد من مسار الملف لديكِ)
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW
} from '../../../../utils/colorConstants';

const formatDate = (d) => (d ? dayjs(d).format('MMM D, YYYY') : '—');

const resolveThemeColor = (theme, path) =>
    path.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), theme.palette) || path;

const STATUS_COLOR = {
    active: 'success.main',
    pending: 'warning.main',
    ended: 'text.secondary',
    cancelled: 'error.main',
};

const EmployeeContractCard = ({ contract }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { freelancer, status, created_at: contractDate } = contract;
    const user = freelancer?.user;
    const firstName = user?.first_name || '';
    const lastName = user?.last_name || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
    const statusColor = STATUS_COLOR[status] || 'text.secondary';

    return (
        <Box
            sx={{
                maxWidth: '980px',
                position: 'relative',
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                mb: 2.5,
                backdropFilter: 'blur(16px)',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                    borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)',
                    transform: 'translateY(-4px)',
                    boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    bgcolor: status === 'active' ? '#4caf50' : GOLD,
                    opacity: 0.7,
                    borderRadius: '4px 0 0 4px',
                }
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                divider={
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            mx: { md: 2.5 },
                            my: 1,
                            borderColor: isDark ? DARK_CARD_BORDER : LIGHT_BORDER
                        }}
                    />
                }
                spacing={{ xs: 2.5, md: 0 }}
                alignItems="stretch"
            >
                {/* 1. الهوية والتقييم */}
                <Box sx={{ width: { xs: '100%', md: '42%' }, display: 'flex', alignItems: 'center' }}>
                    <Stack direction="row" spacing={2.5} alignItems="center" width="100%">
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                flexShrink: 0,
                                bgcolor: alpha(GOLD, 0.15),
                                color: GOLD,
                                border: `1px solid ${alpha(GOLD, 0.3)}`,
                                fontWeight: 700,
                                fontSize: '1.5rem',
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5} mb={0.75}>
                                <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, fontFamily: "'Playfair Display', serif" }}>
                                    {fullName}
                                </Typography>
                                {!!freelancer?.is_verified && (
                                    <VerifiedIcon titleAccess="Verified" sx={{ fontSize: 18, color: '#4caf50' }} />
                                )}
                                {freelancer?.moderation_status === 'approved' && (
                                    <Chip
                                        label="APPROVED"
                                        size="small"
                                        sx={{
                                            height: 18, fontSize: '0.6rem', fontWeight: 700,
                                            bgcolor: alpha('#4caf50', 0.15),
                                            color: '#4caf50', border: 'none'
                                        }}
                                    />
                                )}
                            </Stack>
                            <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1.25, letterSpacing: '0.03em' }}>
                                {freelancer?.brand_name || '—'}
                                {freelancer?.provider_type ? ` • ${freelancer.provider_type}` : ''}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Rating value={parseFloat(freelancer?.rating) || 0} precision={0.1} readOnly size="small" sx={{ color: GOLD }} />
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 700 }}>
                                    {freelancer?.rating ?? '—'}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* 2. التفاصيل والمهارات */}
                <Box sx={{ width: { xs: '100%', md: '38%' }, display: 'flex', flexDirection: 'column', justifyContent: 'right', alignItems: 'center' }}>
                    <Stack spacing={1.75}>
                        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <WorkHistoryOutlinedIcon sx={{ fontSize: 16, color: GOLD, opacity: 0.8 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>
                                    {freelancer?.freelancer_details?.experience_years ?? '—'} yrs exp.
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <TranslateIcon sx={{ fontSize: 16, color: GOLD, opacity: 0.8 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>
                                    {user?.settings_language ? user.settings_language.toUpperCase() : '—'}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack spacing={0.75}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <MailOutlinedIcon sx={{ fontSize: 16, color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, wordBreak: 'break-all' }}>{user?.email || '—'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <PhoneOutlinedIcon sx={{ fontSize: 16, color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>{user?.phone || 'No phone'}</Typography>
                            </Stack>
                        </Stack>

                        {!!freelancer?.categories?.length && (
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, pt: 0.5 }}>
                                {freelancer.categories.map((cat) => (
                                    <Chip
                                        key={cat.id}
                                        label={cat.name?.en || cat.name?.ar || '—'}
                                        size="small"
                                        sx={{
                                            height: 24, fontSize: '0.7rem', fontWeight: 500,
                                            bgcolor: alpha(GOLD, 0.1),
                                            color: GOLD, border: 'none', borderRadius: 1.5
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Box>

                {/* 3. الحالة والأزرار */}
                <Box sx={{ width: { xs: '100%', md: '20%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }} spacing={0.5}>
                            <Chip
                                label={status ? status.toUpperCase() : '—'}
                                size="small"
                                sx={{
                                    fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.05em',
                                    bgcolor: (theme) => alpha(resolveThemeColor(theme, statusColor), 0.15),
                                    color: statusColor, border: 'none', borderRadius: 1
                                }}
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontStyle: 'italic' }}>
                                Hired: {formatDate(contractDate)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5}>
                            <Button
                                size="small" variant="outlined"
                                {...(user?.email ? { component: 'a', href: `mailto:${user.email}` } : {})}
                                sx={{
                                    borderColor: alpha(GOLD, 0.5),
                                    color: GOLD, textTransform: 'none', borderRadius: 2, px: 2,
                                    whiteSpace: 'nowrap',
                                    '&:hover': { borderColor: GOLD, bgcolor: alpha(GOLD, 0.05) }
                                }}
                            >
                                Contact
                            </Button>
                            <Button
                                size="small" variant="contained"
                                onClick={() => dispatch(setSelectedFreelancer(freelancer))}
                                sx={{
                                    bgcolor: GOLD, color: '#131110', fontWeight: 700,
                                    textTransform: 'none', borderRadius: 2, px: 2, boxShadow: 'none',
                                    whiteSpace: 'nowrap',
                                    '&:hover': { bgcolor: '#b38c45', boxShadow: 'none' },
                                }}
                            >
                                Profile
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

EmployeeContractCard.propTypes = {
    contract: PropTypes.object.isRequired,
};

export default EmployeeContractCard;