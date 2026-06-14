import React, { useState } from 'react';
import { Box, Typography, alpha, Chip, Button, Switch, FormControlLabel, Alert, RadioGroup, Radio } from '@mui/material';
import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

export default function ServiceDateAndTime({ data, setData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [isAllDay, setIsAllDay] = useState(data?.isAllDay || false);
    const [selectionMode, setSelectionMode] = useState(data?.selectionMode || 'range');
    const [error, setError] = useState('');

    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const excludedDates = data?.excludedDates || [];
    const selectedDates = data?.selectedDates || [];
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
    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');

        if (selectionMode === 'multiple') {
            const isAlreadySelected = selectedDates.includes(dateStr);
            const newSelected = isAlreadySelected
                ? selectedDates.filter(d => d !== dateStr)
                : [...selectedDates, dateStr];

            if (newSelected.length > 0) {
                // ترتيب التواريخ للحصول على البداية والنهاية
                const sortedDates = [...newSelected].sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
                const start = dayjs(sortedDates[0]);
                const end = dayjs(sortedDates[sortedDates.length - 1]);

                // توليد الأيام المستثناة (الأيام التي لم يخترها المستخدم بين البداية والنهاية)
                const newExcluded = getExcludedDates(start, end, newSelected);

                setData({
                    ...data,
                    selectedDates: newSelected,
                    startDate: start,
                    endDate: end,
                    excludedDates: newExcluded,
                    selectionMode: 'multiple'
                });
            } else {
                // في حال تم إلغاء اختيار كل الأيام
                setData({ ...data, selectedDates: [], startDate: null, endDate: null, excludedDates: [] });
            }
            return;
        }

        if (data?.startDate && data?.endDate && clickedDate.isAfter(data.startDate, 'day') && clickedDate.isBefore(data.endDate, 'day')) {
            const newExcluded = excludedDates.includes(dateStr)
                ? excludedDates.filter(d => d !== dateStr)
                : [...excludedDates, dateStr];
            setData({ ...data, excludedDates: newExcluded });
            return;
        }

        if (!data?.startDate || (data?.startDate && data?.endDate)) {
            setData({ ...data, startDate: clickedDate, endDate: null, excludedDates: [] });
        } else if (data?.startDate && !data?.endDate) {
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
        const isToday = dayjs().isSame(day, 'day');

        let bgColor = 'transparent';
        let borderStyle = 'none';
        let textColor = isDark ? '#eee0da' : '#2B211E';

        if (disabled) {
            textColor = isDark ? alpha('#eee0da', 0.2) : alpha('#2B211E', 0.2);
        } else if (selectionMode === 'multiple') {
            const isSelected = selectedDates.includes(dateStr);
            const isExcluded = excludedDates.includes(dateStr);
            if (isSelected) {
                bgColor = theme.palette.primary.main;
                textColor = '#131110';
            }else if (isExcluded) {
                // الأيام التي تقع بين اختيارات المستخدم ستظهر بإطار متقطع
                borderStyle = `1px dashed ${theme.palette.primary.main}`;
                textColor = theme.palette.primary.main;
            }
            if (isToday && !isSelected) { borderStyle = `1px solid ${theme.palette.text.primary}`; }
        } else {
            const isExcluded = excludedDates.includes(dateStr);
            const isStart = data?.startDate && day.isSame(data.startDate, 'day');
            const isEnd = data?.endDate && day.isSame(data.endDate, 'day');
            const isBetween = data?.startDate && data?.endDate && day.isAfter(data.startDate, 'day') && day.isBefore(data.endDate, 'day');

            if (isStart || isEnd) {
                bgColor = theme.palette.primary.main; textColor = '#131110';
            } else if (isBetween) {
                if (isExcluded) {
                    borderStyle = `2px solid ${theme.palette.primary.main}`;
                    textColor = theme.palette.primary.main;
                } else {
                    bgColor = alpha(theme.palette.primary.main, 0.15);
                    textColor = theme.palette.primary.main;
                }
            }
            if (isToday && !isStart && !isEnd && !isBetween) { borderStyle = `1px solid ${theme.palette.text.primary}`; }
        }

        return (
            <Box {...other} onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!disabled) handleDateClick(day); }}
                 sx={{
                     backgroundColor: bgColor, border: borderStyle, borderRadius: '50%', width: '36px', height: '36px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', margin: '2px auto',
                     color: textColor, opacity: disabled ? 0.6 : 1,
                     transition: 'all 0.2s ease',
                     '&:hover': { backgroundColor: disabled ? 'transparent' : (bgColor !== 'transparent') ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3) }
                 }}
            >{day.date()}</Box>
        );
    };

    const [draftStart, setDraftStart] = useState(null);
    const [draftEnd, setDraftEnd] = useState(null);
    const shiftRanges = data?.shiftRanges || [];

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
        <Box sx={{ width: '100%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* 💡 قللنا الـ gap شوي ليعطي مساحة تنفس، وضفنا width 100% */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>

                    {/* 🟢 القسم الأيسر: الروزنامة */}
                    {/* 💡 ضفنا minWidth: 0 هون لحتى نجبر الـ flexBox ما يطلع لبرا */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ height: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontSize: '11px', fontWeight: 'bold', color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Selection Mode
                            </Typography>
                            <RadioGroup
                                row
                                value={selectionMode}
                                onChange={(e) => {
                                    const mode = e.target.value;
                                    setSelectionMode(mode);
                                    setData({ ...data, selectionMode: mode });
                                }}
                                sx={{ flexWrap: 'nowrap', gap: 1 }}
                            >
                                <FormControlLabel value="range" control={<Radio size="small" sx={{ color: theme.palette.text.secondary, '&.Mui-checked': { color: theme.palette.primary.main } }} />} label={<Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>Date Range</Typography>} sx={{ m: 0 }} />
                                <FormControlLabel value="multiple" control={<Radio size="small" sx={{ color: theme.palette.text.secondary, '&.Mui-checked': { color: theme.palette.primary.main } }} />} label={<Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>Multiple Days</Typography>} sx={{ m: 0 }} />
                            </RadioGroup>
                        </Box>

                        <Box sx={{ flexGrow: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                            <StaticDatePicker displayStaticWrapperAs="desktop" disablePast value={selectionMode === 'range' ? (data?.startDate || null) : null} onChange={() => { }} slots={{ day: renderCustomDay }} slotProps={{ actionBar: { actions: [] } }} sx={{ backgroundColor: 'transparent', '& .MuiPickersToolbar-root': { display: 'none' } }} />
                        </Box>
                    </Box>

                    {/* 🟢 القسم الأيمن: الشفتات */}
                    {/* 💡 ضفنا minWidth: 0 هون كمان */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

                        <Box sx={{ height: '48px', display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FormControlLabel
                                control={<Switch checked={isAllDay} onChange={(e) => { setIsAllDay(e.target.checked); setData({...data, isAllDay: e.target.checked}); }} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.primary.main }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.palette.primary.main } }} />}
                                label={<Typography sx={{ fontSize: '13px', fontWeight: 'bold', color: theme.palette.text.secondary }}>All Day (No specific shifts)</Typography>}
                                sx={{ m: 0 }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            {!isAllDay && (
                                <Box sx={{ mb: 2 }}>
                                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create a Shift</Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', width: '100%' }}>
                                        {/* 💡 غلفنا الـ TimePicker بـ Box بيقبل التصغير (minWidth: 0) */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <TimePicker label="Start Time" value={draftStart} onChange={setDraftStart} slotProps={{ textField: { fullWidth: true, sx: inputStyle } }} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <TimePicker label="End Time" value={draftEnd} onChange={setDraftEnd} slotProps={{ textField: { fullWidth: true, sx: inputStyle } }} />
                                        </Box>
                                        {/* 💡 منعنا الزر من إنه يصغر عشان يضل شكله مرتب */}
                                        <Button variant="contained" onClick={handleAddShift} disabled={!draftStart || !draftEnd} sx={{ height: '48px', width: '90px', flexShrink: 0, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '&.Mui-disabled': { backgroundColor: alpha(theme.palette.primary.main, 0.3), color: alpha(theme.palette.primary.contrastText, 0.5) }, fontWeight: 'bold' }}>ADD</Button>
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                {!isAllDay ? (
                                    <>
                                        <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary, mb: 1, fontWeight: 'bold' }}>Selected Shifts:</Typography>
                                        {shiftRanges.length > 0 ? (
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexGrow: 1, p: 2, borderRadius: '6px', border: `1px dashed ${theme.palette.divider}`, alignContent: 'flex-start' }}>
                                                {shiftRanges.map((range, idx) => (
                                                    <Chip key={idx} label={`${range.startLabel} - ${range.endLabel}`} onDelete={() => handleDeleteShift(idx)} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}` }} />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, borderRadius: '6px', border: `1px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
                                                <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary }}>No shifts selected.</Typography>
                                            </Box>
                                        )}
                                    </>
                                ) : (
                                    <Box sx={{
                                        flexGrow: 1, p: 2, borderRadius: '6px', border: `1px dashed ${theme.palette.primary.main}`,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05), display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main, fontWeight: 'bold', textAlign: 'center' }}>
                                            Currently set to "All Day" mode. No shifts required.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                </Box>
            </LocalizationProvider>
        </Box>
    );
}