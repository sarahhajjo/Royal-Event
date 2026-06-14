import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, MenuItem, Select,
    Typography, Divider, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    setJobTitle, setTimeCondition, setEventType,
    setJobStartDate, setApplicationDeadline,
    selectEssentialDetails,
} from '../CreateJobOfferSlice';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
// ── Constants ─────────────────────────────────────────────────────────────────

const TIME_CONDITIONS = ['Permanent', 'Temporary', 'Part-Time', 'Freelance', 'Contract'];
const EVENT_TYPES     = ['Wedding', 'Corporate', 'Birthday', 'Gala', 'Concert', 'Conference', 'Other'];

// ── Component ─────────────────────────────────────────────────────────────────

export default function EssentialDetails() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';

    const { jobTitle, timeCondition, eventType, jobStartDate, applicationDeadline } =
        useSelector(selectEssentialDetails);

    // ── Shared Styles ─────────────────────────────────────────────────────────

    const labelSx = {
        fontSize: '12px',
        fontWeight: 600,
        color: theme.palette.primary.main,
        mb: 0.8,
        display: 'block'
    };

    const inputSx = {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)',
        borderRadius: '6px',
        width: '100%', // 👈 تأكيد العرض الكامل
        '& .MuiOutlinedInput-root': {
            height: '42px',
            '& fieldset': {
                borderColor: isDark ? '#3a2e22' : 'rgba(179, 140, 69, 0.3)',
            },
            '&:hover fieldset': {
                borderColor: isDark ? '#c5a059' : '#b38c45',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? '#c5a059' : '#b38c45',
            },
        },
        '& .MuiInputBase-input': {
            fontSize: '13px',
            color: theme.palette.text.primary,
            padding: '10px 14px',
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.text.secondary,
            fontSize: '20px'
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p:            3,
                mb:           3,
                borderRadius: 2,
                border:       `1px solid ${isDark ? '#261d19' : 'rgba(179, 140, 69, 0.3)'}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            {/* Section Title */}
            {/* Section Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AssignmentOutlinedIcon sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '1.6rem' }} />                <Typography
                    sx={{
                        fontFamily: "'Playfair Display', serif", // نفس خط الـ Header
                        fontSize:   '1.4rem', // تكبير الحجم قليلاً ليتناسب مع الخط
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        letterSpacing: '0.02em',
                    }}
                >
                    Essential Details
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Job Title */}
                <Box>
                    <Typography sx={labelSx}>Job Title</Typography>
                    <TextField
                        placeholder="e.g. Lead Concierge Specialist"
                        value={jobTitle}
                        onChange={(e) => dispatch(setJobTitle(e.target.value))}
                        fullWidth
                        sx={inputSx}
                    />
                </Box>

                {/* 💡 Row 1: Time Condition + Event Type */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}> {/* 👈 flex: 1 تجعل العنصر يأخذ 50% من المساحة بالضبط */}
                        <Typography sx={labelSx}>Time Condition</Typography>
                        <Select
                            value={timeCondition}
                            displayEmpty
                            fullWidth
                            onChange={(e) => dispatch(setTimeCondition(e.target.value))}
                            sx={inputSx}
                        >
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Condition</MenuItem>
                            {TIME_CONDITIONS.map((opt) => (
                                <MenuItem key={opt} value={opt} sx={{ fontSize: '13px' }}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Event Type</Typography>
                        <Select
                            value={eventType}
                            displayEmpty
                            fullWidth
                            onChange={(e) => dispatch(setEventType(e.target.value))}
                            sx={inputSx}
                        >
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Event Type</MenuItem>
                            {EVENT_TYPES.map((opt) => (
                                <MenuItem key={opt} value={opt} sx={{ fontSize: '13px' }}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>

                {/* 💡 Row 2: Dates */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Job Start Date</Typography>
                        <TextField
                            type="date"
                            value={jobStartDate}
                            onChange={(e) => dispatch(setJobStartDate(e.target.value))}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Application Deadline</Typography>
                        <TextField
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => dispatch(setApplicationDeadline(e.target.value))}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}