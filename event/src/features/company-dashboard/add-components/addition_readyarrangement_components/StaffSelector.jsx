import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStaff, removeStaff } from '../addition_slices/arrangementSlice';
import StaffCard from './StaffCard';
import dayjs from 'dayjs';

const StaffSelector = ({ filterService }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const selectedStaff = useSelector(state => state.arrangement.selectedStaff);
    const scheduleDates = useSelector(state => state.arrangement.scheduleDates);

    // 💡 1. نجلب البيانات الجاهزة من السلايس مباشرة (فيها name, role, phone, email)
    const staffList = useSelector(state => state.arrangement.freelancers) || [];

    // 💡 2. الفلترة الأولى: حسب الخدمة (Service)
    let filteredStaff = filterService === 'All'
        ? staffList
        : staffList.filter(s => s.service_name === filterService || s.role === filterService);

    // 💡 3. الفلترة الثانية: التواريخ
    if (scheduleDates) {
        const { startDate, endDate, selectedDates } = scheduleDates;
        const hasRange = startDate && endDate;
        const hasMultiple = selectedDates && selectedDates.length > 0;

        if (hasRange || hasMultiple) {
            filteredStaff = filteredStaff.filter(staff => {
                if (!staff.isAvailable) return false;

                const sStart = dayjs(staff.availStart);
                const sEnd = dayjs(staff.availEnd);

                if (hasRange) {
                    const userStart = dayjs(startDate);
                    const userEnd = dayjs(endDate);
                    return (sStart.isBefore(userStart) || sStart.isSame(userStart)) &&
                        (sEnd.isAfter(userEnd) || sEnd.isSame(userEnd));
                }

                if (hasMultiple) {
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
        if (!staff.isAvailable) return;
        const isSelected = selectedStaff.find(s => s.id === staff.id);
        if (isSelected) {
            dispatch(removeStaff(staff.id));
        } else {
            dispatch(addStaff(staff));
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', mb: 3, fontSize: '0.9rem' }}>
                ASSIGN AVAILABLE STAFF
            </Typography>

            {filteredStaff.length === 0 ? (
                <Box sx={{ p: 3, borderRadius: 2, border: `1px dashed ${theme.palette.divider}`, textAlign: 'center' }}>
                    <Typography sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', fontSize: '0.9rem' }}>
                        No staff available for the selected dates or service.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { bgcolor: theme.palette.divider, borderRadius: '4px' } }}>
                    {filteredStaff.map((staff, index) => {
                        const isSelected = selectedStaff.find(s => s.id === staff.id);
                        return (
                            <Box
                                key={staff.id || index}
                                onClick={() => handleToggleStaff(staff)}
                                sx={{
                                    cursor: !staff.isAvailable ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderRadius: 3,
                                    boxShadow: isSelected ? `0 0 12px ${theme.palette.primary.main}` : 'none',
                                    '&:hover': { transform: staff.isAvailable ? 'translateY(-4px)' : 'none' }
                                }}
                            >
                                <StaffCard
                                    name={staff.name}
                                    role={staff.role}
                                    phone={staff.phone}
                                    email={staff.email} // 💡 هنا نمرر الإيميل ليعمل الكرت بذكاء
                                    availableDates={staff.availableDates}
                                    isSelected={!!isSelected}
                                    isAvailable={staff.isAvailable}
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