import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, useTheme } from '@mui/material';

const AdditionalInfoSection = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ p: 4, bgcolor: isDark ? '#261d19' : '#E5D9B8', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3, width: 1020 }}>
            <Grid container spacing={24} alignItems="flex-start">

                {/* 1. Secondary Contact (يأخذ نصف المساحة) */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' ,width:350 }}>
                        SECONDARY CONTACT
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="+964 XXX XXX XXXX"
                        sx={{
                            letterSpacing: '0.07em',
                            bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                            borderRadius: 1,
                            '& fieldset': { borderColor: 'transparent' } // إخفاء الحدود الافتراضية ليتماشى مع الثيم
                        }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1, display: 'block', fontStyle: 'italic' }}>
                        Optional emergency concierge number.
                    </Typography>
                </Grid>

                {/* 2. Cancellation Policy (يأخذ النصف الآخر) */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                        CANCELLATION POLICY
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {['Cancellation before acceptance', 'Cancellation after acceptance', 'Cancellation before payment'].map((policy) => (
                            <FormControlLabel
                                key={policy}
                                control={<Checkbox size="small" sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                label={
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.07em' // 💡 إضافة مسافة بين الحروف هنا
                                        }}
                                    >
                                        {policy}
                                    </Typography>
                                }
                                sx={{ m: 0 }} // إزالة الهوامش الافتراضية لترتيب أفضل
                            />
                        ))}
                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AdditionalInfoSection;