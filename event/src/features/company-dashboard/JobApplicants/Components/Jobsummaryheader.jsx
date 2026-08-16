import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import dayjs from 'dayjs';

const formatDate = (d) => (d ? dayjs(d).format('MMM D, YYYY') : '—');
const formatMoney = (amount) => {
    const num = parseFloat(amount);
    return Number.isNaN(num) ? amount ?? '—' : num.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box sx={{
            display: 'flex', p: 0.5, borderRadius: 1.5,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
        }}>
            <Icon sx={{ fontSize: 16, color: 'primary.main' }} />
        </Box>
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{label}:</Typography>
        <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 700 }}>{value}</Typography>
    </Stack>
);
InfoItem.propTypes = { icon: PropTypes.elementType.isRequired, label: PropTypes.node, value: PropTypes.node };

const JobSummaryHeader = ({ job, count = 0 }) => (
    // 💡 تم تقليل الـ mt من 3 إلى 0.5 لرفع العنصر بالكامل للأعلى
    <Box sx={{ mb: 2.5, mt: 0.5,ml:-5, maxWidth: '980px' }}>

        <Stack direction="row" alignItems="center" spacing={2} flexWrap="nowrap" mb={1.5}>

            <Box
                component="svg"
                viewBox="0 0 24 24"
                sx={{
                    width: '24px',
                    height: '24px',
                    fill: 'none',
                    // 💡 تم تغيير اللون ليطابق لون عنوان الوظيفة (text.primary)
                    stroke: 'text.primary',
                    strokeWidth: 1.5,
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
                    color: 'text.primary',
                    textTransform: 'capitalize',
                    fontWeight: 50,
                    letterSpacing: '0.02em',
                    height:50,
                    whiteSpace: 'nowrap',

                }}
            >
                {job?.job_title || 'Job Overview'}
            </Typography>

            <Chip
                icon={<GroupsOutlinedIcon sx={{ fontSize: 15, color: 'primary.main !important' }} />}
                label={`${count} ${count === 1 ? 'hire' : 'hires'}`}
                size="small"
                sx={{
                    fontWeight: 600, fontSize: '0.75rem',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: 'text.primary', border: 'none', flexShrink: 0 ,transform: 'translateY(10px)'
                }}
            />

            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5) ,transform: 'translateY(22px)' }} />
        </Stack>

        <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', rowGap: 1.5, px: 1, mb: 1 , ml:5 }}>
            <InfoItem icon={PaymentsIcon} label="Budget" value={formatMoney(job?.salary)} />
            <InfoItem icon={AccessTimeIcon} label="Role Type" value={job?.time_condition || '—'} />
            <InfoItem icon={EventBusyOutlinedIcon} label="Deadline" value={formatDate(job?.application_deadline)} />
        </Stack>
    </Box>
);

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