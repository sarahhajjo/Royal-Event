import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Paper, useTheme, alpha, Grid, Autocomplete } from '@mui/material';
import cc from 'currency-codes';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const CURRENCY_OPTIONS = cc.data.map(c => ({ code: c.code, label: `${c.code} - ${c.currency}` }));

export default function BookingDetailsBox({ data, setData, editMode, originalData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getFieldStyle = (fieldKey, currentValue) => {
        let borderColor = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
        if (editMode) {
            const isModified = String(currentValue || '') !== String(originalData?.[fieldKey] || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }
        return {
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                borderRadius: '4px',
                border: borderColor.includes('solid') ? borderColor : `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused': { border: `1px solid ${GOLD}` }
            }
        };
    };

    const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === (data.currency || 'SAR')) || CURRENCY_OPTIONS.find(c => c.code === 'SAR');

    return (
        <Paper className="booking-details-section" sx={{
            p: 4,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px',
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                <Typography sx={{ fontSize: '16px' }}>💰</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.02em', color: isDark ? '#ffffff' : BROWN_TEXT }}>Booking Details</Typography>
            </Box>

            <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={7}>
                    <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Pricing Structure</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {['FIXED', 'HOURLY'].map((type) => {
                            const isTypeModified = editMode && data.priceType !== originalData?.priceType;
                            return (
                                <Box key={type} onClick={() => setData({ ...data, priceType: type.toLowerCase() })}
                                     sx={{ p: 1.5, flex: 1, textAlign: 'center', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                         border: data.priceType === type.toLowerCase() ? `1px solid ${isTypeModified ? '#FFC107' : (editMode ? '#4CAF50' : GOLD)}` : (isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`),
                                         backgroundColor: data.priceType === type.toLowerCase() ? alpha(GOLD, 0.15) : (isDark ? DARK_SURFACE_BG : LIGHT_INPUT),
                                         color: data.priceType === type.toLowerCase() ? GOLD : (isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT) }}>
                                    {type} RATE
                                </Box>
                            )})}
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Price</Typography>
                            <TextField fullWidth type="number" placeholder="e.g. 25,000" value={data.price || ''} onChange={(e) => setData({ ...data, price: e.target.value })} sx={getFieldStyle('price', data.price)} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Currency</Typography>
                            <Autocomplete
                                options={CURRENCY_OPTIONS}
                                getOptionLabel={(option) => option.label}
                                value={selectedCurrency}
                                onChange={(event, newValue) => setData({ ...data, currency: newValue ? newValue.code : 'SAR' })}
                                disableClearable
                                renderInput={(params) => <TextField {...params} placeholder="Search..." sx={getFieldStyle('currency', data.currency)} />}
                                // 💡 تلوين نافذة اختيار العملة
                                slotProps={{
                                    paper: {
                                        sx: {
                                            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                                            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                                            color: isDark ? '#ffffff' : BROWN_TEXT,
                                            backdropFilter: 'blur(16px)',
                                            backgroundImage: 'none'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ color: GOLD, fontSize: '11px', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}>Capacity</Typography>
                            <TextField fullWidth type="number" placeholder="Guests" value={data.capacity || ''} onChange={(e) => setData({ ...data, capacity: e.target.value })} sx={getFieldStyle('capacity', data.capacity)} />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Box sx={{ borderLeft: { md: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }, pl: { md: 4 }, height: '100%' }}>
                        <Typography sx={{ color: GOLD, fontSize: '11px', mb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}>Cancellation Policy</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['before_acceptance', 'after_acceptance', 'before_payment'].map((policy) => {
                                const isModified = editMode && !!data[`cancel_${policy}`] !== !!originalData?.[`cancel_${policy}`];
                                return (
                                    <FormControlLabel key={policy}
                                                      control={<Checkbox sx={{ color: isModified ? '#FFC107' : (editMode ? '#4CAF50' : GOLD), '&.Mui-checked': { color: isModified ? '#FFC107' : (editMode ? '#4CAF50' : GOLD) } }} checked={!!data[`cancel_${policy}`]} onChange={(e) => setData({ ...data, [`cancel_${policy}`]: e.target.checked })} />}
                                                      label={<Typography sx={{ fontSize: '13px', color: isModified ? '#FFC107' : (editMode ? '#4CAF50' : (isDark ? '#ffffff' : BROWN_TEXT)) }}>Cancellation {policy.replace(/_/g, ' ')}</Typography>}
                                                      sx={{ width: '100%', ml: 0 }}
                                    />
                                )})}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}