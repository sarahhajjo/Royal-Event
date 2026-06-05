import React from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HallFormSection = ({ data, setData }) => {
    const theme = useTheme();

    // نفس ستايل الحقول في الصورة تماماً
    const inputStyle = {
        mb: 3,
        '& .MuiOutlinedInput-root': {
            color: '#c5a059', // لون الخط داخل الحقل
            backgroundColor: '#131110', // خلفية الحقل
            borderRadius: '4px',
            '& fieldset': { borderColor: '#261d19' }, // حدود الحقل
            '&:hover fieldset': { borderColor: '#c5a059' },
            '&.Mui-focused fieldset': { borderColor: '#c5a059' }
        },
        '& .MuiInputBase-input::placeholder': {
            color: '#403d36', // لون البليس هولدر الباهت
            opacity: 1
        }
    };

    return (
        <Paper sx={{
            p: 4,
            backgroundColor: '#1c1512', // لون خلفية الـ Box كما في الصورة
            border: '1px solid #261d19',
            borderRadius: '8px',
            mb: 3
        }}>
            {/* العنوان مع أيقونة المجلد */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid rgba(154, 143, 128, 0.1)', pb: 1.5 }}>
                <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>📁</Typography>
                <Typography sx={{ color: '#c5a059', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>General Information</Typography>
            </Box>

            <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Hall Name</Typography>
            <TextField fullWidth placeholder="e.g. The Gilded Ballroom" sx={inputStyle} value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Governorate / Province</Typography>
                    <TextField fullWidth placeholder="Select location" sx={inputStyle} value={data.governorate} onChange={(e) => setData({...data, governorate: e.target.value})} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Approximate Capacity (Guests)</Typography>
                    <TextField fullWidth type="number" placeholder="500" sx={inputStyle} value={data.capacity} onChange={(e) => setData({...data, capacity: e.target.value})} />
                </Box>
            </Box>

            <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Description</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Describe the ambiance..." sx={inputStyle} value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
        </Paper>
    );
};

export default HallFormSection;