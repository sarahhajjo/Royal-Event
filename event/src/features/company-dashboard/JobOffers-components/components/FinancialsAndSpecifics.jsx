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
// ── Constants ─────────────────────────────────────────────────────────────────

const EXPERIENCE_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Director'];

const PAYMENT_OPTIONS = [
    { value: 'perEvent', label: 'Per Event' },
    { value: 'monthly',  label: 'Monthly'   },
    { value: 'hourly',   label: 'Hourly'    },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FinancialsAndSpecifics() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';

    const {
        salary, paymentSystem, specificEventAssociation,
        experienceLevel, companyEquipmentProvided,
    } = useSelector(selectFinancials);

    // ── Shared Styles ─────────────────────────────────────────────────────────

    const labelSx = {
        fontSize: '12px',
        fontWeight: 600,
        color:  theme.palette.primary.main,
        mb: 0.8,
        display: 'block'
    };

    const inputSx = {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)',
        borderRadius: '6px',
        width: '100%',
        '& .MuiOutlinedInput-root': {
            height: '42px',
            '& fieldset': {
                borderColor: isDark ? '#3a2e22' : 'rgba(179, 140, 69, 0.3)',
            },
            '&:hover fieldset': {
                borderColor: isDark ? '#c5a059' : '#b38c45',
            },
            '&.Mui-focused fieldset': {
                borderColor: isDark ? '#c5a059' : '#b38c45',
            },
        },
        '& .MuiInputBase-input': {
            fontSize: '13px',
            color: theme.palette.text.primary,
            padding: '10px 14px',
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.text.secondary,
            fontSize: '20px'
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p:            3,
                mb:           3,
                borderRadius: 2,
                border:       `1px solid ${isDark ? '#261d19' : 'rgba(179, 140, 69, 0.3)'}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            {/* Section Title */}
            {/* Section Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AccountBalanceWalletOutlinedIcon sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '1.6rem' }} />                <Typography
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize:   '1.4rem',
                        fontWeight: 500,
                        color:   theme.palette.text.primary,
                        letterSpacing: '0.02em',
                    }}
                >
                    Financials &amp; Specifics
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* 💡 Row 1: Salary + Payment System */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Salary (Base Currency)</Typography>
                        <TextField
                            type="number"
                            placeholder="0.00"
                            value={salary}
                            onChange={(e) => dispatch(setSalary(e.target.value))}
                            fullWidth
                            sx={inputSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem', ml: 1 }}>
                                            $
                                        </Typography>
                                    </InputAdornment>
                                ),
                                inputProps: { min: 0, step: 0.01 },
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Typography sx={labelSx}>Payment System</Typography>
                        <RadioGroup
                            row
                            value={paymentSystem}
                            onChange={(e) => dispatch(setPaymentSystem(e.target.value))}
                            sx={{ mt: 0.5 }}
                        >
                            {PAYMENT_OPTIONS.map(({ value, label }) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={
                                        <Radio
                                            size="small"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' },
                                                p: '4px 8px',
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '13px' }}>
                                            {label}
                                        </Typography>
                                    }
                                    sx={{ mr: 1 }}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                </Box>

                {/* 💡 Row 2: Event Association + Experience Level */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Specific Event Association (Optional)</Typography>
                        <TextField
                            placeholder="Not linked to a specific event"
                            value={specificEventAssociation}
                            onChange={(e) => dispatch(setSpecificEventAssociation(e.target.value))}
                            fullWidth
                            sx={inputSx}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={labelSx}>Experience Level</Typography>
                        <Select
                            value={experienceLevel}
                            displayEmpty
                            fullWidth
                            onChange={(e) => dispatch(setExperienceLevel(e.target.value))}
                            sx={inputSx}
                        >
                            <MenuItem value="" disabled sx={{ fontSize: '13px' }}>Select Experience Level</MenuItem>
                            {EXPERIENCE_LEVELS.map((lvl) => (
                                <MenuItem key={lvl} value={lvl} sx={{ fontSize: '13px' }}>{lvl}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>

                {/* 💡 Row 3: Equipment Toggle */}
                <Box
                    sx={{
                        display:         'flex',
                        justifyContent:  'space-between',
                        alignItems:      'center',
                        border:          `1px solid ${isDark ? '#3a2e22' : 'rgba(179, 140, 69, 0.3)'}`,
                        borderRadius:    '6px',
                        px:              2.5,
                        py:              1.5,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    }}
                >
                    <Box>
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500, fontSize: '13px' }}>
                            Company Equipment Provided?
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '11px' }}>
                            Indicate if uniforms or technical gear will be supplied.
                        </Typography>
                    </Box>
                    <Switch
                        checked={companyEquipmentProvided}
                        onChange={() => dispatch(toggleEquipmentProvided())}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: isDark ? '#c5a059' : '#b38c45',
                            },
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}