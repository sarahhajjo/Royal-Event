import React from 'react';
import { Box, Typography, TextField, Paper, useTheme, MenuItem } from '@mui/material';
import { useSelector } from "react-redux";

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const HallFormSection = ({ data, setData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { categories, districts } = useSelector((state) => state.addhall);

    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
        if (editMode) {
            const isModified = String(currentValue || '') !== String(originalData?.[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }

        return {
            mb: 3,
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                borderRadius: '4px',
                border: borderColor.includes('solid') ? borderColor : `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': {
                    border: `1px solid ${editMode ? borderColor : GOLD}`,
                    boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
                }
            },
            '& .MuiOutlinedInput-input': {
                padding: '12px 16px',
                fontSize: '14px',
                '&::placeholder': { color: isDark ? 'rgba(255,255,255,0.4)' : '#7A6F5E', opacity: 1 }
            }
        };
    };

    // 💡 تلوين القوائم المنسدلة للـ Categories و Districts
    const menuPropsStyle = {
        PaperProps: {
            sx: {
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                backdropFilter: 'blur(16px)',
                backgroundImage: 'none'
            }
        }
    };

    return (
        <Paper sx={{
            p: 4,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px',
            mb: 3,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                <Typography sx={{ color: GOLD, fontSize: '16px' }}>📁</Typography>
                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>General Information</Typography>
            </Box>

            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Hall Name</Typography>
            <TextField fullWidth placeholder="e.g. The Gilded Ballroom" sx={getFieldStyle('name', data.name)} value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>DISTRICTS</Typography>
                    <TextField select fullWidth value={data.district_id || ''} onChange={(e) => setData({ ...data, district_id: e.target.value })} sx={getFieldStyle('district_id', data.district_id)} SelectProps={{ MenuProps: menuPropsStyle }}>
                        {districts.map((dist) => {
                            const distName = typeof dist.name === 'object' ? (dist.name?.en || dist.name?.ar) : dist.name;
                            return <MenuItem key={dist.id} value={dist.id}>{distName || `District ${dist.id}`}</MenuItem>;
                        })}
                    </TextField>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>CATEGORY </Typography>
                    <TextField select fullWidth value={data.category_id || ''} onChange={(e) => setData({ ...data, category_id: e.target.value })} sx={getFieldStyle('category_id', data.category_id)} SelectProps={{ MenuProps: menuPropsStyle }}>
                        {categories.map((cat) => {
                            const catName = typeof cat.name === 'object' ? (cat.name?.en || cat.name?.ar) : cat.name;
                            return <MenuItem key={cat.id} value={cat.id}>{catName || `Category ${cat.id}`}</MenuItem>;
                        })}
                    </TextField>
                </Box>
            </Box>

            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Description</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Describe the ambiance..." sx={getFieldStyle('description', data.description)} value={data.description || ''} onChange={(e) => setData({...data, description: e.target.value})} />
        </Paper>
    );
};
export default HallFormSection;