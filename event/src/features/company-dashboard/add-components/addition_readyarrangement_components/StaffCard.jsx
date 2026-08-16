import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'; // 💡 استيراد أيقونة الإيميل
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';

const StaffCard = ({ name, role, phone, email, isSelected, isAvailable, availableDates }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 💡 منطق تحديد معلومات التواصل المعروضة
    let ContactIcon = PhoneIcon;
    let contactText = 'Not Provided';

    // إذا كان هناك رقم هاتف
    if (phone && phone !== 'Not Provided' && phone !== 'No contact info') {
        ContactIcon = PhoneIcon;
        contactText = phone;
    }
    // إذا لم يوجد رقم، نعرض الإيميل
    else if (email) {
        ContactIcon = MailOutlinedIcon;
        contactText = email;
    }

    return (
        <Box sx={{
            width: 250,
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
                    alt={name}
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: isDark ? 'rgba(197, 160, 89, 0.18)' : 'rgba(179, 140, 69, 0.15)',
                        color: 'primary.main',
                        border: `1px solid ${theme.palette.divider}`,
                        fontWeight: 'bold'
                    }}
                >
                    {name?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Box sx={{ overflow: 'hidden' }}>
                    <Typography noWrap sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        lineHeight: 1.2
                    }}>
                        {name}
                    </Typography>
                    <Typography noWrap sx={{
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

            {/* رقم الهاتف / الإيميل والتواريخ المتاحة */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: theme.palette.text.secondary, mt: 0.5 }}>

                {/* 💡 عرض أيقونة ومعلومة التواصل الديناميكية */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactIcon sx={{ fontSize: '1.1rem', opacity: 0.8 }} />
                    <Typography noWrap sx={{ fontSize: '0.8rem', opacity: contactText === 'Not Provided' ? 0.6 : 1 }}>
                        {contactText}
                    </Typography>
                </Box>

                {availableDates && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1.1rem', mt: 0.2, opacity: 0.8 }} />
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
                    color: isAvailable ? '#2e7d32' : '#d32f2f'
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