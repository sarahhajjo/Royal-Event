import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Avatar, Rating, Chip, Button, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import dayjs from 'dayjs';

// 💡 1. استيراد الدسباتش والأكشن الخاص بتحديد الفريلانسر بناءً على المسار في صورتك
import { useDispatch } from 'react-redux';
import { setSelectedFreelancer } from '../../JobOfferAplicants/jobManagementSlice';

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
    // 💡 2. تهيئة الدسباتش
    const dispatch = useDispatch();

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
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 0.6),
                borderRadius: 3,
                p: { xs: 2.5, md: 3 },
                mb: 2.5,
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? alpha('#ffffff', 0.02) : alpha('#000000', 0.01),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 12px 30px rgba(197, 160, 89, 0.12)'
                        : '0 12px 30px rgba(179, 140, 69, 0.15)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    bgcolor: status === 'active' ? 'success.main' : 'primary.main',
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
                            borderColor: (theme) => alpha(theme.palette.divider, 0.5)
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
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                                fontWeight: 700,
                                fontSize: '1.5rem',
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5} mb={0.75}>
                                <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: 'text.primary', fontFamily: "'Playfair Display', serif" }}>
                                    {fullName}
                                </Typography>
                                {!!freelancer?.is_verified && (
                                    <VerifiedIcon titleAccess="Verified" sx={{ fontSize: 18, color: 'info.main' }} />
                                )}
                                {freelancer?.moderation_status === 'approved' && (
                                    <Chip
                                        label="APPROVED"
                                        size="small"
                                        sx={{
                                            height: 18, fontSize: '0.6rem', fontWeight: 700,
                                            bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                                            color: 'success.main', border: 'none'
                                        }}
                                    />
                                )}
                            </Stack>
                            <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mb: 1.25, letterSpacing: '0.03em' }}>
                                {freelancer?.brand_name || '—'}
                                {freelancer?.provider_type ? ` • ${freelancer.provider_type}` : ''}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Rating value={parseFloat(freelancer?.rating) || 0} precision={0.1} readOnly size="small" sx={{ color: 'primary.main' }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.primary', fontWeight: 700 }}>
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
                                <WorkHistoryOutlinedIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                    {freelancer?.freelancer_details?.experience_years ?? '—'} yrs exp.
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <TranslateIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                    {user?.settings_language ? user.settings_language.toUpperCase() : '—'}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack spacing={0.75}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <MailOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', wordBreak: 'break-all' }}>{user?.email || '—'}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <PhoneOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{user?.phone || 'No phone'}</Typography>
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
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main', border: 'none', borderRadius: 1.5
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
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic' }}>
                                Hired: {formatDate(contractDate)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5}>
                            <Button
                                size="small" variant="outlined"
                                {...(user?.email ? { component: 'a', href: `mailto:${user.email}` } : {})}
                                sx={{
                                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                                    color: 'primary.main', textTransform: 'none', borderRadius: 2, px: 2,
                                    whiteSpace: 'nowrap',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }
                                }}
                            >
                                Contact
                            </Button>
                            <Button
                                size="small" variant="contained"
                                // 💡 3. ربط الزر ليرسل بيانات الفريلانسر عند الضغط عليه
                                onClick={() => dispatch(setSelectedFreelancer(freelancer))}
                                sx={{
                                    bgcolor: 'primary.main', color: '#140e0c', fontWeight: 700,
                                    textTransform: 'none', borderRadius: 2, px: 2, boxShadow: 'none',
                                    whiteSpace: 'nowrap',
                                    '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
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