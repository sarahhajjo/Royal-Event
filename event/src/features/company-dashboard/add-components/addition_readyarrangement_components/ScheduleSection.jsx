import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import { setScheduleDates } from '../addition_slices/arrangementSlice';
import ServiceDateAndTime from './ServiceDateAndTime';
import dayjs from 'dayjs';

const ScheduleSection = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    // 💡 1. قراءة البيانات القادمة من الـ Redux (والتي أرسلتها صفحة التعديل)
    const storedSchedule = useSelector(state => state.arrangement.scheduleDates);

    const [dateTimeData, setDateTimeData] = useState({
        selectionMode: 'range',
        startDate: null,
        endDate: null,
        excludedDates: [],
        selectedDates: [],
        isAllDay: false,
        shiftRanges: []
    });

    // 💡 2. تحديث الشاشة فوراً عند وصول البيانات القديمة
    useEffect(() => {
        if (storedSchedule) {
            setDateTimeData({
                selectionMode: storedSchedule.selectionMode || 'range',
                startDate: storedSchedule.startDate ? dayjs(storedSchedule.startDate) : null,
                endDate: storedSchedule.endDate ? dayjs(storedSchedule.endDate) : null,
                excludedDates: storedSchedule.excludedDates || [],
                selectedDates: storedSchedule.selectedDates || [],
                isAllDay: storedSchedule.isAllDay || false,
                shiftRanges: storedSchedule.shiftRanges || []
            });
        }
    }, [storedSchedule]);

    // 💡 3. دالة آمنة للتحديث (لا تمسح البيانات تلقائياً، بل عند تعديل المستخدم فقط)
    const handleSetData = (newDataOrUpdater) => {
        setDateTimeData((prev) => {
            const newData = typeof newDataOrUpdater === 'function' ? newDataOrUpdater(prev) : newDataOrUpdater;

            dispatch(setScheduleDates({
                selectionMode: newData.selectionMode,
                startDate: newData.startDate ? dayjs(newData.startDate).format('YYYY-MM-DD') : null,
                endDate: newData.endDate ? dayjs(newData.endDate).format('YYYY-MM-DD') : null,
                selectedDates: newData.selectedDates,
                isAllDay: newData.isAllDay,
                shiftRanges: newData.shiftRanges
            }));

            return newData;
        });
    };

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
                <ServiceDateAndTime data={dateTimeData} setData={handleSetData} />
            </Box>
        </Box>
    );
};

export default ScheduleSection;