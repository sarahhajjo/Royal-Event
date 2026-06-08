import React, { useState } from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Paper, useTheme, alpha } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const BookingDetailsBox = ({ data, setData }) => {
    const [pricing, setPricing] = useState('FIXED');
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const inputStyle = {
        width: '100%',
        mb: 3,
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
    };

    return (
        <Paper sx={{
            p: 4,
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ fontSize: '16px' }}>📅</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>Booking Details</Typography>
            </Box>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                AVAILABLE DATES
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            sx: {
                                width: '100%',
                                display: 'flex', // أضف هذا
                                flexDirection: 'column', // و
                                '& .MuiOutlinedInput-root': {
                                    color: '#eee0da',
                                    width: '100%',
                                    backgroundColor: '#131110 !important',
                                    border: '1px solid #261d19',
                                    borderRadius: '4px',
                                    '& fieldset': { border: 'none' }
                                },
                                '& .MuiSvgIcon-root': { color: '#8a7f70' }
                            }
                        }
                    }}
                />
            </LocalizationProvider>

            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mt: 2, mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                PRICING STRUCTURE
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, width: '100%' }}>
                {['FIXED', 'HOURLY'].map((type) => (
                    <Box key={type} onClick={() => setPricing(type)} sx={{
                        p: 1.5, flex: 1, textAlign: 'center', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        border: pricing === type ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                        backgroundColor: pricing === type ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                        color: pricing === type ? theme.palette.primary.main : theme.palette.text.secondary
                    }}>
                        {type} RATE
                    </Box>
                ))}
            </Box>

            <TextField
                fullWidth
                placeholder="25,000 USD"
                sx={{ ...inputStyle, width: '100%' }} // أضف width: '100%' هنا
            />
            <Typography sx={{ color: theme.palette.primary.main, mt: 3, mb: 2, fontWeight: 'bold' }}>
                Cancellation Policy
            </Typography>
            {['Cancellation before acceptance', 'Cancellation after acceptance', 'Cancellation before payment'].map(item => (
                <FormControlLabel key={item} control={<Checkbox sx={{ color: '#c5a059' }} />}
                                  label={<Typography sx={{ fontSize: '13px' }}>{item}</Typography>}
                                  sx={{ width: '100%', ml: 0, mr: 0 }}
                />
            ))}
        </Paper>
    );
};

export default BookingDetailsBox;