import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, alpha, Chip, Button, Switch, FormControlLabel, Alert, RadioGroup, Radio } from '@mui/material';
import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

export default function DateAndTime({ data, setData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [isAllDay, setIsAllDay] = useState(data.isAllDay || false);
    const [selectionMode, setSelectionMode] = useState(data.selectionMode || 'range');
    const [error, setError] = useState('');

    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };
    const getExcludedDates = (start, end, selected) => {
        if (!start || !end) return [];
        let excluded = [];
        let current = dayjs(start);
        while (current.isBefore(end, 'day')) {
            current = current.add(1, 'day');
            if (!selected.includes(current.format('YYYY-MM-DD'))) {
                excluded.push(current.format('YYYY-MM-DD'));
            }
        }
        return excluded;
    };

    const excludedDates = data.excludedDates || [];
    const selectedDates = data.selectedDates || [];

    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');

        if (selectionMode === 'multiple') {
            const isAlreadySelected = selectedDates.includes(dateStr);
            const newSelected = isAlreadySelected
                ? selectedDates.filter(d => d !== dateStr)
                : [...selectedDates, dateStr];

            if (newSelected.length > 0) {
                const sortedDates = [...newSelected].sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
                const start = dayjs(sortedDates[0]);
                const end = dayjs(sortedDates[sortedDates.length - 1]);
                const newExcluded = getExcludedDates(start, end, newSelected);

                setData({ ...data, selectedDates: newSelected, startDate: start, endDate: end, excludedDates: newExcluded, selectionMode: 'multiple' });
            } else {
                setData({ ...data, selectedDates: [], startDate: null, endDate: null, excludedDates: [] });
            }
            return;
        }

        if (data.startDate && data.endDate && clickedDate.isAfter(data.startDate, 'day') && clickedDate.isBefore(data.endDate, 'day')) {
            const newExcluded = excludedDates.includes(dateStr)
                ? excludedDates.filter(d => d !== dateStr)
                : [...excludedDates, dateStr];
            setData({ ...data, excludedDates: newExcluded });
            return;
        }

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
        let bgColor = 'transparent';
        let borderStyle = 'none';
        let textColor = isDark ? '#ffffff' : BROWN_TEXT;

        if (disabled) {
            textColor = isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.2);
        } else if (selectionMode === 'multiple') {
            const isSelected = selectedDates.includes(dateStr);
            const isExcluded = excludedDates.includes(dateStr);
            if (isSelected) {
                bgColor = GOLD;
                textColor = '#131110';
            } else if (isExcluded) {
                borderStyle = `1px dashed ${GOLD}`;
                textColor = GOLD;
            }
        } else {
            const isExcluded = excludedDates.includes(dateStr);
            const isStart = data.startDate && day.isSame(data.startDate, 'day');
            const isEnd = data.endDate && day.isSame(data.endDate, 'day');
            const isBetween = data.startDate && data.endDate && day.isAfter(data.startDate, 'day') && day.isBefore(data.endDate, 'day');

            if (isStart || isEnd) { bgColor = GOLD; textColor = '#131110'; }
            else if (isBetween) {
                if (isExcluded) { borderStyle = `2px solid ${GOLD}`; textColor = GOLD; }
                else { bgColor = alpha(GOLD, 0.15); textColor = GOLD; }
            }
        }

        return (
            <Box {...other} onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!disabled) handleDateClick(day); }}
                 sx={{
                     backgroundColor: bgColor, border: borderStyle, borderRadius: '50%', width: '36px', height: '36px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', margin: '2px auto',
                     color: textColor, opacity: disabled ? 0.6 : 1,
                     transition: 'all 0.5s ease',
                     '&:hover': { backgroundColor: disabled ? 'transparent' : (bgColor !== 'transparent') ? GOLD : alpha(GOLD, 0.3) }
                 }}
            >{day.date()}</Box>
        );
    };

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

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            height: '48px',
            backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            color: isDark ? '#ffffff' : BROWN_TEXT,
            borderRadius: '4px',
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            '& fieldset': { borderColor: 'transparent' }
        }
    };

    // 💡 تنسيق نافذة الوقت المنسدلة (TimePicker)
    const timePickerPopperProps = {
        popper: {
            sx: {
                '& .MuiPaper-root': {
                    background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                    border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                    color: isDark ? '#ffffff' : BROWN_TEXT,
                    backdropFilter: 'blur(16px)',
                    backgroundImage: 'none',
                    '& .MuiMultiSectionDigitalClockSection-root': {
                        borderRight: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`
                    }
                }
            }
        },
        textField: { fullWidth: true, sx: inputStyle }
    };

    return (
        <Paper className="date-time-section" sx={{
            p: 4,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px',
            height: '100%',
            display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                <Typography sx={{ fontSize: '16px' }}>📅</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em', color: isDark ? '#ffffff' : BROWN_TEXT }}>Date & Time</Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 'bold', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                        Selection Mode
                    </Typography>
                    <RadioGroup row value={selectionMode} onChange={(e) => { const mode = e.target.value; setSelectionMode(mode); setData({ ...data, selectionMode: mode }); }}>
                        <FormControlLabel value="range" control={<Radio size="small" sx={{color: GOLD, '&.Mui-checked': { color: GOLD }}}/>} label={<Typography sx={{ fontSize: '12px', color: isDark ? '#ffffff' : BROWN_TEXT }}>Date Range</Typography>} />
                        <FormControlLabel value="multiple" control={<Radio size="small" sx={{color: GOLD, '&.Mui-checked': { color: GOLD }}}/>} label={<Typography sx={{ fontSize: '12px', color: isDark ? '#ffffff' : BROWN_TEXT }}>Multiple Days</Typography>} />
                    </RadioGroup>
                </Box>

                <Box sx={{ border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, borderRadius: '8px', mb: 3, background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, display: 'flex', justifyContent: 'center'}}>
                    <StaticDatePicker displayStaticWrapperAs="desktop" disablePast value={selectionMode === 'range' ? (data.startDate || null) : null} onChange={() => { }} slots={{ day: renderCustomDay }} slotProps={{ actionBar: { actions: [] } }} sx={{ backgroundColor: 'transparent', '& .MuiPickersToolbar-root': { display: 'none' }, '& .MuiTypography-root': { color: isDark ? '#ffffff' : BROWN_TEXT } }} />
                </Box>

                <FormControlLabel
                    control={<Switch checked={isAllDay} onChange={(e) => { setIsAllDay(e.target.checked); setData({...data, isAllDay: e.target.checked}); }} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }}/>}
                    label={<Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: isDark ? '#ffffff' : BROWN_TEXT }}>All Day (No specific shifts)</Typography>}
                    sx={{ mb: 2 }}
                />

                {!isAllDay && (
                    <Box>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Create a Shift</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
                            <TimePicker label="Start Time" value={draftStart} onChange={setDraftStart} slotProps={timePickerPopperProps} sx={{ flex: 1 }} />
                            <TimePicker label="End Time" value={draftEnd} onChange={setDraftEnd} slotProps={timePickerPopperProps} sx={{ flex: 1 }} />
                            <Button variant="contained" onClick={handleAddShift} disabled={!draftStart || !draftEnd} sx={{ height: '48px', minWidth: '90px', backgroundColor: GOLD, color: '#131110', fontWeight: 'bold', '&:hover': {bgcolor: '#b38c45'} }}>ADD</Button>
                        </Box>
                    </Box>
                )}
            </LocalizationProvider>

            <Box sx={{ mt: 'auto', pt: 3 }}>
                {!isAllDay ? (
                    <Box >
                        <Typography sx={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1, fontWeight: 'bold' }}>Selected Shifts:</Typography>
                        {shiftRanges.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap',height:200, p: 2, borderRadius: '6px', border: isDark ? '1px dashed rgba(255,255,255,0.2)' : `1px dashed ${LIGHT_BORDER}` }}>
                                {shiftRanges.map((range, idx) => (
                                    <Chip key={idx} label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: alpha(GOLD, 0.1), color: GOLD, border: `1px solid ${GOLD}` }} />
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ p: 3, borderRadius: '6px', border: isDark ? '1px dashed rgba(255,255,255,0.2)' : `1px dashed ${LIGHT_BORDER}`, textAlign: 'center', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>No shifts selected.</Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box sx={{
                        p: 3, borderRadius: '6px', border: `1px dashed ${GOLD}`,
                        bgcolor: alpha(GOLD, 0.05), display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50
                    }}>
                        <Typography sx={{ fontSize: '14px', color: GOLD, fontWeight: 'bold', textAlign: 'center' }}>
                            Currently set to "All Day" mode. No shifts required.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}