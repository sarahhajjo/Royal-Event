import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

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
                        color: isDark ? '#c5a059' : '#b38c45',
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
                            color: isDark ? '#eee0da' : '#2B211E',
                            backgroundColor: 'transparent',
                            pt: 0.4,
                            pb: 0.4,
                            fontSize: '15px',
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.3s ease',
                            '& input': { py: 0.2, height: '20px', lineHeight: '20px' },
                            '&:before': { borderBottom: isDark ? '1px solid rgba(78, 70, 57, 0.45) !important' : '1px solid rgba(122, 111, 94, 0.45) !important' },
                            '&:after': { borderBottom: isDark ? '2px solid #c5a059' : '2px solid #b38c45' },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: isDark ? '0 0 0 100px #18120f inset !important' : '0 0 0 100px #FAF0D5 inset !important',
                                WebkitTextFillColor: isDark ? '#eee0da !important' : '#2B211E !important',
                            },
                            '& input::placeholder': {
                                color: isDark ? '#5a5043' : '#7A6F5E',
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