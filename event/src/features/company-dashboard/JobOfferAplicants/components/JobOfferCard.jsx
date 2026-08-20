import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Divider, IconButton, Collapse, Switch, FormControlLabel } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PaymentsIcon from '@mui/icons-material/Payments';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import dayjs from 'dayjs';
import ApplicationCard from './ApplicationCard';

import { useDispatch } from 'react-redux';
import { toggleJobStatus } from './../jobManagementSlice';

// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG } from '../../../../utils/colorConstants';

const CARD_MAX_WIDTH = '100%';
const formatDate = (dateString) => (dateString ? dayjs(dateString).format('MMM D, YYYY') : '—');
const formatMoney = (amount) => {
    const num = parseFloat(amount);
    return Number.isNaN(num) ? amount : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const Tag = ({ icon: Icon, text, isGold, isDark }) => (
    <Stack
        direction="row"
        spacing={0.5}
        sx={{
            alignItems: 'center',
            border: '1px solid',
            borderColor: isGold ? (isDark ? GOLD : BROWN_TEXT) : (isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.2)),
            borderRadius: 4,
            px: 1.25,
            py: 0.4,
            color: isGold ? (isDark ? GOLD : '#1A120D') : (isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT),
            bgcolor: isGold ? (isDark ? alpha(GOLD, 0.05) : alpha(BROWN_TEXT, 0.04)) : 'transparent'
        }}
    >
        {Icon && <Icon sx={{ fontSize: 13 }} />}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
            {text || '—'}
        </Typography>
    </Stack>
);

const LogisticsRow = ({ icon: Icon, label, value, isDark, isActive }) => (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', py: 0.9 }}>
        {/* 💡 الأيقونات تصبح باهتة إذا كانت الوظيفة مغلقة */}
        <Icon sx={{ fontSize: 16, color: isActive ? (isDark ? GOLD : BROWN_TEXT) : (isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT), flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.68rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, textTransform: 'uppercase', width: 62, flexShrink: 0, fontWeight: 700 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: isDark ? '#ffffff' : '#1A120D', fontWeight: 700, minWidth: 0, opacity: isActive ? 1 : 0.7 }} noWrap>
            {value || '—'}
        </Typography>
    </Stack>
);

export default function JobOfferCard({ job }) {
    const [expanded, setExpanded] = useState(false);
    const applicationsCount = job.applications?.length || 0;
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const isActive = Boolean(job.is_active);
    const handleToggleStatus = () => dispatch(toggleJobStatus(job.id));

    // 💡 إعداد الألوان الزجاجية للكرت
    const cardBg = isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD;
    const cardBorder = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
    const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.15);
    const textPrimary = isDark ? '#ffffff' : '#1A120D';
    const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT;

    return (
        <Box
            sx={{
                mb: 3,
                maxWidth: CARD_MAX_WIDTH,
                width: '100%',
                border: isActive ? cardBorder : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : alpha(BROWN_TEXT, 0.1)}`,
                borderRadius: 3,
                bgcolor: cardBg,
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
                // 💡 التعديل هنا: إزالة الفلتر المزعج وتقليل الشفافية قليلاً فقط للحفاظ على الوضوح
                opacity: isActive ? 1 : 0.85,
                transition: 'all 0.3s ease-in-out',
                boxShadow: isDark ? '0 18px 40px rgba(0,0,0,0.22)' : '0 8px 32px rgba(0,0,0,0.06)'
            }}
        >
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', lg: 'center' }, mb: 2.5 }}>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                            {/* 💡 تغيير لون العنوان إذا كانت مغلقة */}
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: isActive ? textPrimary : textSecondary, textTransform: 'capitalize', fontWeight: isDark ? 400 : 700 }}>
                                {job.job_title}
                            </Typography>
                            <FormControlLabel
                                control={<Switch checked={isActive} onChange={handleToggleStatus} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? GOLD : BROWN_TEXT }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? GOLD : BROWN_TEXT } }} />}
                                label={<Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? (isDark ? GOLD : '#1A120D') : textSecondary }}>{isActive ? 'Active' : 'Closed'}</Typography>}
                                sx={{ m: 0 }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                            <Tag icon={AccessTimeIcon} text={job.time_condition} isDark={isDark} />
                            <Tag icon={CelebrationIcon} text={job.event_type} isDark={isDark} />
                            <Tag icon={PaymentsIcon} text={job.payment_system} isDark={isDark} />
                            <Tag icon={TrendingUpIcon} text={job.experience_level} isGold={isActive} isDark={isDark} />
                        </Stack>
                    </Box>

                    {/* صندوق التعويضات */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: 'baseline',
                            // 💡 تغيير ألوان صندوق التعويضات لتصبح باهتة عند الإغلاق
                            border: `1px solid ${isActive ? (isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.2)) : dividerColor}`,
                            borderRadius: 2,
                            px: 2,
                            py: 1.25,
                            bgcolor: isActive ? (isDark ? alpha(GOLD, 0.06) : alpha(BROWN_TEXT, 0.04)) : 'transparent',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.7rem', color: textSecondary, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
                            Compensation:
                        </Typography>
                        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: isActive ? (isDark ? GOLD : '#1A120D') : textSecondary, fontWeight: 700 }}>
                            {formatMoney(job.salary)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: textSecondary, fontWeight: 600 }}>
                            / {job.payment_system === 'Hourly' ? 'Hour' : 'Total'}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.68rem', color: textSecondary, textTransform: 'uppercase', mb: 0.5, letterSpacing: 1, fontWeight: 700 }}>
                            Scope &amp; Requirements
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: textPrimary, opacity: isActive ? 0.85 : 0.6, mb: 2, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
                            {job.job_requirements_and_scope || '—'}
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                            <Box sx={{ border: `1px solid ${dividerColor}`, borderRadius: 2, px: 1.5, py: 1, flex: 1, opacity: isActive ? 1 : 0.7 }}>
                                <Typography sx={{ fontSize: '0.62rem', color: textSecondary, textTransform: 'uppercase', fontWeight: 700 }}>Start Date</Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: textPrimary, fontWeight: 700 }}>{formatDate(job.job_start_date)}</Typography>
                            </Box>
                            {/* 💡 صندوق الـ Deadline يتغير لونه عند الإغلاق */}
                            <Box sx={{ border: `1px solid ${isActive ? (isDark ? alpha(GOLD, 0.3) : alpha(BROWN_TEXT, 0.2)) : dividerColor}`, borderRadius: 2, px: 1.5, py: 1, flex: 1, bgcolor: isActive ? (isDark ? alpha(GOLD, 0.06) : alpha(BROWN_TEXT, 0.04)) : 'transparent', opacity: isActive ? 1 : 0.7 }}>
                                <Typography sx={{ fontSize: '0.62rem', color: isActive ? (isDark ? GOLD : BROWN_TEXT) : textSecondary, textTransform: 'uppercase', fontWeight: 800 }}>Deadline</Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: textPrimary, fontWeight: 700 }}>{formatDate(job.application_deadline)}</Typography>
                            </Box>
                            <Box sx={{ border: `1px solid ${dividerColor}`, borderRadius: 2, px: 1.5, py: 1, flex: 1, minWidth: 0, opacity: isActive ? 1 : 0.7 }}>
                                <Typography sx={{ fontSize: '0.62rem', color: textSecondary, textTransform: 'uppercase', mb: 0.5, fontWeight: 700 }}>Contact Info</Typography>
                                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                    <MailOutlinedIcon sx={{ fontSize: 16, color: textSecondary }} />
                                    <Typography sx={{ fontSize: '0.85rem', color: textPrimary, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>{job.contact_info || '—'}</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.03), px: 2, py: 1.5, borderRadius: 2, border: `1px solid ${dividerColor}`, alignSelf: 'flex-start' }}>
                        <Typography sx={{ fontSize: '0.68rem', color: textSecondary, textTransform: 'uppercase', mb: 0.5, letterSpacing: 1, fontWeight: 700 }}>Logistics</Typography>
                        <Stack divider={<Divider sx={{ borderColor: dividerColor }} />}>
                            <LogisticsRow icon={PlaceOutlinedIcon} label="Service" value={job.service?.name || 'General'} isDark={isDark} isActive={isActive} />
                            <LogisticsRow icon={BuildOutlinedIcon} label="Equipment" value={job.company_equipment_provided ? 'Provided' : 'Bring own'} isDark={isDark} isActive={isActive} />
                            <LogisticsRow icon={EventOutlinedIcon} label="Event" value={job.event_type} isDark={isDark} isActive={isActive} />
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ mt: 2.25, mb: 1, borderColor: dividerColor }} />

                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
                    <Stack direction="row" spacing={2.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.62rem', color: textSecondary, opacity: 0.7, fontWeight: 600 }}>ID: {job.id}</Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: textSecondary, opacity: 0.7, fontWeight: 600 }}>Created: {formatDate(job.created_at)}</Typography>
                    </Stack>

                    {isActive && (
                        <IconButton size="small" onClick={() => setExpanded((prev) => !prev)} sx={{ color: isDark ? GOLD : BROWN_TEXT, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
            </Box>

            {isActive && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: isDark ? alpha('#000000', 0.25) : alpha(BROWN_TEXT, 0.03), borderTop: `1px solid ${isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.1)}` }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: textPrimary, fontWeight: isDark ? 400 : 700 }}>
                                    Active Applications ({applicationsCount})
                                </Typography>
                                <Typography sx={{ fontSize: '0.78rem', color: textSecondary, fontWeight: 500 }}>
                                    Reviewing vetted professional talent for the role.
                                </Typography>
                            </Box>
                        </Stack>

                        {applicationsCount > 0 ? (
                            job.applications.map((app) => <ApplicationCard key={app.id} application={app} />)
                        ) : (
                            <Typography sx={{ color: textSecondary, textAlign: 'center', py: 3, fontWeight: 600 }}>
                                No applications received yet.
                            </Typography>
                        )}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}

JobOfferCard.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        job_title: PropTypes.string,
        time_condition: PropTypes.string,
        event_type: PropTypes.string,
        payment_system: PropTypes.string,
        experience_level: PropTypes.string,
        salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        job_requirements_and_scope: PropTypes.string,
        job_start_date: PropTypes.string,
        application_deadline: PropTypes.string,
        contact_info: PropTypes.string,
        company_equipment_provided: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        service: PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string,
        }),
        applications: PropTypes.array,
        is_active: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
    }).isRequired,
};