import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStaff, removeStaff } from '../addition_slices/arrangementSlice';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StaffSelector = ({ filterService }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const selectedStaff = useSelector(state => state.arrangement.selectedStaff);

    const staffList = [
        { id: 1, name: 'Jameson', role: 'Photography', status: 'available', phone: '+1 (555) 012-9844' },
        { id: 2, name: 'Elena', role: 'Planning', status: 'available', phone: '+1 (555) 012-9855' },
        { id: 3, name: 'Marcello', role: 'Security', status: 'booked', phone: '' },

    ];

    const filteredStaff = filterService === 'All'
        ? staffList
        : staffList.filter(s => s.role.includes(filterService));

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
                    fontSize: '0.9rem' // يمكنكِ تغيير هذه القيمة (مثلاً 0.8rem أو 14px) حسب رغبتك
                }}
            >
                ASSIGN AVAILABLE STAFF
            </Typography>

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
                                minWidth: 280,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: theme.palette.background.paper, // استخدام خلفية الـ paper من الثيم
                                cursor: staff.status === 'booked' ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                border: isSelected ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                                boxShadow: isSelected ? `0 0 10px ${theme.palette.primary.main}` : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 50, height: 50 }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                                        {staff.name}
                                    </Typography>
                                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '0.8rem' }}>
                                        {staff.role}
                                    </Typography>
                                </Box>
                                {isSelected && (
                                    <Box sx={{
                                        ml: 'auto',
                                        bgcolor: theme.palette.action.selected,
                                        color: theme.palette.primary.main,
                                        px: 1,
                                        borderRadius: 1,
                                        fontSize: '0.7rem'
                                    }}>
                                        SELECTED
                                    </Box>
                                )}
                            </Box>

                            {staff.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.secondary }}>
                                    <PhoneIcon fontSize="small" />
                                    <Typography variant="body2">{staff.phone}</Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FiberManualRecordIcon sx={{
                                    fontSize: '0.7rem',
                                    color: staff.status === 'booked' ? theme.palette.text.disabled : '#4caf50'
                                }} />
                                <Typography sx={{
                                    fontSize: '0.8rem',
                                    color: staff.status === 'booked' ? theme.palette.text.disabled : '#4caf50',
                                    textTransform: 'uppercase'
                                }}>
                                    {staff.status === 'booked' ? 'NOT AVAILABLE' : 'AVAILABLE ON SELECTED DATE'}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default StaffSelector;