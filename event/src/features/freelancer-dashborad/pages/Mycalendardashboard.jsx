import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, IconButton, Stack, Paper, Grid,
    TextField, Switch, FormControlLabel, Alert, Chip, Popover, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { fetchBlockedDates, blockDate, deleteBlockedDate, clearMessages } from '../components/MyCalenderSlice/FreelancerCalendarSlice';

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// --- Data Constants ---
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'Am' : 'Pm';
    return `${hour12} ${period}`;
});

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

// ─── مكون عرض الكرت ───
function EventCard({ event, onDelete }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
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
        handleClose();
        setTimeout(() => {
            if (event.id && typeof onDelete === 'function') {
                onDelete(event.id);
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
                    bgcolor: open ? (isDark ? 'rgba(5, 150, 105, 0.8)' : 'rgba(16, 185, 129, 0.3)') : (isDark ? 'rgba(6, 78, 59, 0.9)' : 'rgba(16, 185, 129, 0.15)'),
                    border: open ? `1px solid ${theme.palette.primary.main}` : `1px solid ${isDark ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.5)'}`,
                    boxShadow: open ? `0 0 10px ${theme.palette.primary.main}55` : 'none',
                    cursor: 'pointer',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    width: '100%',
                    maxWidth: 130,
                    flexShrink: 0,
                    mb: 0.5,
                    transition: 'all 0.3s ease',
                    userSelect: 'none',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#ecfdf5' : '#064e3b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {event.note || 'Blocked Time'}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: isDark ? 'rgba(167, 243, 208, 0.8)' : 'rgba(6, 78, 59, 0.8)', lineHeight: 1.2, mt: 0.5, whiteSpace: 'nowrap' }}>
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
                        sx: { bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.primary.main}`, borderRadius: 2, ml: 1, p: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }
                    }
                }}
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
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const calendarState = useSelector(state => state.freelancerCalendar || state.myCalendar || {});
    const { loading = false, error = null, successMessage = null, blockedDates = [] } = calendarState;

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

    const handleRemoveEvent = (eventId) => {
        dispatch(deleteBlockedDate(eventId));
    };

    const realToday = dayjs();
    const todaysBookings = (blockedDates || []).filter(b =>
        dayjs(b.blocked_date).isSame(realToday, 'day')
    );

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم وصورة القلعة
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: 3,
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.primary,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: 1.5,
            '& fieldset': { borderColor: theme.palette.divider },
            '&:hover fieldset': { borderColor: 'primary.main' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
        },
        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
        '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    };

    const timePickerInputStyle = {
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.primary, height: '44px',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)',
            '& fieldset': { borderColor: theme.palette.divider },
            '&:hover fieldset': { borderColor: 'primary.main' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            '& .MuiSvgIcon-root': { color: theme.palette.text.secondary, fontSize: '18px' },
            '&.Mui-focused .MuiSvgIcon-root': { color: 'primary.main' },
            '& .MuiInputBase-input': { px: 1, fontSize: '0.85rem' }
        },
        '& .MuiInputLabel-root': { color: theme.palette.text.secondary, fontSize: '0.85rem' },
        '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    };

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: isDark
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="My Calendar" notificationCount={3} isOnline={true} />

                <Box component="main" sx={{ flex: 1, overflowY: "auto", px: { xs: 3, md: 4, lg: 5 }, py: 3.5, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 3.5 }}>

                        {/* --- HEADER --- */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid', borderColor: theme.palette.divider, pb: 3 }}>
                            <Box>
                                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                                    My Calendar
                                </Typography>
                                <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                                    Information designed for accurate insights
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleMainSubmit}
                                disabled={loading}
                                sx={{
                                    height: '46px', px: 4, fontSize: '0.9rem', letterSpacing: 1, fontWeight: 700, borderRadius: 2,
                                    '&.Mui-disabled': { opacity: 0.7 }
                                }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'BLOCK DATE'}
                            </Button>
                        </Box>

                        {successMessage && <Alert severity="success" sx={{ mb: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#81c784', border: '1px solid rgba(76, 175, 80, 0.3)' }}>{successMessage}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 1, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)' }}>{error}</Alert>}

                        {/* 👑 تعديل الـ Grid ليصبح القسم الأيمن (الجدول الأسبوعي) عريضاً وفخماً جداً (lg={8.5}) بينما اليسار (lg={3.5}) */}
                        <Grid container spacing={3}>
                            {/* Left Column */}
                            <Grid item xs={12} md={4} lg={3.5}>
                                <Stack spacing={3}>
                                    {/* Month Calendar */}
                                    <Paper sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography sx={{ fontFamily: "'Cinzel', serif", color: 'primary.main', fontWeight: 600, fontSize: '1.05rem' }}>{viewMonth.format('MMMM YYYY')}</Typography>
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton onClick={handlePrevMonth} size="small" sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover' } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                                <IconButton onClick={handleNextMonth} size="small" sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover' } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                            </Stack>
                                        </Stack>

                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center' }}>
                                            {WEEK_DAYS.map((d) => <Typography key={d} sx={{ fontSize: '11px', color: theme.palette.text.secondary, fontWeight: 500, pb: 0.5 }}>{d}</Typography>)}
                                            {calendarDays.map((day, i) => {
                                                const isSelected = day === selectedDate.date() && viewMonth.isSame(selectedDate, 'month');
                                                const isToday = day === dayjs().date() && viewMonth.isSame(dayjs(), 'month');
                                                return (
                                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
                                                        {day && (
                                                            <Box onClick={() => handleDaySelect(day)} sx={{
                                                                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                                                                bgcolor: isSelected ? 'primary.main' : isToday ? 'action.selected' : 'transparent',
                                                                color: isSelected ? (isDark ? '#000' : '#fff') : theme.palette.text.primary,
                                                                fontWeight: isSelected ? 700 : 400, '&:hover': { bgcolor: isSelected ? 'primary.main' : 'action.hover' }
                                                            }}>{day}</Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Paper>

                                    {/* CREATE A SHIFT / BLOCK DATE */}
                                    <Paper sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none' }}>
                                        <FormControlLabel
                                            control={<Switch checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'primary.main' } }} />}
                                            label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>All Day (No specific shifts)</Typography>}
                                            sx={{ mb: 2 }}
                                        />

                                        {!isAllDay && (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Box>
                                                    {shiftError && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffb4ab', border: '1px solid rgba(211, 47, 47, 0.3)', p: 1, '& .MuiAlert-message': { fontSize: '12px' } }}>{shiftError}</Alert>}
                                                    <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase', mb: 2 }}>CREATE A SHIFT</Typography>

                                                    <Stack spacing={2}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <TimePicker label="Start" value={draftStart} onChange={setDraftStart} slotProps={{ textField: { size: 'small', fullWidth: true, sx: timePickerInputStyle } }} sx={{ flex: 1, minWidth: 0 }} />
                                                            <TimePicker label="End" value={draftEnd} onChange={setDraftEnd} slotProps={{ textField: { size: 'small', fullWidth: true, sx: timePickerInputStyle } }} sx={{ flex: 1, minWidth: 0 }} />
                                                        </Stack>

                                                        <Button
                                                            onClick={handleAddShift} variant="contained" disabled={!draftStart || !draftEnd} fullWidth
                                                            sx={{ height: '40px', bgcolor: 'rgba(212, 175, 55, 0.15)', color: 'primary.main', fontWeight: 700, boxShadow: 'none', '&:hover': { bgcolor: 'rgba(212, 175, 55, 0.25)', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' } }}
                                                        >
                                                            ADD SHIFT
                                                        </Button>

                                                        <Box>
                                                            <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mb: 1, fontWeight: 700, mt: 1 }}>Selected Shifts:</Typography>
                                                            {shiftRanges.length > 0 ? (
                                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: 90, p: 2, borderRadius: 2, border: '1px dashed', borderColor: theme.palette.divider, overflowY: 'auto' }}>
                                                                    {shiftRanges.map((range, idx) => (
                                                                        <Chip key={idx} label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'primary.main', border: '1px solid', borderColor: 'primary.main', '& .MuiChip-deleteIcon': { color: 'primary.main', '&:hover': { color: 'primary.dark' } } }} />
                                                                    ))}
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ p: 3, borderRadius: 2, border: '1px dashed', borderColor: theme.palette.divider, textAlign: 'center', minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>No shifts selected.</Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            </LocalizationProvider>
                                        )}

                                        {isAllDay && (
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ p: 2.5, borderRadius: 2, border: '1px dashed', borderColor: 'primary.main', bgcolor: 'rgba(212, 175, 55, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50 }}>
                                                    <Typography sx={{ fontSize: '0.85rem', color: 'primary.main', fontWeight: 700, textAlign: 'center' }}>Currently set to "All Day" mode.</Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Paper>
                                </Stack>
                            </Grid>

                            {/* Right Column: Weekly Schedule (عريض جداً وبمساحة واسعة مريحة جداً lg={8.5}) */}
                            <Grid item xs={12} md={12} lg={10.5}>
                                <Paper sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none', height: 720, display: 'flex', flexDirection: 'column', width: '150%', maxWidth: 'none' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                                        <Typography sx={{ fontFamily: "'Cinzel', serif", color: 'primary.main', fontWeight: 600, fontSize: '1.1rem' }}>{selectedDate.format('MMMM DD - YYYY')}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button onClick={handleToday} variant="text" size="small" sx={{ color: theme.palette.text.secondary, bgcolor: 'action.hover', borderRadius: 2, textTransform: 'none', px: 2, '&:hover': { bgcolor: 'action.selected' } }}>Today</Button>
                                            <IconButton onClick={() => { setSelectedDate(selectedDate.subtract(1, 'day')); setViewMonth(selectedDate.subtract(1, 'day')); }} size="small" sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover' } }}><ChevronLeftIcon fontSize="small" /></IconButton>
                                            <IconButton onClick={() => { setSelectedDate(selectedDate.add(1, 'day')); setViewMonth(selectedDate.add(1, 'day')); }} size="small" sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover' } }}><ChevronRightIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </Stack>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 1.5, textAlign: 'center', pb: 2, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                        <Typography sx={{ fontSize: '11px', color: theme.palette.text.secondary, textAlign: 'left', alignSelf: 'flex-end', pb: 0.5 }}>GMT+8</Typography>
                                        {dynamicWeekColumns.map((c) => {
                                            const isSelected = c.fullDate.isSame(selectedDate, 'day');
                                            return (
                                                <Box key={c.date} onClick={() => { setSelectedDate(c.fullDate); setViewMonth(c.fullDate); }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, borderRadius: 2, cursor: 'pointer', transition: '0.2s', bgcolor: isSelected ? 'primary.main' : 'transparent', '&:hover': { bgcolor: isSelected ? 'primary.main' : 'action.hover' } }}>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: isSelected ? (isDark ? '#000' : '#fff') : theme.palette.text.primary }}>{String(c.date).padStart(2, '0')}</Typography>
                                                    <Typography sx={{ fontSize: '10px', color: isSelected ? (isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255,255,255,0.8)') : theme.palette.text.secondary }}>{c.label}</Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.divider, borderRadius: '4px' } }}>
                                        {HOURS.map((hourLabel, hourIndex) => {
                                            return (
                                                <Box key={hourLabel} sx={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 1.5, alignItems: 'flex-start', py: 2.5, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                                                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, pt: 1 }}>{hourLabel}</Typography>

                                                    {dynamicWeekColumns.map((c) => {
                                                        const cellEvents = (blockedDates || []).filter(b => {
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
                        <Grid container spacing={3} sx={{ pb: 3 }}>
                            <Grid item xs={12} md={4} lg={3.5}>
                                <Paper sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none', height: '100%', width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'Cinzel', serif", color: 'primary.main', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>Note</Typography>
                                    <TextField fullWidth multiline rows={4} label="Optional Note" name="note" placeholder="Add a note for this time..." value={note} onChange={(e) => setNote(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputStyles} />
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={8} lg={8.5}>
                                <Paper sx={{ ...glassSx, bgcolor: isDark ? 'rgba(15,15,20,0.4)' : 'rgba(255,255,255,0.4)', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                                    <Typography sx={{ fontFamily: "'Cinzel', serif", color: 'primary.main', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                                        Daily Bookings ({realToday.format('MMM DD')})
                                    </Typography>

                                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.divider, borderRadius: '4px' } }}>
                                        {todaysBookings.length > 0 ? (
                                            todaysBookings.map((b) => (
                                                <Box key={b.id} sx={{ minWidth: 240, bgcolor: isDark ? '#241a15' : '#FDFBF7', borderLeft: '4px solid', borderColor: 'primary.main', borderRadius: 2, px: 2, py: 1.5 }}>
                                                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, fontWeight: 500 }}>
                                                        {b.start_time && b.end_time ? `${formatDisplayTime(b.start_time)} - ${formatDisplayTime(b.end_time)}` : 'All Day'}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'primary.main', mt: 0.5 }}>
                                                        {b.note || 'Blocked Time'}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mt: 0.5 }}>Type: Blocked Date</Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', py: 2 }}>
                                                No bookings or blocked times for today.
                                            </Typography>
                                        )}
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}