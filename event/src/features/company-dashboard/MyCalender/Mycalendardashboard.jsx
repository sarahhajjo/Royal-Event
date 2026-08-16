import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, IconButton, Stack, Paper, Grid,
    TextField, Switch, FormControlLabel, Alert, Chip, Popover, CircularProgress
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
// 💡 تأكدي من استيراد deleteBlockedDate من السلايس
import { fetchBlockedDates, blockDate, deleteBlockedDate, clearMessages } from './MyCalendarSlice';

// --- Data Constants ---
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'Am' : 'Pm';
    return `${hour12} ${period}`;
});

const colors = {
    bgMain: '#140e0c',
    bgCard: '#1c1512',
    gold: '#c5a059',
    goldHover: '#d4b06a',
    textSecondary: '#9a8f80',
    textMuted: '#c9c0b3',
    border: 'rgba(255, 255, 255, 0.05)',
};

const playfairFont = { fontFamily: "'Playfair Display', serif" };

// ─── دوال مساعدة لحساب وعرض الوقت ───
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// ─── 💡 مكون عرض الكرت ───
function EventCard({ event, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = (e) => {
        if (e) e.stopPropagation();
        setAnchorEl(null);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();

        // 1. إغلاق النافذة
        handleClose();

        // 2. تأخير الحذف 300 ملي ثانية لضمان انتهاء أنيميشن إغلاق النافذة وتجنب أخطاء الرياكت
        setTimeout(() => {
            if (event.id && typeof onDelete === 'function') {
                onDelete(event.id);
            } else {
                console.log("هذا حجز تجريبي (وهمي) ولا يمكن حذفه فعلياً من قاعدة البيانات.");
            }
        }, 300);
    };

    const timeDisplay = event.start_time && event.end_time
        ? `${formatDisplayTime(event.start_time)} - ${formatDisplayTime(event.end_time)}`
        : 'All Day';

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    bgcolor: open ? 'rgba(5, 150, 105, 0.8)' : 'rgba(6, 78, 59, 0.9)',
                    border: open ? `1px solid ${colors.gold}` : '1px solid rgba(5, 150, 105, 0.4)',
                    boxShadow: open ? `0 0 10px rgba(197, 160, 89, 0.5)` : 'none',
                    cursor: 'pointer',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    width: '100%',
                    maxWidth: 110,
                    flexShrink: 0,
                    mb: 0.5,
                    transition: 'all 0.3s ease',
                    userSelect: 'none',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#ecfdf5', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {event.note || 'Blocked Time'}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: 'rgba(167, 243, 208, 0.8)', lineHeight: 1.2, mt: 0.5, whiteSpace: 'nowrap' }}>
                    {timeDisplay}
                </Typography>
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: { bgcolor: colors.bgCard, border: `1px solid ${colors.gold}`, borderRadius: 2, ml: 1, p: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }
                    }
                }}
                // 💡 أزلنا disablePortal لكي تظهر القائمة فوق كل شيء ولا تقص بسبب الـ overflow
            >
                <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlinedIcon fontSize="small" />}
                    onClick={handleDeleteClick}
                    sx={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'none' }}
                >
                    Remove Block
                </Button>
            </Popover>
        </>
    );
}

export default function MyCalendarDashboard() {
    const dispatch = useDispatch();
    const { loading, error, successMessage, blockedDates } = useSelector(state => state.myCalendar);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewMonth, setViewMonth] = useState(dayjs());
    const [isAllDay, setIsAllDay] = useState(false);
    const [shiftError, setShiftError] = useState('');
    const [draftStart, setDraftStart] = useState(null);
    const [draftEnd, setDraftEnd] = useState(null);
    const [shiftRanges, setShiftRanges] = useState([]);
    const [note, setNote] = useState('');

    useEffect(() => {
        dispatch(fetchBlockedDates());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => { dispatch(clearMessages()); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, dispatch]);

    const startOfMonth = viewMonth.startOf('month');
    const daysInMonth = viewMonth.daysInMonth();
    const startDayOfWeek = startOfMonth.day();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const calendarDays = Array(startOffset).fill(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const handlePrevMonth = () => setViewMonth(viewMonth.subtract(1, 'month'));
    const handleNextMonth = () => setViewMonth(viewMonth.add(1, 'month'));
    const handleDaySelect = (day) => {
        const newDate = viewMonth.date(day);
        setSelectedDate(newDate);
    };

    const currentDayOfWeek = selectedDate.day();
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayOfWeek = selectedDate.add(diffToMonday, 'day');

    const dynamicWeekColumns = Array.from({ length: 7 }, (_, i) => {
        const date = mondayOfWeek.add(i, 'day');
        return { fullDate: date, date: date.date(), label: date.format('ddd') };
    });

    const handleToday = () => {
        const today = dayjs();
        setSelectedDate(today);
        setViewMonth(today);
    };

    const handleAddShift = () => {
        setShiftError('');
        if (draftStart && draftEnd && draftStart.isValid() && draftEnd.isValid()) {
            if (draftStart.isAfter(draftEnd) || draftStart.isSame(draftEnd)) {
                setShiftError('Start time must be before end time.');
                return;
            }
            const newStartMin = timeToMinutes(draftStart.format('HH:mm'));
            const newEndMin = timeToMinutes(draftEnd.format('HH:mm'));

            const isOverlapping = shiftRanges.some(existing => {
                const existStartMin = timeToMinutes(existing.start);
                const existEndMin = timeToMinutes(existing.end);
                return newStartMin < existEndMin && newEndMin > existStartMin;
            });

            if (isOverlapping) {
                setShiftError('This shift overlaps with an existing one.');
                return;
            }
            const newShift = {
                start: draftStart.format('HH:mm'),
                end: draftEnd.format('HH:mm'),
                startLabel: draftStart.format('hh:mm A'),
                endLabel: draftEnd.format('hh:mm A')
            };

            setShiftRanges(prev => [...prev, newShift]);
            setDraftStart(null);
            setDraftEnd(null);
        }
    };

    const handleDeleteShift = (idxToRemove) => {
        setShiftRanges(prev => prev.filter((_, i) => i !== idxToRemove));
    };

    const handleMainSubmit = async () => {
        setShiftError('');
        if (!isAllDay && shiftRanges.length === 0) {
            setShiftError('Please add at least one shift, or select "All Day"');
            return;
        }

        const payload = {
            date: selectedDate.format('YYYY-MM-DD'),
            isAllDay: isAllDay,
            shifts: shiftRanges,
            note: note
        };

        try {
            await dispatch(blockDate(payload)).unwrap();
            setShiftRanges([]);
            setNote('');
            setIsAllDay(false);
            setDraftStart(null);
            setDraftEnd(null);
        } catch (err) {
            console.error("Failed to block date:", err);
        }
    };

    // 💡 دالة الحذف التي سنمررها للـ EventCard
    const handleRemoveEvent = (eventId) => {
        dispatch(deleteBlockedDate(eventId));
    };

    const realToday = dayjs();
    const todaysBookings = blockedDates.filter(b =>
        dayjs(b.blocked_date).isSame(realToday, 'day')
    );

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
            '&:hover fieldset': { borderColor: colors.gold }, '&.Mui-focused fieldset': { borderColor: colors.gold },
        },
        '& .MuiInputLabel-root': { color: colors.textSecondary },
        '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
    };

    const timePickerInputStyle = {
        '& .MuiOutlinedInput-root': {
            color: 'white', height: '44px',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
            '&:hover fieldset': { borderColor: colors.gold },
            '&.Mui-focused fieldset': { borderColor: colors.gold },
            '& .MuiSvgIcon-root': { color: colors.textSecondary, transition: 'color 0.2s', fontSize: '18px' },
            '&.Mui-focused .MuiSvgIcon-root': { color: colors.gold },
            '& .MuiInputBase-input': { px: 1, fontSize: '0.85rem' }
        },
        '& .MuiInputLabel-root': { color: colors.textSecondary, fontSize: '0.85rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: colors.gold },
    };

    return (
        <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: colors.bgMain, color: 'white', p: 3, fontFamily: 'sans-serif' }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', ml:-3 }}>

                {/* --- HEADER --- */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: -3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box component="svg" viewBox="0 0 24 24" sx={{ width: { xs: '28px', sm: '36px' }, height: { xs: '28px', sm: '36px' }, fill: 'none', stroke: colors.gold, strokeWidth: 1.2 }}>
                                <path d="M12 2.5L21.5 12L12 21.5L2.5 12Z" />
                            </Box>
                            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: 500, color: colors.gold, lineHeight: 1 }}>My Calendar</Typography>
                        </Box>
                        <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mt: 1 }}>information designed to accurate insights</Typography>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleMainSubmit}
                        disabled={loading}
                        sx={{
                            height: '48px', px: 5, fontSize: '1rem', letterSpacing: 1, bgcolor: colors.gold, color: colors.bgMain, fontWeight: 800, borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
                            '&:hover': { bgcolor: colors.goldHover, boxShadow: '0 6px 20px rgba(197, 160, 89, 0.4)' },
                            '&.Mui-disabled': { bgcolor: 'rgba(197, 160, 89, 0.5)' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'BLOCK DATE'}
                    </Button>
                </Box>

                {successMessage && <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#81c784', border: '1px solid rgba(76, 175, 80, 0.3)' }}>{successMessage}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)' }}>{error}</Alert>}

                <Grid container spacing={3} sx={{mt:3}}>
                    {/* Left Column */}
                    <Grid item xs={12} md={4} lg={3.5}>
                        <Stack spacing={3} sx={{ width: '100%', maxWidth: 300 }}>

                            {/* Month Calendar */}
                            <Paper sx={{ bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 4, p: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography sx={{ ...playfairFont, color: colors.gold, fontWeight: 600, fontSize: '1.05rem' }}>{viewMonth.format('MMMM YYYY')}</Typography>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton onClick={handlePrevMonth} size="small" sx={{ color: colors.textSecondary, padding: '4px', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                        <IconButton onClick={handleNextMonth} size="small" sx={{ color: colors.textSecondary, padding: '4px', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                    </Stack>
                                </Stack>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
                                    {WEEK_DAYS.map((d) => <Typography key={d} sx={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500, pb: 0.5 }}>{d}</Typography>)}
                                    {calendarDays.map((day, i) => {
                                        const isSelected = day === selectedDate.date() && viewMonth.isSame(selectedDate, 'month');
                                        const isToday = day === dayjs().date() && viewMonth.isSame(dayjs(), 'month');
                                        return (
                                            <Box key={i} sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
                                                {day && (
                                                    <Box onClick={() => handleDaySelect(day)} sx={{
                                                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                                                        bgcolor: isSelected ? colors.gold : isToday ? 'rgba(255,255,255,0.1)' : 'transparent', color: isSelected ? colors.bgMain : isToday ? 'white' : colors.textMuted,
                                                        fontWeight: isSelected ? 600 : 400, '&:hover': { bgcolor: isSelected ? colors.goldHover : 'rgba(255,255,255,0.05)' }
                                                    }}>{day}</Box>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Paper>

                            {/* CREATE A SHIFT / BLOCK DATE */}
                            <Paper sx={{ bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 4, p: 2.5 }}>
                                <FormControlLabel
                                    control={<Switch checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: colors.gold }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.gold } }} />}
                                    label={<Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>All Day (No specific shifts)</Typography>}
                                    sx={{ mb: 2 }}
                                />

                                {!isAllDay && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Box>
                                            {shiftError && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)', p: 1, '& .MuiAlert-message': { fontSize: '12px' } }}>{shiftError}</Alert>}
                                            <Typography sx={{ color: colors.gold, fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase', mb: 2 }}>CREATE A SHIFT</Typography>

                                            <Stack spacing={2}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <TimePicker label="Start Time" value={draftStart} onChange={setDraftStart} slotProps={{ textField: { size: 'small', fullWidth: true, sx: timePickerInputStyle } }} sx={{ flex: 1, minWidth: 0 }} />
                                                    <TimePicker label="End Time" value={draftEnd} onChange={setDraftEnd} slotProps={{ textField: { size: 'small', fullWidth: true, sx: timePickerInputStyle } }} sx={{ flex: 1, minWidth: 0 }} />
                                                </Stack>

                                                <Button
                                                    onClick={handleAddShift} variant="contained" disabled={!draftStart || !draftEnd} fullWidth
                                                    sx={{ height: '42px', bgcolor: 'rgba(197, 160, 89, 0.2)', color: colors.gold, fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.3)', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' } }}
                                                >
                                                    ADD SHIFT
                                                </Button>

                                                <Box>
                                                    <Typography sx={{ fontSize: '12px', color: colors.textSecondary, mb: 1, fontWeight: 'bold', mt: 1 }}>Selected Shifts:</Typography>
                                                    {shiftRanges.length > 0 ? (
                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: 100, p: 2, borderRadius: '6px', border: `1px dashed ${colors.border}`, overflowY: 'auto' }}>
                                                            {shiftRanges.map((range, idx) => (
                                                                <Chip key={idx} label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: colors.gold, border: `1px solid ${colors.gold}`, '& .MuiChip-deleteIcon': { color: colors.gold, '&:hover': { color: '#d4b06a' } } }} />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ p: 3, borderRadius: '6px', border: `1px dashed ${colors.border}`, textAlign: 'center', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>No shifts selected.</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </LocalizationProvider>
                                )}

                                {isAllDay && (
                                    <Box sx={{ mt: 1 }}>
                                        <Box sx={{ p: 3, borderRadius: '6px', border: `1px dashed ${colors.gold}`, bgcolor: 'rgba(197, 160, 89, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50 }}>
                                            <Typography sx={{ fontSize: '14px', color: colors.gold, fontWeight: 'bold', textAlign: 'center' }}>Currently set to "All Day" mode. No shifts required.</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* Right Column: Weekly Schedule */}
                    <Grid item xs={12} md={8} lg={8.5}>
                        <Paper sx={{ bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 4, p: 3, height: 694, display: 'flex', flexDirection: 'column', width: 730, minHeight: 621 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography sx={{ ...playfairFont, color: colors.gold, fontWeight: 600, fontSize: '1.125rem' }}>{selectedDate.format('MMMM DD - YYYY')}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Button onClick={handleToday} variant="text" size="small" sx={{ color: colors.textMuted, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, textTransform: 'none', px: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>Today</Button>
                                    <IconButton onClick={() => { setSelectedDate(selectedDate.subtract(1, 'day')); setViewMonth(selectedDate.subtract(1, 'day')); }} size="small" sx={{ color: colors.textSecondary, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                    <IconButton onClick={() => { setSelectedDate(selectedDate.add(1, 'day')); setViewMonth(selectedDate.add(1, 'day')); }} size="small" sx={{ color: colors.textSecondary, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                </Stack>
                            </Stack>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: 1, textAlign: 'center', pb: 2, borderBottom: `1px solid ${colors.border}` }}>
                                <Typography sx={{ fontSize: '10px', color: colors.textSecondary, textAlign: 'left', alignSelf: 'flex-end', pb: 0.5 }}>GMT+8</Typography>
                                {dynamicWeekColumns.map((c) => {
                                    const isSelected = c.fullDate.isSame(selectedDate, 'day');
                                    return (
                                        <Box key={c.date} onClick={() => { setSelectedDate(c.fullDate); setViewMonth(c.fullDate); }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, borderRadius: 3, cursor: 'pointer', transition: '0.2s', bgcolor: isSelected ? colors.gold : 'transparent', '&:hover': { bgcolor: isSelected ? colors.goldHover : 'rgba(255,255,255,0.05)' } }}>
                                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: isSelected ? colors.bgMain : 'white' }}>{String(c.date).padStart(2, '0')}</Typography>
                                            <Typography sx={{ fontSize: '10px', color: isSelected ? 'rgba(20, 14, 12, 0.7)' : colors.textSecondary }}>{c.label}</Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }}>
                                {HOURS.map((hourLabel, hourIndex) => {
                                    return (
                                        <Box key={hourLabel} sx={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: 1, alignItems: 'flex-start', py: 2, borderBottom: `1px solid ${colors.border}` }}>
                                            <Typography sx={{ fontSize: '11px', color: colors.textSecondary, pt: 1 }}>{hourLabel}</Typography>

                                            {dynamicWeekColumns.map((c) => {
                                                const cellEvents = blockedDates.filter(b => {
                                                    const isSameDay = dayjs(b.blocked_date).isSame(c.fullDate, 'day');
                                                    if (!isSameDay) return false;

                                                    if (!b.start_time || !b.end_time) {
                                                        return hourIndex === 0;
                                                    }

                                                    const startHour = parseInt(b.start_time.split(':')[0], 10);
                                                    const endHour = parseInt(b.end_time.split(':')[0], 10);

                                                    return hourIndex === startHour || hourIndex === endHour;
                                                });

                                                return (
                                                    <Box key={c.date} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        {/* 💡 تمرير دالة الحذف إلى الكرت */}
                                                        {cellEvents.map((evt, idx) => <EventCard key={idx} event={evt} onDelete={handleRemoveEvent} />)}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* --- BOTTOM ROW (Note + Bookings) --- */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={4} lg={3.5}>
                        <Paper sx={{ bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 4, p: 2.5, height: '100%', maxWidth: 300, width: 300 }}>
                            <Typography sx={{ ...playfairFont, color: colors.gold, fontWeight: 600, fontSize: '1.125rem', mb: 2 }}>Note</Typography>
                            <TextField fullWidth multiline rows={4} label="Optional Note" name="note" placeholder="Add a note for this time..." value={note} onChange={(e) => setNote(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputStyles} />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8} lg={8.5}>
                        <Paper sx={{ bgcolor: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 4, p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' ,width:730}}>
                            <Typography sx={{ ...playfairFont, color: colors.gold, fontWeight: 600, fontSize: '1.125rem', mb: 2 }}>
                                Daily Bookings ({realToday.format('MMM DD')})
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }}>
                                {todaysBookings.length > 0 ? (
                                    todaysBookings.map((b) => (
                                        <Box key={b.id} sx={{ minWidth: 240, bgcolor: '#241a15', borderLeft: `4px solid ${colors.gold}`, borderRadius: 2, px: 2, py: 1.5 }}>
                                            <Typography sx={{ fontSize: '12px', color: colors.textMuted, fontWeight: 500 }}>
                                                {b.start_time && b.end_time ? `${formatDisplayTime(b.start_time)} - ${formatDisplayTime(b.end_time)}` : 'All Day'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: colors.gold, mt: 0.5 }}>
                                                {b.note || 'Blocked Time'}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: colors.textSecondary, mt: 0.5 }}>Type: Blocked Date</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ color: colors.textSecondary, fontSize: '13px', py: 2 }}>
                                        No bookings or blocked times for today.
                                    </Typography>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

            </Box>
        </Box>
    );
}