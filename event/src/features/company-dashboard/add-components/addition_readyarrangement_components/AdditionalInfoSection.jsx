import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, useTheme } from '@mui/material';

// 💡 استقبال الـ Props من المدير (ArrangementPage)
const AdditionalInfoSection = ({ formData, setFormData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 💡 مصفوفة لتسهيل ربط السياسات بمفاتيح الـ formData
    const policies = [
        { label: 'Cancellation before acceptance', key: 'cancel_before_acceptance' },
        { label: 'Cancellation after acceptance', key: 'cancel_after_acceptance' },
        { label: 'Cancellation before payment', key: 'cancel_before_payment' }
    ];

    return (
        <Box sx={{ p: 4, bgcolor: isDark ? '#261d19' : '#E5D9B8', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3, width: 1020 }}>
            <Grid container spacing={24} alignItems="flex-start">

                {/* 1. Secondary Contact */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' ,width:350 }}>
                        SECONDARY CONTACT
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="+964 XXX XXX XXXX"
                        value={formData.secondary_contact_number} // 💡 ربط القيمة
                        onChange={(e) => setFormData({ ...formData, secondary_contact_number: e.target.value })} // 💡 تحديث الداتا
                        sx={{
                            letterSpacing: '0.07em',
                            bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                            borderRadius: 1,
                            '& fieldset': { borderColor: 'transparent' }
                        }}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1, display: 'block', fontStyle: 'italic' }}>
                        Optional emergency concierge number.
                    </Typography>
                </Grid>

                {/* 2. Cancellation Policy */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                        CANCELLATION POLICY
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {policies.map((policy) => (
                            <FormControlLabel
                                key={policy.key}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={formData[policy.key]} // 💡 ربط حالة الـ Checkbox بالداتا
                                        onChange={(e) => setFormData({ ...formData, [policy.key]: e.target.checked })} // 💡 تحديث الـ Boolean
                                        sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.primary.main } }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontSize: '0.9rem', letterSpacing: '0.07em' }}>
                                        {policy.label}
                                    </Typography>
                                }
                                sx={{ m: 0 }}
                            />
                        ))}
                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AdditionalInfoSection;