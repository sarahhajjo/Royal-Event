import React, { useState, useMemo } from 'react';
import { Box, Typography, Divider, Paper, Button, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeIcon   from '@mui/icons-material/AccessTimeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// 💡 استيراد ثوابت الألوان الفاخرة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../../utils/colorConstants';

function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

export default function AvailabilityCalendar({ availabilities = [], onBookSlot }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const availabilityMap = useMemo(() => {
        const map = {};
        availabilities.forEach(avail => {
            if (!avail.is_blocked) {
                const dateStr = dayjs(avail.available_date).format('YYYY-MM-DD');

                const slots = (avail.slots || []).map(s => {
                    const formatTime = (timeString) => {
                        if (!timeString) return '';
                        if (timeString.includes('T')) {
                            return dayjs(timeString).format('hh:mm A');
                        }
                        return dayjs(`2000-01-01T${timeString}`).format('hh:mm A');
                    };

                    const start = formatTime(s.start_time);
                    const end = formatTime(s.end_time);

                    return `${start} - ${end}`;
                });

                map[dateStr] = slots;
            }
        });
        return map;
    }, [availabilities]);

    const handleDateChange = (newDate) => {
        const dateStr = newDate.format('YYYY-MM-DD');
        if (availabilityMap[dateStr]) {
            setSelectedDate(newDate);
            setSelectedSlot(null);
        }
    };

    const selectedDateStr = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
    const currentDaySlots = selectedDateStr ? (availabilityMap[selectedDateStr] || []) : [];
    const formattedDisplayDate = selectedDate ? selectedDate.format('dddd, MMMM D, YYYY') : '';

    const CustomPickersDay = (props) => {
        const { day, outsideCurrentMonth, ...other } = props;
        const dateStr = day.format('YYYY-MM-DD');
        const isAvailable = !!availabilityMap[dateStr];
        const isSelected = selectedDateStr === dateStr;

        return (
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <PickerDay
                    {...other}
                    outsideCurrentMonth={outsideCurrentMonth}
                    day={day}
                    disabled={!isAvailable}
                    sx={{
                        margin: '2px',
                        width: 'auto',
                        aspectRatio: '1/1',
                        height: 30,
                        fontSize: '1rem',
                        color: isAvailable ? (isDark ? '#ffffff' : '#1A120D') : (isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.3)),
                        fontWeight: isAvailable ? 700 : 500,

                        // الأيام المتاحة
                        ...(isAvailable && !isSelected && {
                            color: isDark ? '#ffffff' : '#1A120D',
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.08),
                                color: isDark ? GOLD : BROWN_TEXT,
                            }
                        }),

                        // اليوم المختار (Selected)
                        ...(isSelected && {
                            backgroundColor: `${GOLD} !important`,
                            color: '#140e0c !important',
                            fontWeight: 800,
                            boxShadow: `0 4px 12px ${alpha(GOLD, 0.3)}`
                        }),

                        // اليوم الحالي (Today)
                        '&.MuiPickersDay-today': {
                            border: `1px solid ${isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3)}`,
                        },
                        opacity: 1,
                        '&.Mui-disabled': {
                            opacity: 1,
                            pointerEvents: 'none',
                            color: isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.3),
                        },
                        '&.MuiPickersDay-root': {
                            border: isSelected ? 'none' : undefined,
                        }
                    }}
                />
                {isAvailable && !isSelected && (
                    <Box sx={{ position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: '50%', backgroundColor: GOLD }} />
                )}
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper
                elevation={0}
                sx={{
                    bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                    border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                    backdropFilter: 'blur(12px)',
                    borderRadius: 3,
                    p: { xs: 2.5, sm: 3 },
                    mb: 2
                }}
            >
                <SectionHeader icon={CalendarMonthOutlinedIcon} title="Availability & Booking" />
                <Divider sx={{ mb: 3, borderColor }} />

                <Grid container spacing={4} alignItems="stretch">

                    {/* ── 1. القسم الأيسر: الروزنامة ── */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', width: 500 }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            '& .MuiDateCalendar-root': {
                                width: '100%',
                                maxWidth: 500,
                                height: 'auto',
                                bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                                border: `1px solid ${borderColor}`,
                                borderRadius: 3,
                                backdropFilter: 'blur(4px)',
                                p: 2
                            },
                            '& .MuiPickersCalendarHeader-root': {
                                width: '100%',
                                maxWidth: 450,
                                margin: '0 auto',
                                paddingLeft: 0,
                                paddingRight: 0,
                                color: isDark ? '#ffffff' : '#1A120D',
                            },
                            // ألوان الأسهم وأيام الأسبوع
                            '& .MuiIconButton-root': { color: isDark ? GOLD : BROWN_TEXT },
                            '& .MuiDayCalendar-weekDayLabel': { color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontWeight: 700 },
                            '& .MuiDayCalendar-header': {
                                justifyContent: 'space-around',
                                width: '100%',
                                maxWidth: 450,
                                margin: '0 auto'
                            },
                            '& .MuiDayCalendar-weekContainer': {
                                justifyContent: 'space-around',
                                width: '100%',
                                maxWidth: 450,
                                margin: '0 auto'
                            },
                            '& .MuiPickersDay-root': {
                                width: 45,
                                height: 45,
                                fontSize: '1rem'
                            }
                        }}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                slots={{ day: CustomPickersDay }}
                                disablePast
                            />
                        </Box>
                    </Grid>

                    {/* ── 2. القسم الأيمن: الشفتات المتاحة ── */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: '100%', display: 'flex', width: 400, maxWidth: 400, mx: 'auto', flexDirection: 'column', p: { xs: 3, sm: 4 }, borderRadius: 3,
                                bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                                border: `1px solid ${borderColor}`,
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            {selectedDate && currentDaySlots.length > 0 ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                                        <AccessTimeIcon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontWeight: 700 }}>
                                                Available Shifts For
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: isDark ? '#ffffff' : '#1A120D' }}>
                                                {formattedDisplayDate}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 'auto' }}>
                                        {currentDaySlots.map((slot, index) => {
                                            const isSlotSelected = selectedSlot === slot;
                                            return (
                                                <Box
                                                    key={index}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    sx={{
                                                        px: 3, py: 2, borderRadius: 2, width: '100%',
                                                        bgcolor: isSlotSelected ? (isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.08)) : 'transparent',
                                                        border: `1px solid ${isSlotSelected ? GOLD : borderColor}`,
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                                        '&:hover': { borderColor: GOLD }
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: isSlotSelected ? 800 : 600, color: isSlotSelected ? (isDark ? GOLD : '#1A120D') : (isDark ? 'rgba(255,255,255,0.8)' : '#1A120D') }}>
                                                        {slot}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>

                                    <Button
                                        fullWidth size="large" disabled={!selectedSlot}
                                        onClick={() => onBookSlot?.({
                                            day: selectedDate.date(),
                                            month: selectedDate.month(),
                                            year: selectedDate.year(),
                                            slot: selectedSlot
                                        })}
                                        sx={{
                                            mt: 5, bgcolor: GOLD, color: '#1A120D', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, borderRadius: 2,
                                            '&:hover': { bgcolor: '#d4ae6a' },
                                            '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : alpha(BROWN_TEXT, 0.05), color: isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.3) }
                                        }}
                                    >
                                        Confirm Slot Selection
                                    </Button>
                                </>
                            ) : (
                                <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.8 }}>
                                    <EventAvailableOutlinedIcon sx={{ fontSize: 40, color: isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT, mb: 1 }} />
                                    <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, px: 2, fontWeight: 500 }}>
                                        Select an available date from the calendar to view and book shifts.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                </Grid>
            </Paper>
        </LocalizationProvider>
    );
}