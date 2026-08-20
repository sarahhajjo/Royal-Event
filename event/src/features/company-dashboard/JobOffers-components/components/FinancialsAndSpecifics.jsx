import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, MenuItem, Select,
    Typography, Divider, Paper, Radio,
    RadioGroup, FormControlLabel, Switch, InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    setSalary, setPaymentSystem, setSpecificEventAssociation,
    setExperienceLevel, toggleEquipmentProvided,
    selectFinancials,
} from '../CreateJobOfferSlice';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

// 💡 استيراد الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../utils/colorConstants';

const EXPERIENCE_LEVELS = ['Junior', 'Mid', 'Senior'];

const PAYMENT_OPTIONS = [
    { value: 'perEvent', label: 'Per Event' },
    { value: 'monthly',  label: 'Monthly'   },
    { value: 'hourly',   label: 'Hourly'    },
];

export default function FinancialsAndSpecifics() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';

    const {
        salary, paymentSystem, specificEventAssociation,
        experienceLevel, companyEquipmentProvided,
    } = useSelector(selectFinancials);

    const labelSx = {
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 0.8, display: 'block', letterSpacing: '0.05em'
    };

    const inputSx = {
        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
        borderRadius: '6px', width: '100%',
        backdropFilter: 'blur(4px)',
        '& .MuiOutlinedInput-root': {
            height: '42px',
            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER },
            '&:hover fieldset': { borderColor: GOLD },
            '&.Mui-focused fieldset': { borderColor: GOLD },
        },
        '& .MuiInputBase-input': { fontSize: '13px', color: isDark ? '#ffffff' : '#1A120D', padding: '10px 14px' },
        '& .MuiSvgIcon-root': { color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '20px' }
    };

    return (
        <Paper elevation={0} sx={{
            p: 3, mb: 3, borderRadius: 3,
            bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AccountBalanceWalletOutlinedIcon sx={{ color: isDark ? GOLD : BROWN_TEXT, fontSize: '1.6rem' }} />
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: isDark ? '#ffffff' : '#1A120D', letterSpacing: '0.02em' }}>
                    Financials &amp; Specifics
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Salary (Base Currency)</Typography>
                        <TextField type="number" placeholder="0.00" value={salary} onChange={(e) => dispatch(setSalary(e.target.value))} fullWidth sx={inputSx} InputProps={{ startAdornment: ( <InputAdornment position="start"> <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '0.9rem', ml: 1 }}> $ </Typography> </InputAdornment> ), inputProps: { min: 0, step: 0.01 }, }} />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Typography sx={labelSx}>Payment System</Typography>
                        <RadioGroup row value={paymentSystem} onChange={(e) => dispatch(setPaymentSystem(e.target.value))} sx={{ mt: 0.5 }}>
                            {PAYMENT_OPTIONS.map(({ value, label }) => (
                                <FormControlLabel key={value} value={value} control={ <Radio size="small" sx={{ color: isDark ? 'rgba(255,255,255,0.3)' : MUTED_TEXT, '&.Mui-checked': { color: GOLD }, p: '4px 8px', }} /> } label={ <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#1A120D', fontSize: '13px', fontWeight: 500 }}> {label} </Typography> } sx={{ mr: 1 }} />
                            ))}
                        </RadioGroup>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Specific Event Association (Optional)</Typography>
                        <TextField placeholder="Not linked to a specific event" value={specificEventAssociation} onChange={(e) => dispatch(setSpecificEventAssociation(e.target.value))} fullWidth sx={inputSx} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Experience Level</Typography>
                        <Select value={experienceLevel} displayEmpty fullWidth onChange={(e) => dispatch(setExperienceLevel(e.target.value))} sx={inputSx}>
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Experience Level</MenuItem>
                            {EXPERIENCE_LEVELS.map((lvl) => (
                                <MenuItem key={lvl} value={lvl} sx={{ fontSize: '13px' }}>{lvl}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER}`, borderRadius: '6px', px: 2.5, py: 1.5, backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, backdropFilter: 'blur(4px)' }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1A120D', fontWeight: 600, fontSize: '13px' }}>Company Equipment Provided?</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontSize: '11px', fontWeight: 500 }}>Indicate if uniforms or technical gear will be supplied.</Typography>
                    </Box>
                    <Switch checked={companyEquipmentProvided} onChange={() => dispatch(toggleEquipmentProvided())} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }} />
                </Box>
            </Box>
        </Paper>
    );
}