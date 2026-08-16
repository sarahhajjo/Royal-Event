import React, {useState} from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleServices } from '../addition_slices/arrangementSlice';
import StaffSelector from './StaffSelector';
import StaffSummary from './StaffSummary';
import {useTheme} from "@mui/material/styles";

const ServicesSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const enabled = useSelector(state => state.arrangement.servicesEnabled);

    // 💡 جلب الخدمات المتوفرة ديناميكياً
    const availableServices = useSelector(state => state.arrangement.availableServices);

    const [selectedService, setSelectedService] = useState('All');
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ p: 4, bgcolor: isDark ? '#261d19' : '#E5D9B8', border: `1px solid ${theme.palette.divider}`, borderRadius:3, mb: 3 ,width: 1020 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                    control={<Switch checked={enabled} onChange={() => dispatch(toggleServices())} sx={{ mr: 1 }} />}
                    label={
                        <Box>
                            <Typography variant="h6" sx={{ color:  theme.palette.text.primary, fontWeight: 'bold' }}>Includes Services?</Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Select multiple professional services and staffing for this arrangement.</Typography>
                        </Box>
                    }
                />
            </Box>

            {enabled && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ color: '#c5a059', fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>
                                SELECT SERVICES
                            </Typography>
                            <Box sx={{ width: '280px', height: '56px', display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth sx={{ height: '100%', bgcolor: theme.palette.background.default, borderRadius: 1.5, justifyContent: 'center' }}>
                                    <Select
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        sx={{
                                            height: '100%', color: theme.palette.text.primary,
                                            '.MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                                            '.MuiSvgIcon-root': { color: theme.palette.primary.main },
                                            bgcolor:isDark ? '#17110F' : 'rgba(255, 255, 255, 0.6)'
                                        }}
                                    >
                                        <MenuItem value="All">All Services</MenuItem>
                                        {/* 💡 عرض الخدمات المتاحة ديناميكياً بناءً على موظفيكِ */}
                                        {availableServices.map((service, index) => (
                                            <MenuItem key={index} value={service}>{service}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>

                    <StaffSummary />
                    <StaffSelector filterService={selectedService} />
                </>
            )}
        </Box>
    );
};
export default ServicesSection;