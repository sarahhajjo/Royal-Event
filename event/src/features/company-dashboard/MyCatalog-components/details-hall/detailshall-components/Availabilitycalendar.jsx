import React, { useState, useMemo } from 'react';
import { Box, Typography, Divider, Paper, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeIcon   from '@mui/icons-material/AccessTimeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

// 💡 استيراد مكتبة الروزنامة الرسمية من MUI مع Day.js
// استبدلي الأسطر القديمة بهذه الأسطر:
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { PickerDay } from '@mui/x-date-pickers/PickerDay'; // 💡 هذا هو المسار الصحيح والمضمون
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

export default function AvailabilityCalendar({ availabilities = [], onBookSlot }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // 💡 تحويل المواعيد لقائمة يسهل البحث فيها باستخدام Day.js
    const availabilityMap = useMemo(() => {
        const map = {};
        availabilities.forEach(avail => {
            if (!avail.is_blocked) {
                const dateStr = dayjs(avail.available_date).format('YYYY-MM-DD');

                const slots = (avail.slots || []).map(s => {
                    // دالة ذكية لمعالجة الوقت سواء كان تاريخ كامل (يحوي T) أو مجرد وقت (20:00)
                    const formatTime = (timeString) => {
                        if (!timeString) return '';
                        if (timeString.includes('T')) {
                            return dayjs(timeString).format('hh:mm A'); // يعطي مثلاً 08:00 PM
                        }
                        // إذا كان فقط وقت، ندمجه مع تاريخ وهمي ليتمكن dayjs من قراءته
                        return dayjs(`2000-01-01T${timeString}`).format('hh:mm A');
                    };

                    const start = formatTime(s.start_time);
                    const end = formatTime(s.end_time);

                    // إرجاع الوقت فقط بدون اسم الشفت
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

    // 💡 تصميم مخصص للأيام داخل الروزنامة
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
                    disabled={!isAvailable} // تعطيل الأيام غير المتاحة
                    sx={{
                        // الأيام غير المتاحة: لون رمادي باهت ولكنه مرئي ومقروء
                        margin: '2px',
                        width: 'auto',
                        aspectRatio: '1/1', // ليظل دائرياً
                        height: 30, // 💡 زيادة الطول
                        fontSize: '1rem', // 💡 تكبير الخط ليتناسب مع المساحة
                        color: isAvailable ? theme.palette.text.primary : theme.palette.text.disabled,
                        fontWeight: isAvailable ? 700 : 400,

                        // الأيام المتاحة
                        ...(isAvailable && !isSelected && {
                            color: theme.palette.primary.main,
                            backgroundColor: isDark ? 'rgba(197, 160, 89, 0.08)' : 'rgba(197, 160, 89, 0.1)',
                            '&:hover': {
                                backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.2)',
                            }
                        }),

                        // اليوم المختار (Selected)
                        ...(isSelected && {
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            color: '#140e0c !important',
                            fontWeight: 800,
                        }),

                        // اليوم الحالي (Today)
                        '&.MuiPickersDay-today': {
                            border: `1px solid ${theme.palette.divider}`,
                        },
                        opacity: 1, // إجبار ظهور الأيام
                        '&.Mui-disabled': {
                            opacity: 1, // الأيام غير المتاحة تكون باهتة
                            pointerEvents: 'none',
                            color: theme.palette.text.primary,
                        },
                        '&.MuiPickersDay-root': {
                            border: 'none',
                        }
                    }}
                />
                {isAvailable && !isSelected && (
                    <Box sx={{ position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: '50%', backgroundColor: theme.palette.primary.main }} />
                )}
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={0} sx={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${border}`, borderRadius: 2, p: { xs: 2.5, sm: 3 }, mb: 2 }}>
                <SectionHeader icon={CalendarMonthOutlinedIcon} title="Availability & Booking" />
                <Divider sx={{ mb: 3, borderColor: border }} />

                <Grid container spacing={4} alignItems="stretch">

                    {/* ── 1. القسم الأيسر: الروزنامة (باستخدام مكتبة MUI) ── */}
                    {/* ── 1. القسم الأيسر: الروزنامة ── */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' ,width:500}}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            // 💡 توسيع كامل للحاوية
                            '& .MuiDateCalendar-root': {
                                width: '100%',
                                maxWidth: 500, // زيادة العرض
                                height: 'auto',
                                backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : 'transparent',
                                borderRadius: 2,
                                p: 2 // زيادة الفراغ الداخلي
                            },
                            '& .MuiPickersCalendarHeader-root': {
                                width: '100%',
                                maxWidth: 450, // توسيع الهيدر ليطابق حجم الروزنامة
                                margin: '0 auto',
                                paddingLeft: 0,
                                paddingRight: 0
                            },
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
                                width: 45, // زيادة حجم الدائرة قليلاً
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
                                bgcolor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
                                border: `1px dashed ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                            }}
                        >
                            {selectedDate && currentDaySlots.length > 0 ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                                        <AccessTimeIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary }}>
                                                Available Shifts For
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.primary }}>
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
                                                        backgroundColor: isSlotSelected ? (isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)') : (isDark ? 'rgba(255,255,255,0.03)' : '#fff'),
                                                        border: `1px solid ${isSlotSelected ? theme.palette.primary.main : border}`,
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                                        '&:hover': { borderColor: theme.palette.primary.main }
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: isSlotSelected ? 700 : 500, color: isSlotSelected ? theme.palette.primary.main : theme.palette.text.primary }}>
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
                                            mt: 5, backgroundColor: theme.palette.primary.main, color: '#18120f', fontSize: '0.85rem', fontWeight: 700, textTransform: 'none', py: 1.5, borderRadius: 2,
                                            '&:hover': { backgroundColor: '#d4ae6a' },
                                            '&.Mui-disabled': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }
                                        }}
                                    >
                                        Confirm Slot Selection
                                    </Button>
                                </>
                            ) : (
                                <Box sx={{ m: 'auto', textAlign: 'center', opacity: 0.6 }}>
                                    <EventAvailableOutlinedIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
                                    <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, px: 2 }}>
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