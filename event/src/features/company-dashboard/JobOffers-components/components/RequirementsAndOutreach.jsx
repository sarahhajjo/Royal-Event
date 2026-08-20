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

// 💡 استيراد الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../utils/colorConstants';

export default function RequirementsAndOutreach() {
    const dispatch = useDispatch();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === 'dark';
    const { jobRequirements, contactInfo } = useSelector(selectRequirements);

    const labelSx = {
        fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 0.8, display: 'block', letterSpacing: '0.05em'
    };

    const baseInputSx = {
        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
        borderRadius: '6px',
        width: '100%',
        backdropFilter: 'blur(4px)',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER,
            },
            '&:hover fieldset': {
                borderColor: GOLD,
            },
            '&.Mui-focused fieldset': {
                borderColor: GOLD,
            },
        },
        '& .MuiInputBase-input': {
            fontSize: '13px',
            color: isDark ? '#ffffff' : '#1A120D',
            padding: '10px 14px',
        },
        '& .MuiSvgIcon-root': {
            color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT,
            fontSize: '20px'
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3, mb: 3, borderRadius: 3,
                bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <WorkOutlinedIcon sx={{ color: isDark ? GOLD : BROWN_TEXT, fontSize: '1.6rem' }} />
                <Typography
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize:   '1.4rem',
                        fontWeight: 600,
                        color:      isDark ? '#ffffff' : '#1A120D',
                        letterSpacing: '0.02em',
                    }}
                >
                    Requirements &amp; Outreach
                </Typography>
            </Box>

            <Divider sx={{ mt: 1.5, mb: 2.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                            sx: { textAlign: 'right', color: isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT, mr: 0, mt: 0.5, fontSize: '11px', fontWeight: 600 },
                        }}
                    />
                </Box>

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
                            '& .MuiOutlinedInput-root': {
                                ...baseInputSx['& .MuiOutlinedInput-root'],
                                height: '42px',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon
                                        sx={{ fontSize: 18, color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, ml: 1 }}
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