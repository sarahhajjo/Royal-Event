import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

const CustomInputField = ({ label, placeholder, value, onChange, type = 'text', multiline = false, rows = 1, sx, ...props }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Typography variant="caption" sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                {label}
            </Typography>
            <TextField
                fullWidth
                type={type}
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
                value={value}
                onChange={onChange}
                variant="outlined"
                {...props}
                sx={[
                    {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
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
                    },
                    // دمج الستايل الإضافي (للتصغير داخل الكرت) إن وُجد
                    ...(Array.isArray(sx) ? sx : [sx])
                ]}
            />
        </Box>
    );
};

export default CustomInputField;