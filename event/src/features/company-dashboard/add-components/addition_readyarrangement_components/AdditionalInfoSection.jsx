import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, useTheme } from '@mui/material';

// 💡 استقبال editMode و originalData
const AdditionalInfoSection = ({ formData, setFormData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const policies = [
        { label: 'Cancellation before acceptance', key: 'cancel_before_acceptance' },
        { label: 'Cancellation after acceptance', key: 'cancel_after_acceptance' },
        { label: 'Cancellation before payment', key: 'cancel_before_payment' }
    ];

    const getCheckboxColor = (key) => {
        if (!editMode || !originalData) return theme.palette.primary.main;
        return formData[key] !== originalData[key] ? '#FFC107' : '#4CAF50';
    };

    const getPhoneStyle = () => {
        let borderColor = 'transparent';
        if (editMode && originalData) {
            const isModified = String(formData.secondary_contact_number || '') !== String(originalData.secondary_contact_number || '');
            borderColor = isModified ? '#FFC107' : '#4CAF50';
        }
        return {
            letterSpacing: '0.07em',
            bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
                border: `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
            },
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'transparent' },
        };
    };

    return (
        <Box sx={{ p: 4, bgcolor: isDark ? '#261d19' : '#E5D9B8', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3, width: 1020 }}>
            <Grid container spacing={24} alignItems="flex-start">
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' ,width:350 }}>
                        SECONDARY CONTACT
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="+964 XXX XXX XXXX"
                        value={formData.secondary_contact_number || ''}
                        onChange={(e) => setFormData({ ...formData, secondary_contact_number: e.target.value })}
                        sx={getPhoneStyle()}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1, display: 'block', fontStyle: 'italic' }}>
                        Optional emergency concierge number.
                    </Typography>
                </Grid>

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
                                        checked={!!formData[policy.key]}
                                        onChange={(e) => setFormData({ ...formData, [policy.key]: e.target.checked })}
                                        sx={{
                                            color: getCheckboxColor(policy.key),
                                            '&.Mui-checked': { color: getCheckboxColor(policy.key) }
                                        }}
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