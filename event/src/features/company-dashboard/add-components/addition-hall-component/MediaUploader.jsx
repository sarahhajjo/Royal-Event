import React from 'react';
import { Box, Typography, TextField, useTheme } from '@mui/material';

const MediaUploader = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const inputStyle = {
        // هذا الستايل موحد الآن ليكون بحدود شفافة ونمط متوافق
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: theme.palette.text.primary,
            borderRadius: '4px',
            // هنا تم ضبط الحدود لتكون شفافة كما طلبت
            border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused': {
                border: isDark ? '1px solid #c5a059' : '1px solid #b38c45',
                boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
            }
        },
        '& .MuiInputBase-input': {
            padding: '12px 16px',
            fontSize: '14px',
            '&::placeholder': { color: theme.palette.text.secondary, opacity: 1 }
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1.5
            }}>
                <Typography sx={{ color: theme.palette.text.primary, fontSize: '16px' }}>📦</Typography>
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Logistics & Media
                </Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                UPLOAD HALL IMAGES
            </Typography>
            <Box sx={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                p: 4,
                border: isDark ? '2px dashed rgba(78, 70, 57, 0.3)' : '2px dashed rgba(179, 140, 69, 0.35)',
                borderRadius: 2,
                textAlign: 'center',
                mb: 3
            }}>
                <Typography sx={{ color: theme.palette.text.secondary }}>Drag and drop high-resolution imagery here</Typography>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: '12px' }}>Supports JPG, PNG, WEBP (Max 20MB per file)</Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                SECONDARY CONTACT NUMBER (OPTIONAL)
            </Typography>
            <TextField fullWidth placeholder="+971 50 000 0000" sx={inputStyle} />
        </Box>
    );
};
export default MediaUploader;