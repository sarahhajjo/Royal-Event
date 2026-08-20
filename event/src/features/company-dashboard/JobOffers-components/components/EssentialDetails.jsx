import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, MenuItem, Select,
    Typography, Divider, Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    fetchJobServices, setServiceId,
    setJobTitle, setTimeCondition, setEventType,
    setJobStartDate, setApplicationDeadline,
    selectEssentialDetails,
} from '../CreateJobOfferSlice';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

// 💡 استيراد ثوابت الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../utils/colorConstants';

const TIME_CONDITIONS = ['Permanent', 'Temporary', 'Contract'];

export default function EssentialDetails() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';

    const {
        serviceId, servicesList, jobTitle, timeCondition,
        eventType, jobStartDate, applicationDeadline
    } = useSelector(selectEssentialDetails);

    useEffect(() => {
        dispatch(fetchJobServices());
    }, [dispatch]);

    const labelSx = {
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 0.8, display: 'block', letterSpacing: '0.05em'
    };

    const inputSx = {
        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
        borderRadius: '6px', width: '100%',
        backdropFilter: 'blur(4px)',
        '& .MuiOutlinedInput-root': {
            height: '42px',
            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER },
            '&:hover fieldset': { borderColor: GOLD },
            '&.Mui-focused fieldset': { borderColor: GOLD },
        },
        '& .MuiInputBase-input': { fontSize: '13px', color: isDark ? '#ffffff' : '#1A120D', padding: '10px 14px' },
        '& .MuiSvgIcon-root': { color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '20px' }
    };

    return (
        <Paper elevation={0} sx={{
            p: 3, mb: 3, borderRadius: 3,
            bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AssignmentOutlinedIcon sx={{ color: isDark ? GOLD : BROWN_TEXT, fontSize: '1.6rem' }} />
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: isDark ? '#ffffff' : '#1A120D', letterSpacing: '0.02em' }}>
                    Essential Details
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Linked Service</Typography>
                        <Select value={serviceId} displayEmpty fullWidth onChange={(e) => dispatch(setServiceId(e.target.value))} sx={inputSx}>
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Related Service</MenuItem>
                            {servicesList?.map((srv) => (
                                <MenuItem key={srv.id} value={srv.id} sx={{ fontSize: '13px' }}>{srv.name}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Job Title</Typography>
                        <TextField placeholder="e.g. Lead Concierge Specialist" value={jobTitle} onChange={(e) => dispatch(setJobTitle(e.target.value))} fullWidth sx={inputSx} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Time Condition</Typography>
                        <Select value={timeCondition} displayEmpty fullWidth onChange={(e) => dispatch(setTimeCondition(e.target.value))} sx={inputSx}>
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Condition</MenuItem>
                            {TIME_CONDITIONS.map((opt) => (
                                <MenuItem key={opt} value={opt} sx={{ fontSize: '13px' }}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Event Type</Typography>
                        <TextField
                            placeholder="e.g. Wedding, Corporate, Conference..."
                            value={eventType}
                            onChange={(e) => dispatch(setEventType(e.target.value))}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Job Start Date</Typography>
                        <TextField type="date" value={jobStartDate} onChange={(e) => dispatch(setJobStartDate(e.target.value))} fullWidth sx={inputSx} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Application Deadline</Typography>
                        <TextField type="date" value={applicationDeadline} onChange={(e) => dispatch(setApplicationDeadline(e.target.value))} fullWidth sx={inputSx} />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}