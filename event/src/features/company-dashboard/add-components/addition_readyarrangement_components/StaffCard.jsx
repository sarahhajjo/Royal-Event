import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StaffCard = ({ name, role, phone, isSelected, isAvailable }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            width: 320,
            bgcolor: '#1a1817', // لون الخلفية الداكن
            border: '1px solid #c5a059', // إطار ذهبي
            borderRadius: 3,
            p: 2,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            {/* الجزء العلوي: الصورة والاسم */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src="https://via.placeholder.com/60" // استبدليها برابط الصورة الفعلي
                    alt={name}
                    sx={{ width: 60, height: 60, border: '2px solid #333' }}
                />
                <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 1.2 }}>
                        {name}
                    </Typography>
                    <Typography sx={{ color: '#c5a059', fontSize: '0.9rem' }}>
                        {role}
                    </Typography>
                </Box>

                {/* وسم SELECTED */}
                {isSelected && (
                    <Box sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: '#c5a059',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        px: 1,
                        py: 0.3,
                        borderRadius: 1
                    }}>
                        SELECTED
                    </Box>
                )}
            </Box>

            {/* رقم الهاتف */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#d1cdc7' }}>
                <PhoneIcon fontSize="small" />
                <Typography sx={{ fontSize: '0.95rem' }}>{phone}</Typography>
            </Box>

            {/* حالة التوفر */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecordIcon sx={{ fontSize: '0.8rem', color: isAvailable ? '#00c853' : '#f44336' }} />
                <Typography sx={{
                    color: isAvailable ? '#00c853' : '#f44336',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    {isAvailable ? 'AVAILABLE FOR SELECTED DATE' : 'NOT AVAILABLE'}
                </Typography>
            </Box>
        </Box>
    );
};

// مثال على الاستخدام:
// <StaffCard
//    name="Jameson Sterling"
//    role="Lead Photographer"
//    phone="+1 (555) 012-9844"
//    isSelected={true}
//    isAvailable={true}
// />

export default StaffCard;