import React, {useState} from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const BookingDetailsBox = ({ data, setData }) => {
    // تم توحيد الاسم إلى inputStyle
    const [pricing, setPricing] = useState('FIXED');
    const inputStyle = {
        mb: 2,
        '& .MuiOutlinedInput-root': {
            color: '#eee0da',
            backgroundColor: '#131110',
            border: '1px solid #261d19',
            borderRadius: '4px',
            fontSize: '14px', // خط أصغر وأنحف
            '& fieldset': { border: 'none' }
        }
    };

    // ستايل العنوان الفرعي ليكون غير سميك


    return (
        <Paper sx={{
            p: 4,
            border: '1px solid #261d19',
            borderRadius: '8px',
            backgroundColor: '#1c1512',
            mb: 3
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                borderBottom: '1px solid rgba(154, 143, 128, 0.1)',
                pb: 1.5
            }}>
                <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>📅</Typography>
                <Typography sx={{ color: '#c5a059', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>
                    Booking Details
                </Typography>
            </Box>

            <Typography sx={{ color: '#c5a059', fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                AVAILABLE DATES
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            sx: {
                                '& .MuiOutlinedInput-root': {
                                    color: '#eee0da', // لون النص عند الكتابة
                                    backgroundColor: '#131110 !important',
                                    border: '1px solid #261d19',
                                    borderRadius: '4px',
                                    '& fieldset': { border: 'none' }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#131110', // لون الـ MM/DD/YYYY
                                    opacity: 1
                                },
                                // تغيير لون أيقونة الروزنامة
                                '& .MuiSvgIcon-root': {
                                    color: '#8a7f70' // اللون الباهت للأيقونة
                                }
                            }
                        }
                    }}
                />
            </LocalizationProvider>

            <Typography sx={{ color: '#c5a059', fontSize: '11px', mt: 2, mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>
                PRICING STRUCTURE
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                    onClick={() => setPricing('FIXED')}
                    sx={{ p: 1.5, border: pricing === 'FIXED' ? '1px solid #c5a059' : '1px solid transparent', color: pricing === 'FIXED' ? '#c5a059' : '#403d36', flex: 1, textAlign: 'center', cursor: 'pointer', borderRadius: '4px', backgroundColor: pricing === 'FIXED' ? 'transparent' : '#131110', fontSize: '12px', fontWeight: 400 }}>
                    FIXED RATE
                </Box>
                <Box
                    onClick={() => setPricing('HOURLY')}
                    sx={{ p: 1.5, border: pricing === 'HOURLY' ? '1px solid #c5a059' : '1px solid transparent', color: pricing === 'HOURLY' ? '#c5a059' : '#403d36', flex: 1, textAlign: 'center', cursor: 'pointer', borderRadius: '4px', backgroundColor: pricing === 'HOURLY' ? 'transparent' : '#131110', fontSize: '12px', fontWeight: 400 }}>
                    HOURLY RATE
                </Box>
            </Box>
            <TextField fullWidth placeholder="25,000 USD" sx={inputStyle} />

            <Typography sx={{ color: '#c5a059', mt: 3, mb: 2, fontWeight: 'bold' }}>
                Cancellation Policy
            </Typography>

            {['Cancellation before acceptance', 'Cancellation after acceptance', 'Cancellation before payment'].map(item => (
                <FormControlLabel
                    key={item}
                    // الـ control هو الـ Checkbox
                    control={
                        <Checkbox
                            sx={{
                                color: '#c5a059',
                                '&.Mui-checked': { color: '#c5a059' }
                            }}
                        />
                    }
                    // الـ label هو النص، سيظهر بجانب الـ Checkbox تلقائياً
                    label={
                        <Typography sx={{ fontSize: '13px', color: '#eee0da' }}>
                            {item}
                        </Typography>
                    }
                    // تأكدي من إزالة display: 'block' لكي لا يجبر النص على النزول لسطر جديد
                    sx={{
                        display: 'flex',
                        mb: 0.5,
                        ml: 0 // إزالة أي مسافة زائدة في البداية
                    }}
                />
            ))}
        </Paper>
    );
};

export default BookingDetailsBox;