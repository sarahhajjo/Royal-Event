import React, { useState } from 'react';
import Button from '../../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MuiButton from '@mui/material/Button';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BusinessIcon from '@mui/icons-material/Business';
import { useTheme } from '@mui/material/styles';

function AccountTypeForm({ onBack, onContinue }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [selectedType, setSelectedType] = useState('freelancer');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }} className="animate-fade-in">

            {/* حاوية العناوين والأوصاف */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Typography variant="h4" sx={{
                    fontFamily: "'Playfair Display', serif",
                    color: theme.palette.text.primary,
                    fontSize: '2.6rem',
                    letterSpacing: '0.02em',
                    fontWeight: 400
                }}>
                    Select Account Type
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '14px', lineHeight: 1.5 }}>
                    Please select the membership category that suits your professional needs for a bespoke and exclusive experience.
                </Typography>
            </Box>

            {/* شريط مؤشرات التقدم */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: isDark ? '#261d19' : '#d1c5b4', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: theme.palette.primary.main, borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: isDark ? '#261d19' : '#d1c5b4', borderRadius: '4px' }} />
            </Box>

            {/* شبكة الكروت التفاعلية */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>

                {/* كرت المستقل Freelancer */}
                <Paper
                    onClick={() => setSelectedType('freelancer')}
                    elevation={0}
                    sx={{
                        padding: '24px 16px',
                        backgroundColor: theme.palette.background.paper,
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        minHeight: '200px', borderRadius: '0px',
                        border: '1px solid',
                        borderColor: selectedType === 'freelancer' ? theme.palette.primary.main : (isDark ? 'rgba(78, 70, 57, 0.25)' : 'rgba(179, 140, 69, 0.2)'),
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: theme.palette.primary.main }
                    }}
                >
                    <Box sx={{
                        p: 1, mb: 2,
                        backgroundColor: selectedType === 'freelancer' ? theme.palette.primary.main : 'transparent',
                        color: selectedType === 'freelancer' ? theme.palette.background.default : theme.palette.primary.main,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <StarBorderIcon sx={{ fontSize: '24px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500, fontSize: '17px', mb: 1, letterSpacing: '0.02em' }}>
                        Freelancer
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '13px', lineHeight: 1.5, display: 'block', px: 0.5 }}>
                        For independent creators and professionals managing their business with hospitality flexibility and creativity.
                    </Typography>
                </Paper>

                {/* كرت الشركات Company */}
                <Paper
                    onClick={() => setSelectedType('company')}
                    elevation={0}
                    sx={{
                        padding: '24px 16px',
                        backgroundColor: theme.palette.background.paper,
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        minHeight: '200px', borderRadius: '0px',
                        border: '1px solid',
                        borderColor: selectedType === 'company' ? theme.palette.primary.main : (isDark ? 'rgba(78, 70, 57, 0.25)' : 'rgba(179, 140, 69, 0.2)'),
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: theme.palette.primary.main }
                    }}
                >
                    <Box sx={{
                        p: 1, mb: 2,
                        backgroundColor: selectedType === 'company' ? theme.palette.primary.main : 'transparent',
                        color: selectedType === 'company' ? theme.palette.background.default : theme.palette.primary.main,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BusinessIcon sx={{ fontSize: '24px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500, fontSize: '17px', mb: 1, letterSpacing: '0.02em' }}>
                        Company
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '13px', lineHeight: 1.5, display: 'block', px: 0.5 }}>
                        For large institutions looking for integrated management solutions and multi-permission teams.
                    </Typography>
                </Paper>
            </Box>

            {/* حاوية أزرار التحكم */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                <Button text="CONTINUE" onClick={(e) => { e.preventDefault(); onContinue(selectedType); }} />
                <MuiButton
                    onClick={onBack}
                    disableRipple
                    sx={{
                        color: theme.palette.text.secondary,
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 400,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: '0.18em',
                        textDecoration: 'underline',
                        textUnderlineOffset: '5px',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            color: theme.palette.text.primary,
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Go Back
                </MuiButton>
            </Box>
        </Box>
    );
}

export default AccountTypeForm;