import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Paper, useTheme, alpha, Grid, Autocomplete } from '@mui/material';
import cc from 'currency-codes';

// 1. استخراج البيانات بشكل غني (الرمز + الاسم) للبحث
const CURRENCY_OPTIONS = cc.data.map(c => ({
    code: c.code,
    label: `${c.code} - ${c.currency}` // سيعرض: SAR - Saudi Riyal
}));

export default function BookingDetailsBox({ data, setData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: isDark ? '#eee0da' : '#2B211E',
            borderRadius: '4px',
            border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
            '& fieldset': { borderColor: 'transparent' },
        }
    };

    // 2. إيجاد الكائن المحدد حالياً ليتعرف عليه الـ Autocomplete
    const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === (data.currency || 'SAR')) || CURRENCY_OPTIONS.find(c => c.code === 'SAR');

    return (
        <Paper className="booking-details-section" sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1.5 }}>
                <Typography sx={{ fontSize: '16px' }}>💰</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em' }}>Booking Details</Typography>
            </Box>

            <Grid container spacing={4} alignItems="flex-start">

                <Grid item xs={12} md={7}>
                    <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Pricing Structure</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {['FIXED', 'HOURLY'].map((type) => (
                            <Box key={type} onClick={() => setData({ ...data, priceType: type.toLowerCase() })}
                                 sx={{ p: 1.5, flex: 1, textAlign: 'center', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                     border: data.priceType === type.toLowerCase() ? `1px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                                     backgroundColor: data.priceType === type.toLowerCase() ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                                     color: data.priceType === type.toLowerCase() ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                {type} RATE
                            </Box>
                        ))}
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Price</Typography>
                            <TextField fullWidth type="number" placeholder="e.g. 25,000" value={data.price || ''} onChange={(e) => setData({ ...data, price: e.target.value })} sx={inputStyle} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Currency</Typography>
                            {/* 3. استبدال الـ TextField بمكون Autocomplete الرائع */}
                            <Autocomplete
                                options={CURRENCY_OPTIONS}
                                getOptionLabel={(option) => option.label} // النص الذي يظهر
                                value={selectedCurrency} // القيمة المختارة
                                onChange={(event, newValue) => {
                                    // إذا تم الحذف أو التغيير، نرسل فقط الـ code للـ state
                                    setData({ ...data, currency: newValue ? newValue.code : 'SAR' });
                                }}
                                disableClearable // يمنع المستخدم من ترك الحقل فارغاً تماماً
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search..."
                                        sx={inputStyle}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Capacity</Typography>
                            <TextField fullWidth type="number" placeholder="Guests" value={data.capacity || ''} onChange={(e) => setData({ ...data, capacity: e.target.value })} sx={inputStyle} />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Box sx={{ borderLeft: { md: `1px solid ${theme.palette.divider}` }, pl: { md: 4 }, height: '100%' }}>
                        <Typography sx={{ color: theme.palette.primary.main, fontSize: '11px', mb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}>Cancellation Policy</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['before_acceptance', 'after_acceptance', 'before_payment'].map((policy) => (
                                <FormControlLabel key={policy}
                                                  control={<Checkbox sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.primary.main } }}
                                                                     checked={!!data[`cancel_${policy}`]}
                                                                     onChange={(e) => setData({ ...data, [`cancel_${policy}`]: e.target.checked })} />}
                                                  label={<Typography sx={{ fontSize: '13px' }}>Cancellation {policy.replace(/_/g, ' ')}</Typography>}
                                                  sx={{ width: '100%', ml: 0 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>

            </Grid>
        </Paper>
    );
}