import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, alpha, Chip, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function DateAndTime({ data, setData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isAllDay, setIsAllDay] = useState(data.isAllDay || false);
    const [error, setError] = useState('');

    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // ─── منطق الروزنامة (مع ميزة الاستثناء) ───
    const excludedDates = data.excludedDates || [];

    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');

        // إذا كان هناك بداية ونهاية، والنقر وقع ضمن النطاق -> استثناء أو إلغاء استثناء
        if (data.startDate && data.endDate && clickedDate.isAfter(data.startDate, 'day') && clickedDate.isBefore(data.endDate, 'day')) {
            const newExcluded = excludedDates.includes(dateStr)
                ? excludedDates.filter(d => d !== dateStr)
                : [...excludedDates, dateStr];
            setData({ ...data, excludedDates: newExcluded });
            return;
        }

        // منطق التحديد: من - إلى
        if (!data.startDate || (data.startDate && data.endDate)) {
            setData({ ...data, startDate: clickedDate, endDate: null, excludedDates: [] });
        } else if (data.startDate && !data.endDate) {
            if (clickedDate.isBefore(data.startDate, 'day')) {
                setData({ ...data, startDate: clickedDate, endDate: null, excludedDates: [] });
            } else {
                setData({ ...data, endDate: clickedDate });
            }
        }
    };

    const renderCustomDay = (dayProps) => {
        const { day, outsideCurrentMonth, disabled, ...other } = dayProps;
        if (outsideCurrentMonth) return <Box sx={{ width: 36, height: 36, margin: '2px auto' }} />;

        const dateStr = day.format('YYYY-MM-DD');
        const isExcluded = excludedDates.includes(dateStr);
        const isStart = data.startDate && day.isSame(data.startDate, 'day');
        const isEnd = data.endDate && day.isSame(data.endDate, 'day');
        const isBetween = data.startDate && data.endDate && day.isAfter(data.startDate, 'day') && day.isBefore(data.endDate, 'day');
        const isToday = dayjs().isSame(day, 'day');

        let bgColor = 'transparent';
        let borderStyle = 'none';
        let textColor = isDark ? '#eee0da' : '#2B211E';

        if (disabled) { textColor = isDark ? alpha('#eee0da', 0.2) : alpha('#2B211E', 0.2); }
        else if (isStart || isEnd) { bgColor = theme.palette.primary.main; textColor = '#131110'; }
        else if (isBetween) {
            if (isExcluded) {
                borderStyle = `2px solid ${theme.palette.primary.main}`;
                textColor = theme.palette.primary.main;
            } else {
                bgColor = alpha(theme.palette.primary.main, 0.15);
                textColor = theme.palette.primary.main;
            }
        }

        if (isToday && !isStart && !isEnd && !isBetween) { borderStyle = `1px solid ${theme.palette.text.primary}`; }

        return (
            <Box {...other} onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!disabled) handleDateClick(day); }}
                 sx={{
                     backgroundColor: bgColor, border: borderStyle, borderRadius: '50%', width: '36px', height: '36px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', margin: '2px auto',
                     color: textColor, opacity: disabled ? 0.6 : 1,
                     '&:hover': { backgroundColor: disabled ? 'transparent' : (isStart || isEnd) ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3) }
                 }}
            >{day.date()}</Box>
        );
    };

    // ─── منطق الشفتات ───
    const [draftStart, setDraftStart] = useState(null);
    const [draftEnd, setDraftEnd] = useState(null);
    const shiftRanges = data.shiftRanges || [];

    const handleAddShift = () => {
        setError('');
        if (draftStart && draftEnd && draftStart.isValid() && draftEnd.isValid()) {
            if (draftStart.isAfter(draftEnd) || draftStart.isSame(draftEnd)) {
                setError('Start time must be before end time.');
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
                setError('This shift overlaps with an existing one.');
                return;
            }

            const newShift = {
                start: draftStart.format('HH:mm'),
                end: draftEnd.format('HH:mm'),
                startLabel: draftStart.format('hh:mm A'),
                endLabel: draftEnd.format('hh:mm A')
            };

            setData(prev => ({ ...prev, shiftRanges: [...(prev.shiftRanges || []), newShift] }));
            setDraftStart(null);
            setDraftEnd(null);
        }
    };

    const handleDeleteShift = (idxToRemove) => {
        setData(prev => ({ ...prev, shiftRanges: (prev.shiftRanges || []).filter((_, i) => i !== idxToRemove) }));
    };

    const inputStyle = { '& .MuiOutlinedInput-root': { height: '48px', backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', color: isDark ? '#eee0da' : '#2B211E', borderRadius: '4px', border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)', '& fieldset': { borderColor: 'transparent' } } };

    return (
        <Paper className="date-time-section" sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ fontSize: '16px' }}>📅</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>Date & Time</Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', mb: 3, bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center' }}>
                    <StaticDatePicker displayStaticWrapperAs="desktop" disablePast value={data.startDate || null} onChange={() => { }} slots={{ day: renderCustomDay }} slotProps={{ actionBar: { actions: [] } }} sx={{ backgroundColor: 'transparent', '& .MuiPickersToolbar-root': { display: 'none' } }} />
                </Box>

                <FormControlLabel
                    control={<Switch checked={isAllDay} onChange={(e) => { setIsAllDay(e.target.checked); setData({...data, isAllDay: e.target.checked}); }} />}
                    label={<Typography sx={{ fontSize: '13px', fontWeight: 'bold' }}>All Day (No specific shifts)</Typography>}
                    sx={{ mb: 2 }}
                />

                {!isAllDay && (
                    <Box>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Create a Shift</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
                            <TimePicker label="Start Time" value={draftStart} onChange={setDraftStart} slotProps={{ textField: { fullWidth: true, sx: inputStyle } }} sx={{ flex: 1 }} />
                            <TimePicker label="End Time" value={draftEnd} onChange={setDraftEnd} slotProps={{ textField: { fullWidth: true, sx: inputStyle } }} sx={{ flex: 1 }} />
                            <Button variant="contained" onClick={handleAddShift} disabled={!draftStart || !draftEnd} sx={{ height: '48px', minWidth: '90px', backgroundColor: theme.palette.primary.main }}>ADD</Button>
                        </Box>
                    </Box>
                )}
            </LocalizationProvider>

            <Box sx={{ mt: 'auto', pt: 3 }}>
                {!isAllDay ? (
                    <Box >
                        <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mb: 1, fontWeight: 'bold' }}>Selected Shifts:</Typography>
                        {shiftRanges.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap',height:200, p: 2, borderRadius: '6px', border: `1px dashed ${theme.palette.divider}` }}>
                                {shiftRanges.map((range, idx) => (
                                    <Chip key={idx} label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}` }} />
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, borderRadius: '6px', border: `1px dashed ${theme.palette.divider}`, textAlign: 'center', height: 200 }}>
                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary }}>No shifts selected.</Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box sx={{
                        p: 3, borderRadius: '6px', border: `1px dashed ${theme.palette.primary.main}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50
                    }}>
                        <Typography sx={{ fontSize: '14px', color: theme.palette.primary.main, fontWeight: 'bold', textAlign: 'center' }}>
                            Currently set to "All Day" mode. No shifts required.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}