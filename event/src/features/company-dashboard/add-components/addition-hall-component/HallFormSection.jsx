import React from 'react';
import { Box, Typography, TextField, Paper, useTheme, MenuItem } from '@mui/material';
import { useSelector } from "react-redux";

const HallFormSection = ({ data, setData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { categories, districts } = useSelector((state) => state.addhall);

    // 💡 دالة لتلوين الإطار بناءً على التعديل
    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.35)';
        if (editMode) {
            const isModified = String(currentValue || '') !== String(originalData?.[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50'; // أصفر إذا تعدل، أخضر إذا قديم
        }

        return {
            mb: 3,
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                color: isDark ? '#eee0da' : '#2B211E',
                borderRadius: '4px',
                border: `1px solid ${borderColor}`, // 💡 تطبيق اللون
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': {
                    border: `1px solid ${editMode ? borderColor : (isDark ? '#c5a059' : '#b38c45')}`,
                    boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
                }
            },
            '& .MuiOutlinedInput-input': {
                padding: '12px 16px',
                fontSize: '14px',
                '&::placeholder': { color: isDark ? '#5a5043' : '#7A6F5E', opacity: 1 }
            }
        };
    };

    return (
        <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ color: theme.palette.primary.main, fontSize: '16px' }}>📁</Typography>
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>General Information</Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Hall Name</Typography>
            <TextField fullWidth placeholder="e.g. The Gilded Ballroom" sx={getFieldStyle('name', data.name)} value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>DISTRICTS</Typography>
                    <TextField select fullWidth value={data.district_id || ''} onChange={(e) => setData({ ...data, district_id: e.target.value })} sx={getFieldStyle('district_id', data.district_id)}>
                        {districts.map((dist) => {
                            // 💡 استخراج الاسم الصحيح للـ District
                            const distName = typeof dist.name === 'object' ? (dist.name?.en || dist.name?.ar) : dist.name;
                            return (
                                <MenuItem key={dist.id} value={dist.id}>
                                    {distName || `District ${dist.id}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>CATEGORY </Typography>
                    <TextField select fullWidth value={data.category_id || ''} onChange={(e) => setData({ ...data, category_id: e.target.value })} sx={getFieldStyle('category_id', data.category_id)}>
                        {categories.map((cat) => {
                            // 💡 استخراج الاسم الصحيح للـ Category
                            const catName = typeof cat.name === 'object' ? (cat.name?.en || cat.name?.ar) : cat.name;
                            return (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {catName || `Category ${cat.id}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Box>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Description</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Describe the ambiance..." sx={getFieldStyle('description', data.description)} value={data.description || ''} onChange={(e) => setData({...data, description: e.target.value})} />
        </Paper>
    );
};
export default HallFormSection;