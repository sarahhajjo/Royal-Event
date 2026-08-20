import React, {useState} from 'react';
import { Box, Typography, Switch, FormControlLabel, Grid, Select, MenuItem, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleServices } from '../addition_slices/arrangementSlice';
import StaffSelector from './StaffSelector';
import StaffSummary from './StaffSummary';
import {useTheme} from "@mui/material/styles";
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';

const ServicesSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const enabled = useSelector(state => state.arrangement.servicesEnabled);
    const availableServices = useSelector(state => state.arrangement.availableServices);
    const [selectedService, setSelectedService] = useState('All');
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            p: 4,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: 3,
            mb: 3,
            width: 1020,
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(197, 160, 89, 0.7)'
            }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                    control={<Switch checked={enabled} onChange={() => dispatch(toggleServices())} sx={{ mr: 1, '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }} />}
                    label={
                        <Box>
                            <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold' }}>Includes Services?</Typography>
                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT }}>Select multiple professional services and staffing for this arrangement.</Typography>
                        </Box>
                    }
                />
            </Box>

            {enabled && (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ color: GOLD, fontWeight: 'bold', mb: 1, fontSize: '0.8rem' }}>
                                SELECT SERVICES
                            </Typography>
                            <Box sx={{ width: '280px', height: '56px', display: 'flex', alignItems: 'center' }}>
                                <FormControl fullWidth sx={{ height: '100%', background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, borderRadius: 1.5, justifyContent: 'center' }}>
                                    <Select
                                        variant="outlined"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        sx={{
                                            height: '100%', color: isDark ? '#ffffff' : BROWN_TEXT,
                                            '.MuiOutlinedInput-notchedOutline': { borderColor: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: GOLD },
                                            '.MuiSvgIcon-root': { color: GOLD },
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: isDark ? '#111621' : '#fff8e8',
                                                    color: isDark ? '#ffffff' : BROWN_TEXT,
                                                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${LIGHT_BORDER}`
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="All">All Services</MenuItem>
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