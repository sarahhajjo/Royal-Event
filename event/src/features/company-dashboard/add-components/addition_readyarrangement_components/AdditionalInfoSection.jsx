import React from 'react';
import { Box, Typography, TextField, MenuItem, Select, FormControl, Checkbox, FormControlLabel, Grid, useTheme } from '@mui/material';

const AdditionalInfoSection = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ p: 3, bgcolor: isDark ? '#261d19' : '#E5D9B8', borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3, width:1020 }}>
            <Grid container spacing={4} alignItems="flex-start">

                {/* 1. Secondary Contact */}
                <Grid item xs={12} md={4}  sx={{pr:2}}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>SECONDARY CONTACT</Typography>
                    <TextField
                        fullWidth
                        placeholder="+964 XXX XXX XXXX"
                        sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', borderRadius: 1 , width:'300px'}}
                    />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1, display: 'block', fontStyle: 'italic' }}>
                        Optional emergency concierge number.
                    </Typography>
                </Grid>

                {/* 2. Governorate */}
                <Grid item xs={12} md={4} sx={{pr:5}}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>GOVERNORATE / PROVINCE</Typography>
                    <FormControl fullWidth sx={{ bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', borderRadius: 1 ,width:'300px'}}>
                        <Select defaultValue="Damascus" sx={{ color: theme.palette.text.primary }}>
                            <MenuItem value="Damascus">Damascus (دمشق)</MenuItem>
                            <MenuItem value="Aleppo">Aleppo (حلب)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* 3. Cancellation Policy */}
                <Grid item xs={12} md={4}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 1, fontSize: '0.8rem'}}>CANCELLATION POLICY</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {['Cancellation before acceptance', 'Cancellation after acceptance', 'Cancellation before payment'].map((policy) => (
                            <FormControlLabel
                                key={policy}
                                control={<Checkbox sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                                label={<Typography variant="body2" sx={{ color: theme.palette.text.primary ,fontSize: '0.9rem'  }}>{policy}</Typography>}
                            />
                        ))}
                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default AdditionalInfoSection;