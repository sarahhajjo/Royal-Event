import React from 'react';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Grid, useTheme } from '@mui/material';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';
const AdditionalInfoSection = ({ formData, setFormData, editMode, originalData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const policies = [
        { label: 'Cancellation before acceptance', key: 'cancel_before_acceptance' },
        { label: 'Cancellation after acceptance', key: 'cancel_after_acceptance' },
        { label: 'Cancellation before payment', key: 'cancel_before_payment' }
    ];

    const getCheckboxColor = (key) => {
        if (!editMode || !originalData) return GOLD;
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
            bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
                border: `1px solid ${borderColor}`,
                transition: 'border-color 0.3s ease',
                height: '44px',
                color: isDark ? '#ffffff' : BROWN_TEXT,
            },
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'transparent' },
        };
    };

    return (
        <Box sx={{
            p: 4,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            borderRadius: '18px',
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            mb: 3,
            width: 1020,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            },
            '&:active': { transform: 'scale(0.98) translateY(-2px)', transition: 'all 0.05s ease' }
        }}>
            <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: GOLD, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em', width: '100%' }}>
                        SECONDARY CONTACT
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="+964 XXX XXX XXXX"
                        value={formData.secondary_contact_number || ''}
                        onChange={(e) => setFormData({ ...formData, secondary_contact_number: e.target.value })}
                        sx={getPhoneStyle()}
                    />
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, mt: 1, display: 'block', fontStyle: 'italic' }}>
                        Optional emergency concierge number.
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: GOLD, fontWeight: 'bold', mb: 1, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
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
                                    <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
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