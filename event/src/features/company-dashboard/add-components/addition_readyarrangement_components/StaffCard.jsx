import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StaffCard = ({ name, role, phone, isSelected, isAvailable, availableDates }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            width: 250,
            bgcolor: '#1a1817',
            border: '1px solid #c5a059',
            borderRadius: 2,
            p: 1.5,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            // 💡 إذا لم يكن متاحاً، نقلل السطوع الكلي للكرت ليبدو معطلاً (disabled)
            opacity: isAvailable ? 1 : 0.6,
            transition: 'opacity 0.3s ease'
        }}>
            {/* الجزء العلوي: الصورة والاسم */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    src="https://via.placeholder.com/48"
                    alt={name}
                    sx={{ width: 48, height: 48, border: '1.5px solid #333' }}
                />
                <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>
                        {name}
                    </Typography>
                    <Typography sx={{ color: '#c5a059', fontSize: '0.75rem' }}>
                        {role}
                    </Typography>
                </Box>

                {/* وسم SELECTED */}
                {isSelected && (
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#c5a059',
                        color: '#000',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: '#d1cdc7', mt: 0.5 }}>

                {/* 💡 رقم الهاتف (أضفنا شرط ليظهر فقط إذا كان هناك رقم فعلياً) */}
                {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography sx={{ fontSize: '0.8rem' }}>{phone}</Typography>
                    </Box>
                )}

                {/* התواريخ المتاحة */}
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
                <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: isAvailable ? '#00c853' : '#f44336' }} />
                <Typography sx={{
                    color: isAvailable ? '#00c853' : '#f44336',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em'
                }}>
                    {isAvailable ? 'AVAILABLE FOR SELECTED DATE' : 'NOT AVAILABLE'}
                </Typography>
            </Box>
        </Box>
    );
};

export default StaffCard;