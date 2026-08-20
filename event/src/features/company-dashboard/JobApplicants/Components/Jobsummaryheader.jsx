import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import dayjs from 'dayjs';

import { GOLD, BROWN_TEXT, MUTED_TEXT } from '../../../../utils/colorConstants';

const formatDate = (d) => (d ? dayjs(d).format('MMM D, YYYY') : '—');
const formatMoney = (amount) => {
    const num = parseFloat(amount);
    return Number.isNaN(num) ? amount ?? '—' : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const InfoItem = ({ icon: Icon, label, value, isDark }) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{
            display: 'flex', p: 0.5, borderRadius: 1.5,
            bgcolor: isDark ? alpha(GOLD, 0.1) : alpha(BROWN_TEXT, 0.08)
        }}>
            <Icon sx={{ fontSize: 16, color: isDark ? GOLD : BROWN_TEXT }} />
        </Box>
        <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontWeight: 600 }}>
            {label}:
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#ffffff' : '#1A120D', fontWeight: 800 }}>
            {value}
        </Typography>
    </Stack>
);
InfoItem.propTypes = { icon: PropTypes.elementType.isRequired, label: PropTypes.node, value: PropTypes.node, isDark: PropTypes.bool };

const JobSummaryHeader = ({ job, count = 0 }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        // 💡 الحل الجذري: قللنا الإزاحة هنا من (-5) إلى (-2) لسحب السطر بالكامل لليمين
        <Box sx={{ mb: 2.5, mt: 0.5, ml: -1, maxWidth: '980px' }}>

            {/* 💡 أضفنا spacing={2.5} لضمان مسافة ممتازة ومريحة بين المعين والنص */}
            <Stack direction="row" alignItems="center" spacing={2.5} flexWrap="nowrap" mb={1.5}>

                <Box
                    component="svg"
                    viewBox="0 0 24 24"
                    sx={{
                        width: '24px',
                        height: '24px',
                        fill: 'none',
                        stroke: isDark ? '#ffffff' : BROWN_TEXT,
                        strokeWidth: 2,
                        display: 'flex',
                        flexShrink: 0,


                    }}
                >
                    <path d="M12 2.5L21.5 12L12 21.5L2.5 12Z" />
                </Box>

                <Typography
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        color: isDark ? '#ffffff' : '#1A120D',
                        textTransform: 'capitalize',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        height: 28,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {job?.job_title || 'Job Overview'}
                </Typography>

                <Chip
                    icon={<GroupsOutlinedIcon sx={{ fontSize: 15, color: isDark ? `${GOLD} !important` : `${BROWN_TEXT} !important` }} />}
                    label={`${count} ${count === 1 ? 'hire' : 'hires'}`}
                    size="small"
                    sx={{
                        fontWeight: 700, fontSize: '0.75rem',
                        bgcolor: isDark ? alpha(GOLD, 0.12) : alpha(BROWN_TEXT, 0.06),
                        color: isDark ? '#ffffff' : '#1A120D',
                        border: isDark ? 'none' : `1px solid ${alpha(BROWN_TEXT, 0.2)}`,
                        flexShrink: 0, transform: 'translateY(7px)',
                    }}
                />

                <Box sx={{ flexGrow: 1, height: '1px', bgcolor: isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3), transform: 'translateY(20px)' }} />
            </Stack>

            {/* 💡 عدلنا الـ ml هنا لتبقى العناصر السفلية (الميزانية والوقت) محاذية بشكل جميل مع النص */}
            <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', rowGap: 1.5, px: 1, mb: 1, ml: 4, mt: 3 }}>
                <InfoItem icon={PaymentsIcon} label="Budget" value={formatMoney(job?.salary)} isDark={isDark} />
                <InfoItem icon={AccessTimeIcon} label="Role Type" value={job?.time_condition || '—'} isDark={isDark} />
                <InfoItem icon={EventBusyOutlinedIcon} label="Deadline" value={formatDate(job?.application_deadline)} isDark={isDark} />
            </Stack>
        </Box>
    );
};

JobSummaryHeader.propTypes = {
    job: PropTypes.shape({
        job_title: PropTypes.string,
        salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        time_condition: PropTypes.string,
        application_deadline: PropTypes.string,
    }),
    count: PropTypes.number,
};

export default JobSummaryHeader;