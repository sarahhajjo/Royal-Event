import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useDispatch } from 'react-redux';
import { setScheduleDates } from '../addition_slices/arrangementSlice'; // 💡 استيراد الأكشن
import ServiceDateAndTime from './ServiceDateAndTime';

const ScheduleSection = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch(); // 💡 تعريف الـ dispatch

    const [dateTimeData, setDateTimeData] = useState({
        selectionMode: 'range',
        startDate: null,
        endDate: null,
        excludedDates: [],
        selectedDates: [],
        isAllDay: false,
        shiftRanges: []
    });

    // 💡 إرسال التواريخ للريدكس كل ما المستخدم يختار أو يغير تاريخ
    useEffect(() => {
        dispatch(setScheduleDates({
            selectionMode: dateTimeData.selectionMode, // 💡 لتحديد نوع التواريخ
            startDate: dateTimeData.startDate ? dateTimeData.startDate.format('YYYY-MM-DD') : null,
            endDate: dateTimeData.endDate ? dateTimeData.endDate.format('YYYY-MM-DD') : null,
            selectedDates: dateTimeData.selectedDates,
            isAllDay: dateTimeData.isAllDay,
            shiftRanges: dateTimeData.shiftRanges // 💡 لإرسال الشفتات
        }));
    }, [dateTimeData, dispatch]);
    return (
        <Box sx={{
            p: 4,
            bgcolor: isDark ? '#261d19' : '#E5D9B8',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            width: 1020
        }}>
            <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3, fontSize: '1rem', letterSpacing: '0.02em' }}>
                ARRANGEMENT SCHEDULE
            </Typography>

            <Box sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)', p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <ServiceDateAndTime data={dateTimeData} setData={setDateTimeData} />
            </Box>
        </Box>
    );
};

export default ScheduleSection;