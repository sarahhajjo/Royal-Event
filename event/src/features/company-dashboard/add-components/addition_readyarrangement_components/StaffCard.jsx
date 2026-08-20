import React, { useState } from 'react';
import { Box, Typography, Avatar, useTheme, Popover, Divider, alpha, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import dayjs from 'dayjs';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';
const StaffCard = ({ name, role, phone, email, isSelected, isAvailable, availableDates, blockedDates }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [anchorEl, setAnchorEl] = useState(null);
    const [viewDate, setViewDate] = useState(dayjs());

    let ContactIcon = PhoneIcon;
    let contactText = 'Not Provided';

    if (phone && phone !== 'Not Provided' && phone !== 'No contact info') {
        ContactIcon = PhoneIcon;
        contactText = phone;
    } else if (email) {
        ContactIcon = MailOutlinedIcon;
        contactText = email;
    }

    const handleOpenCalendar = (event) => {
        setAnchorEl(event.currentTarget);
        if (blockedDates && blockedDates.length > 0) {
            setViewDate(dayjs(blockedDates[0].blocked_date));
        } else {
            setViewDate(dayjs());
        }
    };

    const handleCloseCalendar = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const date = new Date();
        date.setHours(h, m);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const renderCustomDay = (dayProps) => {
        const { day, outsideCurrentMonth, ...other } = dayProps;
        if (outsideCurrentMonth) return <PickerDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />;

        const dateStr = day.format('YYYY-MM-DD');
        const isSelectedDay = viewDate.format('YYYY-MM-DD') === dateStr;
        const dayBlocks = blockedDates?.filter(b => dayjs(b.blocked_date).format('YYYY-MM-DD') === dateStr);
        const isBlocked = dayBlocks && dayBlocks.length > 0;

        return (
            <PickerDay
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                {...other}
                sx={{
                    ...(isSelectedDay && {
                        backgroundColor: GOLD,
                        color: '#131110',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#b38c45' },
                    }),
                    ...(!isSelectedDay && isBlocked && {
                        backgroundColor: isDark ? alpha('#ef5350', 0.15) : alpha('#ef5350', 0.1),
                        color: isDark ? '#ef5350' : '#d32f2f',
                        fontWeight: 600,
                        border: `1px solid ${isDark ? alpha('#ef5350', 0.3) : alpha('#d32f2f', 0.3)}`,
                        '&:hover': {
                            backgroundColor: isDark ? alpha('#ef5350', 0.25) : alpha('#ef5350', 0.2),
                        }
                    }),
                    ...(!isSelectedDay && !isBlocked && {
                        '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }
                    })
                }}
            />
        );
    };

    const selectedDateStr = viewDate.format('YYYY-MM-DD');
    const selectedDayBlocks = blockedDates?.filter(b => dayjs(b.blocked_date).format('YYYY-MM-DD') === selectedDateStr);

    return (
        <>
            <Box sx={{
                width: 250,
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isSelected ? `2px solid ${GOLD}` : (isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`),
                borderRadius: 2, p: 1.5, position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.5,
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 8px 24px rgba(130, 100, 40, 0.10)',
                backdropFilter: 'blur(16px)',
                opacity: isAvailable ? 1 : 0.6, transition: 'all 0.3s ease'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: isDark ? 'rgba(197, 160, 89, 0.18)' : 'rgba(197, 160, 89, 0.15)', color: GOLD, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, fontWeight: 'bold' }}>
                        {name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography noWrap sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>{name}</Typography>
                        <Typography noWrap sx={{ color: GOLD, fontSize: '0.75rem' }}>{role}</Typography>
                    </Box>
                    {isSelected && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: GOLD, color: '#131110', fontSize: '0.6rem', fontWeight: 'bold', px: 0.8, py: 0.2, borderRadius: 1 }}>
                            SELECTED
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: isDark ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary, mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ContactIcon sx={{ fontSize: '1.1rem', opacity: 0.8 }} />
                        <Typography noWrap sx={{ fontSize: '0.8rem', opacity: contactText === 'Not Provided' ? 0.6 : 1 }}>{contactText}</Typography>
                    </Box>
                    {availableDates && (
                        <Box onClick={handleOpenCalendar} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 0.5, ml: -0.5, borderRadius: 1, cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                            <CalendarTodayIcon sx={{ fontSize: '1.1rem', mt: 0.2, opacity: 0.8, color: GOLD }} />
                            <Box>
                                <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.02em', lineHeight: 1.4, color: GOLD, fontWeight: 'bold' }}>{availableDates}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: isDark ? 'rgba(255,255,255,0.5)' : theme.palette.text.secondary, mt: 0.2 }}>Click to view schedule</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                    <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: isAvailable ? '#4caf50' : '#ef5350' }} />
                    <Typography sx={{ color: isAvailable ? '#4caf50' : '#ef5350', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        {isAvailable ? 'AVAILABLE' : 'TIME CONFLICT'}
                    </Typography>
                </Box>
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseCalendar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    sx: {
                        width: 330,
                        background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                        borderRadius: 3,
                        mt: 1,
                        backdropFilter: 'blur(16px)',
                        boxShadow: isDark ? DARK_CARD_SHADOW : '0 8px 32px rgba(130, 100, 40, 0.15)',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventBusyIcon sx={{ color: GOLD, fontSize: '1.2rem' }} />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: GOLD, fontFamily: "'Playfair Display', serif" }}>
                        Blocked Schedule
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : LIGHT_BORDER }} />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', '& .MuiPickersCalendarHeader-root': { mt: 1, mb: 0 } }}>
                        <DateCalendar
                            value={viewDate}
                            onChange={(newValue) => setViewDate(newValue)}
                            slots={{ day: renderCustomDay }}
                            sx={{ width: '100%', maxHeight: 300, '& .MuiTypography-root': { color: isDark ? '#ffffff' : BROWN_TEXT } }}
                        />
                    </Box>
                </LocalizationProvider>

                <Box sx={{ background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, p: 2, borderTop: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 1.5 }}>
                        {viewDate.format('dddd, MMMM DD, YYYY')}
                    </Typography>

                    {selectedDayBlocks && selectedDayBlocks.length > 0 ? (
                        <Stack spacing={1.5}>
                            {selectedDayBlocks.map((b, i) => (
                                <Box key={i} sx={{
                                    borderLeft: `3px solid ${isDark ? '#ef5350' : '#d32f2f'}`,
                                    pl: 1.5,
                                    py: 0.5
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                        <AccessTimeIcon sx={{ fontSize: '0.9rem', color: isDark ? '#ef5350' : '#d32f2f' }} />
                                        <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#ef5350' : '#d32f2f', fontWeight: 600 }}>
                                            {b.start_time ? `${formatTime(b.start_time)} - ${formatTime(b.end_time)}` : 'All Day Blocked'}
                                        </Typography>
                                    </Box>

                                    {b.note && (
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8, mt: 0.8 }}>
                                            <NoteAltOutlinedIcon sx={{ fontSize: '0.9rem', color: isDark ? 'rgba(255,255,255,0.6)' : theme.palette.text.secondary, mt: '2px' }} />
                                            <Typography sx={{ fontSize: '0.75rem', color: isDark ? 'rgba(255,255,255,0.6)' : theme.palette.text.secondary, fontStyle: 'italic', lineHeight: 1.4 }}>
                                                "{b.note}"
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 2, bgcolor: isDark ? alpha('#4caf50', 0.1) : '#edf7ed' }}>
                            <CheckCircleOutlinedIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                            <Box>
                                <Typography sx={{ fontSize: '0.8rem', color: '#4caf50', fontWeight: 'bold' }}>
                                    Available
                                </Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: isDark ? 'rgba(255,255,255,0.6)' : theme.palette.text.secondary }}>
                                    No blocked hours recorded.
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default StaffCard;