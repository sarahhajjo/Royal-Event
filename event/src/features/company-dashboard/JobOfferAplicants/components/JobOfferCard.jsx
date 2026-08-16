import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Divider, IconButton, Collapse, Switch, FormControlLabel } from '@mui/material';
import { alpha } from '@mui/material/styles';
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

// 💡 استيراد الـ Redux
import { useDispatch } from 'react-redux';
import { toggleJobStatus } from './../jobManagementSlice'; // تأكدي من المسار

const CARD_MAX_WIDTH = '100%';

const formatDate = (dateString) => (dateString ? dayjs(dateString).format('MMM D, YYYY') : '—');
const formatMoney = (amount) => {
    const num = parseFloat(amount);
    return Number.isNaN(num) ? amount : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

// حبّة (pill) للوسوم أعلى الكرت
const Tag = ({ icon: Icon, text, isGold }) => (
    <Stack
        direction="row"
        spacing={0.5}
        sx={{
            alignItems: 'center',
            border: '1px solid',
            borderColor: isGold ? 'primary.main' : 'divider',
            borderRadius: 4,
            px: 1.25,
            py: 0.4,
            color: isGold ? 'primary.main' : 'text.secondary',
        }}
    >
        {Icon && <Icon sx={{ fontSize: 13 }} />}
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}>
            {text || '—'}
        </Typography>
    </Stack>
);
Tag.propTypes = { icon: PropTypes.elementType, text: PropTypes.node, isGold: PropTypes.bool };

// صف مضغوط داخل صندوق Logistics
const LogisticsRow = ({ icon: Icon, label, value }) => (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', py: 0.9 }}>
        <Icon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', textTransform: 'uppercase', width: 62, flexShrink: 0 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: 'text.primary', fontWeight: 600, minWidth: 0 }} noWrap>
            {value || '—'}
        </Typography>
    </Stack>
);
LogisticsRow.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.node,
    value: PropTypes.node,
};

export default function JobOfferCard({ job }) {
    const [expanded, setExpanded] = useState(false);
    const applicationsCount = job.applications?.length || 0;

    // تعريف الـ dispatch
    const dispatch = useDispatch();

    // 💡 إنشاء متغير يقرأ حالة الوظيفة لسهولة الاستخدام
    const isActive = Boolean(job.is_active);

    const handleToggleStatus = () => {
        dispatch(toggleJobStatus(job.id));
    };

    return (
        <Box
            sx={{
                mb: 3,
                maxWidth: CARD_MAX_WIDTH,
                width: '100%',
                border: '1px solid',
                // 💡 تغيير لون الحدود ليكون رمادياً باهتاً إذا كانت الوظيفة مغلقة
                borderColor: (theme) => isActive ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.secondary, 0.2),
                borderRadius: 3,
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? alpha('#ffffff', 0.035) : alpha('#000000', 0.02),
                overflow: 'hidden',

                // 💡 التعديلات السحرية هنا:
                // 1. تقليل الشفافية إلى 55% إذا كانت الوظيفة مغلقة
                opacity: isActive ? 1 : 0.55,
                // 2. تحويل الألوان إلى درجات الرمادي بنسبة 80% لزيادة الإيحاء بالإغلاق
                filter: isActive ? 'none' : 'grayscale(80%)',
                // 3. إضافة حركة ناعمة جداً عند التبديل
                transition: 'all 0.3s ease-in-out',
            }}
        >
            {/* ── تفاصيل الوظيفة ── */}
            <Box sx={{ p: { xs: 2, md: 2.5 } }}>

                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', lg: 'center' }, mb: 2.5 }}
                >
                    <Box>
                        {/* 💡 عنوان الوظيفة مع زر الـ Toggle بجانبه */}
                        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                            <Typography
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.5rem',
                                    color: 'text.primary',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {job.job_title}
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isActive}
                                        onChange={handleToggleStatus}
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: isActive ? 'primary.main' : 'text.secondary' }}>
                                        {isActive ? 'Active' : 'Closed'}
                                    </Typography>
                                }
                                sx={{ m: 0 }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                            <Tag icon={AccessTimeIcon} text={job.time_condition} />
                            <Tag icon={CelebrationIcon} text={job.event_type} />
                            <Tag icon={PaymentsIcon} text={job.payment_system} />
                            <Tag icon={TrendingUpIcon} text={job.experience_level} isGold={isActive} /> {/* إزالة اللون الذهبي للتاج إذا كانت مغلقة اختياري */}
                        </Stack>
                    </Box>

                    {/* صندوق التعويضات (Compensation) الأفقي */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            alignItems: 'baseline',
                            border: '1px solid',
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
                            borderRadius: 2,
                            px: 2,
                            py: 1.25,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                        }}
                    >
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase' }}>
                            Compensation:
                        </Typography>
                        <Typography
                            sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: 'primary.main', fontWeight: 'bold' }}
                        >
                            {formatMoney(job.salary)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                            / {job.payment_system === 'Hourly' ? 'Hour' : 'Total'}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', textTransform: 'uppercase', mb: 0.5, letterSpacing: 1 }}>
                            Scope &amp; Requirements
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.85rem',
                                color: 'text.primary',
                                opacity: 0.85,
                                mb: 2,
                                lineHeight: 1.55,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {job.job_requirements_and_scope || '—'}
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                            {/* صندوق تاريخ البدء */}
                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1.5, py: 1, flex: 1 }}>
                                <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Start Date
                                </Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 600 }}>
                                    {formatDate(job.job_start_date)}
                                </Typography>
                            </Box>

                            {/* صندوق الموعد النهائي */}
                            <Box
                                sx={{
                                    border: '1px solid',
                                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 1,
                                    flex: 1,
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                                }}
                            >
                                <Typography sx={{ fontSize: '0.62rem', color: 'primary.main', textTransform: 'uppercase' }}>
                                    Deadline
                                </Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 600 }}>
                                    {formatDate(job.application_deadline)}
                                </Typography>
                            </Box>

                            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1.5, py: 1, flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', textTransform: 'uppercase', mb: 0.5 }}>
                                    Contact Info
                                </Typography>
                                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                    <MailOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>
                                        {job.contact_info || '—'}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            width: { xs: '100%', md: 280 },
                            flexShrink: 0,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? alpha('#ffffff', 0.03) : alpha('#000000', 0.02),
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', textTransform: 'uppercase', mb: 0.5, letterSpacing: 1 }}>
                            Logistics
                        </Typography>

                        <Stack divider={<Divider sx={{ borderColor: 'divider' }} />}>
                            <LogisticsRow icon={PlaceOutlinedIcon} label="Service" value={job.service?.name || 'General'} />
                            <LogisticsRow
                                icon={BuildOutlinedIcon}
                                label="Equipment"
                                value={job.company_equipment_provided ? 'Provided' : 'Bring own'}
                            />
                            <LogisticsRow icon={EventOutlinedIcon} label="Event" value={job.event_type} />
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ mt: 2.25, mb: 1, borderColor: 'divider' }} />

                {/* شريط تذييل الكرت + سهم الإظهار/الإخفاء */}
                <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
                >
                    <Stack direction="row" spacing={2.5} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', opacity: 0.7 }}>
                            ID: {job.id}
                        </Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', opacity: 0.7 }}>
                            Created: {formatDate(job.created_at)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', opacity: 0.7 }}>
                            Updated: {formatDate(job.updated_at)}
                        </Typography>
                    </Stack>

                    {/* إخفاء زر التوسعة إذا كانت الوظيفة مغلقة */}
                    {isActive && (
                        <IconButton
                            size="small"
                            onClick={() => setExpanded((prev) => !prev)}
                            aria-label={expanded ? 'إخفاء المتقدمين' : 'إظهار المتقدمين'}
                            sx={{
                                color: 'primary.main',
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.25s ease',
                            }}
                        >
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
            </Box>

            {/* ── قسم المتقدمين (قابل للطي) ── */}
            {isActive && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box
                        sx={{
                            p: { xs: 2, md: 2.5 },
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? alpha('#000000', 0.25) : alpha('#000000', 0.02),
                            borderTop: '1px solid',
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.15),
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
                        >
                            <Box>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'text.primary' }}>
                                    Active Applications ({applicationsCount})
                                </Typography>
                                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                    Reviewing vetted professional talent for the role.
                                </Typography>
                            </Box>
                        </Stack>

                        {applicationsCount > 0 ? (
                            job.applications.map((app) => <ApplicationCard key={app.id} application={app} />)
                        ) : (
                            <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
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
    }).isRequired,
};