import React, { useState } from 'react';
import Button from '../../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MuiButton from '@mui/material/Button';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BusinessIcon from '@mui/icons-material/Business';

function AccountTypeForm({ onBack, onContinue }) {
    const [selectedType, setSelectedType] = useState('freelancer');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }} className="animate-fade-in">

            {/* حاوية العناوين والأوصاف التحريرية الخفيفة */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#eee0da',
                        fontSize: '2.6rem',
                        letterSpacing: '0.02em',
                        fontWeight: 400
                    }}
                >
                    Select Account Type
                </Typography>
                <Typography variant="caption" sx={{ color: '#9a8f80', fontSize: '14px', lineHeight: 1.5 }}>
                    Please select the membership category that suits your professional needs for a bespoke and exclusive experience.
                </Typography>
            </Box>

            {/* شريط مؤشرات التقدم الثلاثي الملموم */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
            </Box>

            {/* شبكة الكروت التفاعلية */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>

                {/* كرت المستقل Freelancer */}
                <Paper
                    onClick={() => setSelectedType('freelancer')}
                    elevation={0}
                    sx={{
                        padding: '24px 16px',
                        backgroundColor: '#1c1512',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '200px',
                        borderRadius: '0px',
                        border: '1px solid',
                        borderColor: selectedType === 'freelancer' ? '#c5a059' : 'rgba(78, 70, 57, 0.25)',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: '#c5a059' }
                    }}
                >
                    <Box sx={{
                        p: 1,
                        borderRadius: '0px',
                        mb: 2,
                        backgroundColor: selectedType === 'freelancer' ? '#c5a059' : 'transparent',
                        color: selectedType === 'freelancer' ? '#1c1512' : '#c5a059',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <StarBorderIcon sx={{ fontSize: '24px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#eee0da', fontWeight: 500, fontSize: '17px', mb: 1, letterSpacing: '0.02em' }}>
                        Freelancer
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8a7f70', fontSize: '13px', lineHeight: 1.5, display: 'block', px: 0.5 }}>
                        For independent creators and professionals managing their business with hospitality flexibility and creativity.
                    </Typography>
                </Paper>

                {/* كرت الشركات Company */}
                <Paper
                    onClick={() => setSelectedType('company')}
                    elevation={0}
                    sx={{
                        padding: '24px 16px',
                        backgroundColor: '#1c1512',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '200px',
                        borderRadius: '0px',
                        border: '1px solid',
                        borderColor: selectedType === 'company' ? '#c5a059' : 'rgba(78, 70, 57, 0.25)',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: '#c5a059' }
                    }}
                >
                    <Box sx={{
                        p: 1,
                        borderRadius: '0px',
                        mb: 2,
                        backgroundColor: selectedType === 'company' ? '#c5a059' : 'transparent',
                        color: selectedType === 'company' ? '#1c1512' : '#c5a059',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <BusinessIcon sx={{ fontSize: '24px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#eee0da', fontWeight: 500, fontSize: '17px', mb: 1, letterSpacing: '0.02em' }}>
                        Company
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8a7f70', fontSize: '13px', lineHeight: 1.5, display: 'block', px: 0.5 }}>
                        For large institutions looking for integrated management solutions and multi-permission teams.
                    </Typography>
                </Paper>
            </Box>

            {/* حاوية أزرار التحكم السفلي */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                <Button text="CONTINUE" onClick={(e) => { e.preventDefault(); if (onContinue) onContinue(selectedType); }} />

                {/* زر العودة المحدث: نفس خط الكتابة التوضيحية الأنيق وتحته خط كلاسيكي فاخر مع تباعد الحروف */}
                <MuiButton
                    onClick={onBack}
                    disableRipple
                    sx={{
                        color: '#9a8f80',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 400,
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: '0.18em', // 👑 حقن تباعد الحروف التحريري الفاخر لمنح الكلمة مسافات أنيقة
                        textDecoration: 'underline',
                        textUnderlineOffset: '5px', // ترحيل مسافة الخط تحت الأحرف المتباعدة بدقة
                        backgroundColor: 'transparent',
                        '&:hover': {
                            color: '#eee0da',
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