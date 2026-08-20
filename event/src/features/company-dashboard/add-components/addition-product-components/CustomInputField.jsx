import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {useTheme} from "@mui/material/styles";

const GOLD = '#c5a059';
const BROWN_TEXT = '#4a3b32';
const MUTED_TEXT = '#7a6652';
const LIGHT_CARD = 'linear-gradient(180deg, rgba(255, 248, 232, 0.60) 0%, rgba(225, 190, 115, 0.25) 100%)';
const LIGHT_INPUT = 'rgba(255, 255, 255, 0.55)';
const LIGHT_BORDER = 'rgba(197, 160, 89, 0.4)';

const CustomInputField = ({
                              label, placeholder, value, onChange, type = 'text',
                              multiline = false, rows = 1, sx,
                              editMode = false, isModified = false,
                              ...props
                          }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Typography variant="caption" sx={{ color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px' }}>
                {label}
            </Typography>
            <TextField
                fullWidth type={type} placeholder={placeholder} multiline={multiline}
                rows={rows} value={value} onChange={onChange} variant="outlined"
                {...props}
                sx={[
                    {
                        '& .MuiOutlinedInput-root': {
                            background: isDark ? 'linear-gradient(180deg, rgba(17, 22, 36, 0.88) 0%, rgba(16, 21, 31, 0.86) 100%)' : LIGHT_CARD,
                            color: isDark ? '#ffffff' : BROWN_TEXT,
                            borderRadius: '14px',
                            border: isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${LIGHT_BORDER}`,
                            transition: 'border-color 0.3s ease',
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'transparent' },
                            '&.Mui-focused': {
                                border: `1px solid ${GOLD}`,
                                boxShadow: isDark ? '0 18px 40px rgba(0,0,0,0.22)' : '0 18px 40px rgba(130, 100, 40, 0.10)'
                            }
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: isDark ? '#ffffff' : BROWN_TEXT,
                            '&::placeholder': { color: isDark ? 'rgba(255,255,255,0.42)' : MUTED_TEXT, opacity: 1 }
                        },
                        '& .MuiInputLabel-root': {
                            color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT
                        }
                    },
                    ...(Array.isArray(sx) ? sx : [sx])
                ]}
            />
        </Box>
    );
};

export default CustomInputField;