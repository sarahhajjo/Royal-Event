import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStaff, removeStaff, selectFilteredFreelancers } from '../addition_slices/arrangementSlice';
import StaffCard from './StaffCard';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';
const StaffSelector = ({ filterService }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isDark = theme.palette.mode === 'dark';
    const selectedStaff = useSelector(state => state.arrangement.selectedStaff);

    const staffList = useSelector(selectFilteredFreelancers) || [];

    const filteredStaff = filterService === 'All'
        ? staffList.filter(s => s.isAvailable)
        : staffList.filter(s => (s.service_name === filterService || s.role === filterService) && s.isAvailable);

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
            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : theme.palette.text.primary, fontWeight: 'bold', mb: 3, fontSize: '0.9rem' }}>
                ASSIGN AVAILABLE STAFF
            </Typography>

            {filteredStaff.length === 0 ? (
                <Box sx={{ p: 3, borderRadius: 2, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.12)' : LIGHT_BORDER}`, textAlign: 'center' }}>
                    <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : theme.palette.text.secondary, fontStyle: 'italic', fontSize: '0.9rem' }}>
                        No staff available for the selected dates or service.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : theme.palette.divider, borderRadius: '4px' } }}>
                    {filteredStaff.map((staff, index) => {
                        const isSelected = selectedStaff.find(s => s.id === staff.id);
                        return (
                            <Box
                                key={staff.id || index}
                                onClick={() => handleToggleStaff(staff)}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderRadius: 2,
                                    boxShadow: isSelected ? `0 0 12px ${theme.palette.primary.main}` : 'none',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                <StaffCard
                                    name={staff.name}
                                    role={staff.role}
                                    phone={staff.phone}
                                    email={staff.email}
                                    availableDates={staff.availableDates}
                                    blockedDates={staff.blockedDates}
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