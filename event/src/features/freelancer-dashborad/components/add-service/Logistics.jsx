import React, { useState } from "react";
import {
    Paper, Box, Typography, TextField, Button, Switch,
    FormControlLabel, Radio, RadioGroup, Chip
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { StaticDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs"; // 👑 تأكدي من إضافة هذا الاستيراد

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.85rem",
        color: "text.primary",
        bgcolor: "background.paper",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "primary.main" },
        "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
    "& .MuiInputLabel-root": {
        color: "text.secondary",
        "&.Mui-focused": { color: "primary.main" },
    },
    "& .MuiIconButton-root": { color: "primary.main" }
};

const labelSx = {
    fontSize: "0.72rem",
    color: "text.secondary",
    fontFamily: "'Raleway', sans-serif",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    mb: 1,
};

const Logistics = ({ data = {}, onChange }) => {
    const handle = (field) => (e) => onChange?.({ ...data, [field]: e.target.value });
    const selectionMode = data.dateSelectionMode || "Date Range";

    const [shiftStart, setShiftStart] = useState(null);
    const [shiftEnd, setShiftEnd] = useState(null);
    const shifts = data.shifts || [];

    const handleAddShift = () => {
        if (!shiftStart || !shiftEnd) {
            alert("يرجى تحديد وقت البداية ووقت النهاية أولاً.");
            return;
        }

        const startTimeStr = shiftStart.format("hh:mm A");
        const endTimeStr = shiftEnd.format("hh:mm A");

        onChange?.({ ...data, shifts: [...shifts, `${startTimeStr} - ${endTimeStr}`] });

        setShiftStart(null);
        setShiftEnd(null);
    };

    const handleRemoveShift = (indexToRemove) => {
        const newShifts = shifts.filter((_, idx) => idx !== indexToRemove);
        onChange?.({ ...data, shifts: newShifts });
    };

    const handleDateClick = (clickedDate) => {
        if (!clickedDate) return;
        const dateStr = clickedDate.format('YYYY-MM-DD');

        if (selectionMode === 'Multiple Days') {
            const currentSelected = data.selectedDates || [];
            const newSelected = currentSelected.includes(dateStr)
                ? currentSelected.filter(d => d !== dateStr)
                : [...currentSelected, dateStr];
            onChange?.({ ...data, selectedDates: newSelected });
        } else {
            if (!data.startDate || (data.startDate && data.endDate)) {
                onChange?.({ ...data, startDate: clickedDate, endDate: null });
            } else if (data.startDate && !data.endDate) {
                const newEndDate = clickedDate.isBefore(data.startDate, 'day') ? data.startDate : clickedDate;
                const newStartDate = clickedDate.isBefore(data.startDate, 'day') ? clickedDate : data.startDate;
                onChange?.({ ...data, startDate: newStartDate, endDate: newEndDate });
            }
        }
    };

    const renderCustomDay = (dayProps) => {
        const {
            day,
            outsideCurrentMonth,
            isLastVisibleCell,
            isFirstVisibleCell,
            disableMargin,
            selected,
            today,
            ...other
        } = dayProps;

        if (outsideCurrentMonth) return <Box sx={{ width: 36, height: 36 }} />;

        const dateStr = day.format('YYYY-MM-DD');
        let isSelected = false;
        let isBetween = false;

        if (selectionMode === 'Multiple Days') {
            isSelected = (data.selectedDates || []).includes(dateStr);
        } else {
            const isStart = data.startDate && day.isSame(data.startDate, 'day');
            const isEnd = data.endDate && day.isSame(data.endDate, 'day');
            isBetween = data.startDate && data.endDate && day.isAfter(data.startDate, 'day') && day.isBefore(data.endDate, 'day');
            isSelected = isStart || isEnd;
        }

        return (
            <Box
                {...other}
                onClick={() => handleDateClick(day)}
                sx={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', borderRadius: '50%', margin: '2px auto',
                    fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem",
                    backgroundColor: isSelected ? "primary.main" : isBetween ? "primary.light" : 'transparent',
                    color: isSelected ? '#fff' : 'text.primary',
                    fontWeight: isSelected ? 700 : 400,
                    transition: "all 0.2s",
                    '&:hover': { backgroundColor: "primary.main", color: '#fff' }
                }}
            >
                {day.date()}
            </Box>
        );
    };

    // 👑 التعديل هنا: تحديد التاريخ الافتراضي للتقويم لكي يعرض الشهر الصحيح عند الفتح
    const initialCalendarDate = selectionMode === "Date Range"
        ? (data.startDate || null)
        : (data.selectedDates && data.selectedDates.length > 0 ? dayjs(data.selectedDates[0]) : null);

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "background.paper", border: "1px solid divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <CalendarMonthIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    Date, Time & Availability
                </Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={labelSx}>Selection Mode</Typography>
                    <RadioGroup row value={selectionMode} onChange={(e) => onChange?.({...data, dateSelectionMode: e.target.value, startDate: null, endDate: null, selectedDates: []})}>
                        <FormControlLabel value="Date Range" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.8rem" }}>Date Range</Typography>} />
                        <FormControlLabel value="Multiple Days" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.8rem" }}>Multiple Days</Typography>} />
                    </RadioGroup>
                </Box>

                <Box sx={{ p: 1, border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 3, maxWidth: 360, mx: "auto", bgcolor: "background.default" }}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        // تمرير القيمة المحسوبة هنا
                        value={initialCalendarDate}
                        // يمكننا أيضاً إخبار التقويم صراحة بأي شهر يجب أن يفتح إذا لم تكن هناك قيمة مبدئية
                        defaultCalendarMonth={initialCalendarDate || dayjs()}
                        disablePast
                        slots={{ day: renderCustomDay }}
                        slotProps={{ actionBar: { actions: [] } }}
                        sx={{
                            bgcolor: "transparent",
                            '.MuiPickersToolbar-root': { display: 'none' },
                            '.MuiPickersCalendarHeader-label': { fontFamily: "'Cinzel', serif", color: 'text.primary' },
                            '.MuiDayCalendar-weekDayLabel': { color: 'text.secondary' },
                            '.MuiIconButton-root': { color: 'text.primary' }
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <Switch size="small" checked={!!data.isAllDay} onChange={(e) => onChange?.({ ...data, isAllDay: e.target.checked })} />
                    <Typography sx={{ fontSize: "0.85rem", color: "text.primary", fontWeight: 600 }}>All Day (No specific shifts)</Typography>
                </Box>

                {!data.isAllDay && (
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <AccessTimeIcon sx={{ color: "primary.main", fontSize: "1rem" }} />
                            <Typography sx={{ ...labelSx, color: "primary.main", mb: 0 }}>Create A Shift</Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 2 }}>
                            <TimePicker
                                label="Start"
                                value={shiftStart}
                                onChange={(newValue) => setShiftStart(newValue)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        sx: { ...fieldSx, minWidth: 140 }
                                    }
                                }}
                            />

                            <Typography sx={{ color: "text.secondary", fontWeight: "bold" }}>-</Typography>

                            <TimePicker
                                label="End"
                                value={shiftEnd}
                                onChange={(newValue) => setShiftEnd(newValue)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        sx: { ...fieldSx, minWidth: 140 }
                                    }
                                }}
                            />

                            <Button variant="contained" onClick={handleAddShift} sx={{ height: 40 }}>ADD</Button>
                        </Box>

                        {shifts.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 1.5, bgcolor: 'rgba(201,168,76,0.05)', borderRadius: 1, border: '1px dashed rgba(201,168,76,0.3)' }}>
                                {shifts.map((shift, index) => (
                                    <Chip
                                        key={index}
                                        label={shift}
                                        onDelete={() => handleRemoveShift(index)}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontFamily: "'Raleway', sans-serif", fontWeight: 600 }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </LocalizationProvider>

            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                <Typography sx={labelSx}>Secondary Contact Number</Typography>
                <TextField fullWidth placeholder="+963 900 000 000" value={data.secondaryPhone || ""} onChange={handle("secondaryPhone")} size="small" sx={fieldSx} />
            </Box>
        </Paper>
    );
};

export default Logistics;