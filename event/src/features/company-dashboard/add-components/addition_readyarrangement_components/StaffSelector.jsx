import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStaff, removeStaff } from '../addition_slices/arrangementSlice';
import StaffCard from './StaffCard';
import dayjs from 'dayjs'; // 💡 استيراد مكتبة التاريخ لمقارنة التواريخ

const StaffSelector = ({ filterService }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const selectedStaff = useSelector(state => state.arrangement.selectedStaff);

    // قراءة التواريخ المحددة من الريدكس
    const scheduleDates = useSelector(state => state.arrangement.scheduleDates);

    // 💡 تعديل الداتا الوهمية: إضافة start و end كتواريخ فعلية بدل النص عشان نقدر نقارنهم برمجياً
    const staffList = [
        {
            id: 1, name: 'Jameson', role: 'Photography', status: 'available', phone: '+1 (555) 012-9844',
            availableText: 'Oct 15 - Oct 22, 2026',
            availStart: '2026-10-15', availEnd: '2026-10-22'
        },
        {
            id: 2, name: 'Elena', role: 'Planning', status: 'available', phone: '+1 (555) 012-9855',
            availableText: 'Oct 16 - Oct 20, 2026',
            availStart: '2026-10-16', availEnd: '2026-10-20'
        },
        {
            id: 3, name: 'Marcello', role: 'Security', status: 'booked', phone: '+1 (555) 012-9877',
            availableText: 'Nov 05 - Nov 12, 2026',
            availStart: '2026-11-05', availEnd: '2026-11-12'
        },
    ];

    // 1. الفلترة الأولى: حسب الخدمة (Service)
    let filteredStaff = filterService === 'All'
        ? staffList
        : staffList.filter(s => s.role.includes(filterService));

    // 2. الفلترة الثانية: حسب التواريخ (Dates)
    if (scheduleDates) {
        const { startDate, endDate, selectedDates } = scheduleDates;
        const hasRange = startDate && endDate;
        const hasMultiple = selectedDates && selectedDates.length > 0;

        if (hasRange || hasMultiple) {
            filteredStaff = filteredStaff.filter(staff => {
                // إذا الموظف محجوز سلفاً، استبعده فوراً
                if (staff.status === 'booked') return false;

                const sStart = dayjs(staff.availStart);
                const sEnd = dayjs(staff.availEnd);

                // 💡 الفحص الأول: إذا المستخدم اختار Date Range
                if (hasRange) {
                    const userStart = dayjs(startDate);
                    const userEnd = dayjs(endDate);
                    // الموظف متاح إذا كانت فترة عمله تغطي فترة الحدث بالكامل
                    return (sStart.isBefore(userStart) || sStart.isSame(userStart)) &&
                        (sEnd.isAfter(userEnd) || sEnd.isSame(userEnd));
                }

                // 💡 الفحص الثاني: إذا المستخدم اختار أياماً متفرقة (Multiple Days)
                if (hasMultiple) {
                    // الموظف متاح إذا كان "كل" يوم اختاره المستخدم يقع ضمن فترة عمله
                    return selectedDates.every(dateStr => {
                        const d = dayjs(dateStr);
                        return (d.isAfter(sStart) || d.isSame(sStart)) &&
                            (d.isBefore(sEnd) || d.isSame(sEnd));
                    });
                }

                return true;
            });
        }
    }
    const handleToggleStaff = (staff) => {
        if (staff.status === 'booked') return;
        const isSelected = selectedStaff.find(s => s.id === staff.id);
        if (isSelected) {
            dispatch(removeStaff(staff.id));
        } else {
            dispatch(addStaff(staff));
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    mb: 3,
                    fontSize: '0.9rem'
                }}
            >
                ASSIGN AVAILABLE STAFF
            </Typography>

            {/* عرض رسالة إذا الفلترة خلت القائمة فاضية (لا يوجد موظف متاح بهذا التاريخ) */}
            {filteredStaff.length === 0 ? (
                <Box sx={{ p: 3, borderRadius: 2, border: `1px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
                    <Typography sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', fontSize: '0.9rem' }}>
                        No staff available for the selected dates or service. Please try adjusting your schedule.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 2,
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: theme.palette.divider, borderRadius: '4px' }
                }}>
                    {filteredStaff.map(staff => {
                        const isSelected = selectedStaff.find(s => s.id === staff.id);
                        return (
                            <Box
                                key={staff.id}
                                onClick={() => handleToggleStaff(staff)}
                                sx={{
                                    cursor: staff.status === 'booked' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderRadius: 3,
                                    boxShadow: isSelected ? `0 0 12px ${theme.palette.primary.main}` : 'none',
                                    '&:hover': {
                                        transform: staff.status !== 'booked' ? 'translateY(-4px)' : 'none'
                                    }
                                }}
                            >
                                <StaffCard
                                    name={staff.name}
                                    role={staff.role}
                                    phone={staff.phone}
                                    availableDates={staff.availableText} // نمرر النص للعرض
                                    isSelected={!!isSelected}
                                    isAvailable={staff.status === 'available'}
                                />
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default StaffSelector;