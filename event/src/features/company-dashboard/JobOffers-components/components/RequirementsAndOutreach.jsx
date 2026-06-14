import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, Typography, Divider, Paper, InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
    setJobRequirements, setContactInfo,
    selectRequirements,
} from '../CreateJobOfferSlice';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
// ── Component ─────────────────────────────────────────────────────────────────

export default function RequirementsAndOutreach() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';
    const { jobRequirements, contactInfo } = useSelector(selectRequirements);

    // ── Shared Styles ─────────────────────────────────────────────────────────

    const labelSx = {
        fontSize: '12px',
        fontWeight: 600,
        color: theme.palette.primary.main,
        mb: 0.8,
        display: 'block'
    };

    // التنسيق الأساسي بدون تثبيت الارتفاع (ليناسب صندوق النص الكبير)
    const baseInputSx = {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)',
        borderRadius: '6px',
        width: '100%',
        '& .MuiOutlinedInput-root': {
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
                <WorkOutlinedIcon sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '1.6rem' }} />                <Typography
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize:   '1.4rem',
                        fontWeight: 500,
                        color:      theme.palette.text.primary,
                        letterSpacing: '0.02em',
                    }}
                >
                    Requirements &amp; Outreach
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* 💡 Row 1: Job Requirements Textarea */}
                <Box sx={{ width: '100%' }}>
                    <Typography sx={labelSx}>Job Requirements & Scope</Typography>
                    <TextField
                        placeholder="Detail the specific duties, certifications, and expectations for this role..."
                        value={jobRequirements}
                        onChange={(e) => dispatch(setJobRequirements(e.target.value))}
                        multiline
                        rows={5}
                        fullWidth
                        sx={{
                            ...baseInputSx,
                            // تعديل الحشوة الداخلية لتناسب الأسطر المتعددة
                            '& .MuiOutlinedInput-root': {
                                ...baseInputSx['& .MuiOutlinedInput-root'],
                                padding: '0px',
                            },
                            '& .MuiInputBase-inputMultiline': {
                                padding: '12px 14px',
                            }
                        }}
                        inputProps={{ maxLength: 3000 }}
                        helperText={`${jobRequirements.length} / 3000`}
                        FormHelperTextProps={{
                            sx: { textAlign: 'right', color: theme.palette.text.secondary, mr: 0, mt: 0.5, fontSize: '11px' },
                        }}
                    />
                </Box>

                {/* 💡 Row 2: Contact Info */}
                <Box sx={{ width: '100%' }}>
                    <Typography sx={labelSx}>Contact Info (Direct HR Link)</Typography>
                    <TextField
                        placeholder="hr@company.com"
                        value={contactInfo}
                        onChange={(e) => dispatch(setContactInfo(e.target.value))}
                        type="email"
                        fullWidth
                        sx={{
                            ...baseInputSx,
                            // تثبيت الارتفاع للحقل المفرد فقط
                            '& .MuiOutlinedInput-root': {
                                ...baseInputSx['& .MuiOutlinedInput-root'],
                                height: '42px',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon
                                        sx={{ fontSize: 18, color: theme.palette.text.secondary, ml: 1 }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}