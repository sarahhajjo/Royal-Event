import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// 💡 استدعاء الألوان الموحدة
import { GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_BORDER, DARK_CARD_BORDER } from '../utils/colorConstants';

function InputField({ label, type = 'text', placeholder, value, onChange, children }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mb: 0.5 }}>
            {label && (
                <Box
                    component="label"
                    sx={{
                        fontSize: '11px',
                        fontWeight: 400,
                        color: GOLD, // 💡 توحيد لون الـ Label
                        textTransform: 'uppercase',
                        letterSpacing: '0.25em'
                    }}
                >
                    {label}
                </Box>
            )}

            <TextField
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                fullWidth
                variant="standard"
                slotProps={{
                    input: {
                        endAdornment: children ? (
                            <InputAdornment position="end" sx={{ position: 'absolute', right: 0, bottom: '4px' }}>
                                {children}
                            </InputAdornment>
                        ) : null,
                        disableUnderline: false,
                        sx: {
                            color: isDark ? '#ffffff' : BROWN_TEXT, // 💡 توحيد لون النص
                            backgroundColor: 'transparent',
                            pt: 0.4,
                            pb: 0.4,
                            fontSize: '15px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.3s ease',
                            '& input': { py: 0.2, height: '20px', lineHeight: '20px' },
                            // 💡 توحيد لون الخط السفلي قبل وبعد التحديد
                            '&:before': { borderBottom: isDark ? `${DARK_CARD_BORDER} !important` : `1px solid ${LIGHT_BORDER} !important` },
                            '&:after': { borderBottom: `2px solid ${GOLD}` },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: isDark ? '0 0 0 100px #1a1520 inset !important' : '0 0 0 100px #fdf7ed inset !important',
                                WebkitTextFillColor: isDark ? '#ffffff !important' : `${BROWN_TEXT} !important`,
                            },
                            '& input::placeholder': {
                                color: isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT, // 💡 توحيد لون الـ Placeholder
                                opacity: 0.7,
                                fontSize: '14px'
                            }
                        }
                    }
                }}
                sx={{ '& .MuiInput-root': { position: 'relative' } }}
            />
        </Box>
    );
}

export default InputField;