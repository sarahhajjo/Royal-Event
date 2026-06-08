import { TextField, RadioGroup, FormControlLabel, Radio, Box, Typography, useTheme } from '@mui/material';

const GeneralInfoForm = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // نستخدم الألوان من الثيم مباشرة
    const inputSx = {
        // هذا الستايل موحد الآن ليكون بحدود شفافة ونمط متوافق
        '& .MuiOutlinedInput-root': {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            color: theme.palette.text.primary,
            borderRadius: '4px',
            // هنا تم ضبط الحدود لتكون شفافة كما طلبت
            border: isDark ? '1px solid rgba(78, 70, 57, 0.3)' : '1px solid rgba(179, 140, 69, 0.35)',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused': {
                border: isDark ? '1px solid #c5a059' : '1px solid #b38c45',
                boxShadow: isDark ? '0 0 8px rgba(197, 160, 89, 0.2)' : '0 0 8px rgba(179, 140, 69, 0.25)'
            }
        },
        '& .MuiInputBase-input': {
            padding: '8px 12px', fontSize: '0.75rem'
        }
    };

    const CustomLabel = ({ children }) => (
        <Typography sx={{ color: theme.palette.primary.main, fontSize: '0.75rem', fontWeight: 'bold', mb: 0.5 }}>
            {children}
        </Typography>
    );

    return (
        <Box sx={{  bgcolor:  isDark? '#261d19' : '#E5D9B8',display: 'flex', flexDirection: 'column', gap: 2, width: '100%'  }}>
            {/* السطر الأول */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>EVENT TYPE</CustomLabel>
                    <TextField fullWidth sx={inputSx} placeholder="Wedding Gala" />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>ARRANGEMENT TITLE</CustomLabel>
                    <TextField fullWidth sx={inputSx} placeholder="e.g. Golden Hour..." />
                </Box>
            </Box>

            <CustomLabel>DESCRIPTION</CustomLabel>
            <TextField fullWidth multiline rows={3} sx={inputSx} placeholder="Describe the exclusive nature..." />

            {/* السطر الأخير */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <CustomLabel>BOOKING PRICE</CustomLabel>
                    <TextField fullWidth sx={inputSx} placeholder="$ 0.00" />
                </Box>

                <RadioGroup row defaultValue="fixed" sx={{ color: theme.palette.text.primary, mt: 2.5, flexShrink: 0 }}>
                    <FormControlLabel
                        value="hourly"
                        control={<Radio sx={{ color: theme.palette.primary.main }} />}
                        label="Hourly"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                    />
                    <FormControlLabel
                        value="fixed"
                        control={<Radio sx={{ color: theme.palette.primary.main }} />}
                        label="Fixed"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                    />
                </RadioGroup>

                <Box sx={{ flex: 1 }}>
                    <CustomLabel>CAPACITY (GUESTS)</CustomLabel>
                    <TextField fullWidth sx={inputSx} placeholder="Max" />
                </Box>
            </Box>
        </Box>
    );
};

export default GeneralInfoForm;