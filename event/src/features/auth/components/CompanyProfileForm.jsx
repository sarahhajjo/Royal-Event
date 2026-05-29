import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function CompanyProfileForm({ onBack, onSubmit }) {
    const [companyData, setCompanyData] = useState({
        companyName: '', crNumber: '', category: '', location: '', contactName: '', position: '', agreeToTerms: false
    });

    const damascusDistricts = [
        { name_ar: 'المزة', name_en: 'Mezzeh' },
        { name_ar: 'مشروع دمر', name_en: 'Dummar Project' },
        { name_ar: 'كفرسوسة', name_en: 'Kfar Souseh' },
        { name_ar: 'الشعلان', name_en: 'Shaalan' },
        { name_ar: 'القصاع', name_en: 'Al-Qassaa' },
        { name_ar: 'باب توما', name_en: 'Bab Touma' }
    ];

    const handleChange = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    // 👑 دالة معالجة الإرسال لتسليم البيانات للأب والتحويل الفوري للـ Dashboard
    const handleSubmit = (e) => {
        e.preventDefault();
        if (companyData.agreeToTerms && onSubmit) {
            onSubmit(companyData); // 🚀 تسليم البيانات لـ RegisterPage ليقوم بالـ navigate فوراً
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }} className="animate-fade-in">

            {/* حاوية العناوين التحريرية الفاخرة */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: 'left', width: '100%' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Playfair Display', 'Times New Roman', serif",
                        color: '#eee0da',
                        fontSize: '2.3rem',
                        letterSpacing: '0.08em',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        width: 'max-content'
                    }}
                >
                    Complete Company Profile
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: "'Playfair Display', serif", color: '#9a8f80', fontSize: '13px', lineHeight: 1.4, width: '100%', fontWeight: 300 }}>
                    Enter your legal and operational details to finalize corporate membership.
                </Typography>
            </Box>

            {/* شريط مؤشرات التقدم الثلاثي */}
            <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} />
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* الشبكة الأولى: اسم الشركة والسجل التجاري */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Brand/Stage Name" placeholder="Royal Events Ltd" value={companyData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
                    <InputField label="CR Number" placeholder="1010XXXXXX" value={companyData.crNumber} onChange={(e) => handleChange('crNumber', e.target.value)} />
                </Box>

                {/* حقل اختيار فئة الخدمة المنسدل */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                    <Box
                        component="label"
                        sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '11px',
                            fontWeight: 400,
                            color: '#c5a059',
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            textAlign: 'left'
                        }}
                    >
                        Service Categories
                    </Box>
                    <FormControl variant="standard" fullWidth>
                        <Select
                            value={companyData.category}
                            displayEmpty
                            onChange={(e) => handleChange('category', e.target.value)}
                            sx={{
                                color: '#eee0da',
                                fontSize: '15px',
                                fontFamily: "'Playfair Display', serif !important",
                                letterSpacing: '0.05em',
                                height: '24px',
                                '&:before': { borderBottom: '1px solid rgba(78, 70, 57, 0.45) !important' },
                                '&:after': { borderBottom: '2px solid #c5a059 !important' },
                                '& .MuiSelect-select': {
                                    padding: '2px 0px !important',
                                    textAlign: 'left',
                                    fontFamily: "'Playfair Display', serif !important",
                                    fontWeight: 400
                                },
                                '& .MuiSvgIcon-root': { color: '#c5a059', right: 0, bottom: '2px', fontSize: '20px' }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#1c1512',
                                        color: '#eee0da',
                                        borderRadius: '0px',
                                        border: '1px solid rgba(197, 160, 89, 0.15)',
                                        '& .MuiMenuItem-root': {
                                            fontFamily: "'Playfair Display', serif !important",
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            letterSpacing: '0.05em',
                                            color: '#eee0da',
                                            '&.Mui-disabled': { color: '#5a5043', opacity: 0.8 }
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Select category</MenuItem>
                            <MenuItem value="catering">Catering & Hospitality</MenuItem>
                            <MenuItem value="venue">Venues & Halls</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* حقل اختيار أحياء دمشق المنسجم */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                    <Box
                        component="label"
                        sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '11px',
                            fontWeight: 400,
                            color: '#c5a059',
                            textTransform: 'uppercase',
                            letterSpacing: '0.25em',
                            textAlign: 'left'
                        }}
                    >
                        Headquarters Location (Damascus)
                    </Box>
                    <FormControl variant="standard" fullWidth>
                        <Select
                            value={companyData.location}
                            displayEmpty
                            onChange={(e) => handleChange('location', e.target.value)}
                            sx={{
                                color: '#eee0da',
                                fontSize: '15px',
                                fontFamily: "'Playfair Display', serif !important",
                                letterSpacing: '0.05em',
                                height: '24px',
                                '&:before': { borderBottom: '1px solid rgba(78, 70, 57, 0.45) !important' },
                                '&:after': { borderBottom: '2px solid #c5a059 !important' },
                                '& .MuiSelect-select': {
                                    padding: '2px 0px !important',
                                    textAlign: 'left',
                                    fontFamily: "'Playfair Display', serif !important",
                                    fontWeight: 400
                                },
                                '& .MuiSvgIcon-root': { color: '#c5a059', right: 0, bottom: '2px', fontSize: '20px' }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#1c1512',
                                        color: '#eee0da',
                                        borderRadius: '0px',
                                        border: '1px solid rgba(197, 160, 89, 0.15)',
                                        '& .MuiMenuItem-root': {
                                            fontFamily: "'Playfair Display', serif !important",
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            letterSpacing: '0.05em',
                                            color: '#eee0da',
                                            '&.Mui-disabled': { color: '#5a5043', opacity: 0.8 }
                                        }
                                    }
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Select business district</MenuItem>
                            {damascusDistricts.map((district, i) => (
                                <MenuItem key={i} value={district.name_en}>
                                    {district.name_en} — {district.name_ar}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* الشبكة الثالثة: اسم شخص التواصل والمسمى الوظيفي */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Contact Person Name" placeholder="Full Name" value={companyData.contactName} onChange={(e) => handleChange('contactName', e.target.value)} />
                    <InputField label="Position" placeholder="Operations Manager" value={companyData.position} onChange={(e) => handleChange('position', e.target.value)} />
                </Box>

                <FormControlLabel
                    control={<Checkbox checked={companyData.agreeToTerms} onChange={(e) => handleChange('agreeToTerms', e.target.checked)} sx={{ color: '#5a5043', '&.Mui-checked': { color: '#c5a059' }, p: 0, mr: 1, ml: 0 }} />}
                    label={<Typography variant="caption" sx={{ fontFamily: "'Playfair Display', serif", color: '#9a8f80', fontSize: '12px', fontWeight: 300, letterSpacing: '0.02em' }}>I verify that this company is legally registered.</Typography>}
                    sx={{ mt: 0.2, display: 'flex', alignItems: 'center', ml: 0 }}
                />

                <Box sx={{ pt: 0.5 }}>
                    <Button text="COMPLETE REGISTRATION →" />
                </Box>
            </form>

            {/* زر العودة للخلف */}
            <MuiButton
                onClick={onBack}
                disableRipple
                sx={{
                    color: '#9a8f80',
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.18em',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                    mt: 0.5,
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
    );
}

export default CompanyProfileForm;