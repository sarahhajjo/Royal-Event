import React from 'react';
import { Box, Typography, TextField, Paper, useTheme } from '@mui/material';
import MenuItem from "@mui/material/MenuItem";
import {useSelector} from "react-redux";

const HallFormSection = ({ data, setData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { categories, districts } = useSelector((state) => state.addhall);
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
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>DISTRICTS</Typography>
                    <TextField
                        select
                        fullWidth
                        value={data.district_id || ''} // تأكدي من تسمية الحقل بشكل صحيح
                        onChange={(e) => setData({ ...data, district_id: e.target.value })}
                        sx={inputStyle}
                    >
                        {districts.map((dist) => (
                            <MenuItem key={dist.id} value={dist.id}>
                                {dist.name_en || dist.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>CATEGORY </Typography>
                    <TextField
                        select
                        fullWidth
                        value={data.category_id || ''}
                        onChange={(e) => setData({ ...data, category_id: e.target.value })}
                        sx={inputStyle}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name_en || cat.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Description</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Describe the ambiance..." sx={inputStyle} value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
        </Paper>
    );
};
export default HallFormSection;