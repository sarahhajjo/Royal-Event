import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import { setScheduleDates } from '../addition_slices/arrangementSlice';
import ServiceDateAndTime from './ServiceDateAndTime';
import dayjs from 'dayjs';

// 💡 تم حذف السطر القديم لعدم تكرار تعريف GOLD
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const ScheduleSection = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

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
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: 3,
            width: 1020,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Typography sx={{ color: GOLD, fontWeight: 'bold', mb: 3, fontSize: '1rem', letterSpacing: '0.02em' }}>
                ARRANGEMENT SCHEDULE
            </Typography>

            <Box sx={{
                background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                p: 3,
                borderRadius: 2,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                backdropFilter: 'blur(8px)'
            }}>
                <ServiceDateAndTime data={dateTimeData} setData={handleSetData} />
            </Box>
        </Box>
    );
};

export default ScheduleSection;