import React from 'react';
import { Box, Typography, TextField, Paper, useTheme } from '@mui/material';

const HallFormSection = ({ data, setData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const inputStyle = {
        mb: 3,
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', // ☀️ حقول بيضاء شفافة وناعمة في الوضع الفاتح
            color: isDark ? '#eee0da' : '#2B211E',
            borderRadius: '4px',
            border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused': {
                border: isDark ? '1px solid #c5a059' : '1px solid #b38c45',
                boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
            }
        },
        '& .MuiOutlinedInput-input': {
            padding: '12px 16px',
            fontSize: '14px',
            '&::placeholder': { color: isDark ? '#5a5043' : '#7A6F5E', opacity: 1 }
        }
    };

    return (
        <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ color: theme.palette.primary.main, fontSize: '16px' }}>📁</Typography>
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>General Information</Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Hall Name</Typography>
            <TextField fullWidth placeholder="e.g. The Gilded Ballroom" sx={inputStyle} value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Governorate / Province</Typography>
                    <TextField fullWidth placeholder="Select location" sx={inputStyle} value={data.governorate} onChange={(e) => setData({...data, governorate: e.target.value})} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Approximate Capacity (Guests)</Typography>
                    <TextField fullWidth type="number" placeholder="500" sx={inputStyle} value={data.capacity} onChange={(e) => setData({...data, capacity: e.target.value})} />
                </Box>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Description</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Describe the ambiance..." sx={inputStyle} value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
        </Paper>
    );
};
export default HallFormSection;