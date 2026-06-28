import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StaffCard = ({ name, role, phone, isSelected, isAvailable, availableDates }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            width: 250,
            // 💡 تغيير الخلفية والحدود لتناسب أي وضع
            bgcolor: theme.palette.background.paper,
            border: isSelected
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
            borderRadius: 2,
            p: 1.5,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            boxShadow: theme.shadows[2],
            opacity: isAvailable ? 1 : 0.6,
            transition: 'all 0.3s ease'
        }}>
            {/* الجزء العلوي: الصورة والاسم */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    src="https://via.placeholder.com/48"
                    alt={name}
                    sx={{
                        width: 48,
                        height: 48,
                        border: `1.5px solid ${isDark ? '#333' : '#ddd'}`
                    }}
                />
                <Box>
                    <Typography sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        lineHeight: 1.2
                    }}>
                        {name}
                    </Typography>
                    <Typography sx={{
                        color: theme.palette.primary.main,
                        fontSize: '0.75rem'
                    }}>
                        {role}
                    </Typography>
                </Box>

                {/* وسم SELECTED */}
                {isSelected && (
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1
                    }}>
                        SELECTED
                    </Box>
                )}
            </Box>

            {/* رقم الهاتف والتواريخ المتاحة */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: theme.palette.text.secondary, mt: 0.5 }}>

                {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography sx={{ fontSize: '0.8rem' }}>{phone}</Typography>
                    </Box>
                )}

                {availableDates && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1.1rem', mt: 0.2 }} />
                        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                            {availableDates}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* حالة التوفر */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                <FiberManualRecordIcon sx={{
                    fontSize: '0.7rem',
                    color: isAvailable ? '#2e7d32' : '#d32f2f' // ألوان قياسية تظهر في كلا الوضعين
                }} />
                <Typography sx={{
                    color: isAvailable ? '#2e7d32' : '#d32f2f',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                }}>
                    {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
                </Typography>
            </Box>
        </Box>
    );
};

export default StaffCard;