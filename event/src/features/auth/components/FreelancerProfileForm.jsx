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

function FreelancerProfileForm({ onBack, onSubmit }) {
    const [profileData, setProfileData] = useState({
        brandName: '', specialty: '', experience: '0', idNumber: '', portfolio: '', agreeToTerms: false
    });

    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%' }} className="animate-fade-in">

            {/* 👑 حاوية العناوين التحريرية المعدلة لتظهر على سطر واحد أفقي بدون انقسام */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left', width: '100%' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#eee0da',
                        fontSize: '2.6rem',
                        letterSpacing: '0.02em',
                        fontWeight: 400,
                        whiteSpace: 'nowrap', // 💡 السر السحري لإجبار العنوان على الظهور في سطر واحد أفقي دائماً
                        width: 'max-content'  // جعل الحاوية تتسع للعنوان بالكامل
                    }}
                >
                    Complete Your Profile
                </Typography>
                <Typography variant="caption" sx={{ color: '#9a8f80', fontSize: '14px', lineHeight: 1.5, width: '100%' }}>
                    Provide your professional details to join our exclusive network of event experts.
                </Typography>
            </Box>

            {/* شريط مؤشرات التقدم الثلاثي الملموم */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} />
            </Box>

            <form onSubmit={(e) => { e.preventDefault(); if(profileData.agreeToTerms) onSubmit(profileData); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* الشبكة الأولى: ضبط المحاذاة والتوازي المطلق بالملي متر */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Brand/Stage Name" placeholder="e.g. Noir Studio" value={profileData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />

                    {/* هندسة القائمة المنسدلة لتتطابق برفق مع هيكلية وتوازي الـ InputField القياسي */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <Box
                            component="label"
                            sx={{
                                fontSize: '11px',
                                fontWeight: 400,
                                color: '#c5a059',
                                textTransform: 'uppercase',
                                letterSpacing: '0.25em',
                                textAlign: 'left'
                            }}
                        >
                            Primary Specialty
                        </Box>
                        <FormControl variant="standard" fullWidth>
                            <Select
                                value={profileData.specialty}
                                displayEmpty
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                sx={{
                                    color: '#eee0da',
                                    fontSize: '15px',
                                    fontFamily: "'Inter', sans-serif",
                                    py: 0.2,
                                    height: '28px',
                                    '&:before': {
                                        borderBottom: '1px solid rgba(78, 70, 57, 0.45) !important'
                                    },
                                    '&:after': {
                                        borderBottom: '2px solid #c5a059 !important'
                                    },
                                    '& .MuiSelect-select': {
                                        padding: '2px 0px !important',
                                        textAlign: 'left'
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#c5a059'
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: '#1c1512',
                                            color: '#eee0da',
                                            borderRadius: '0px',
                                            border: '1px solid rgba(197, 160, 89, 0.15)'
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="" disabled sx={{ color: '#5a5043' }}>Select specialty</MenuItem>
                                <MenuItem value="photography">Photography (تصوير)</MenuItem>
                                <MenuItem value="decoration">Decoration (ديكور)</MenuItem>
                                <MenuItem value="dj">Sound & DJ (دي جي)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* الشبكة الثانية: توازي تام لحقول الأرقام والهويات */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Years of Experience" type="number" value={profileData.experience} onChange={(e) => handleChange('experience', e.target.value)} />
                    <InputField label="National ID Number" placeholder="Enter ID" value={profileData.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} />
                </Box>

                <InputField label="Portfolio Link" placeholder="https://..." value={profileData.portfolio} onChange={(e) => handleChange('portfolio', e.target.value)} />

                <FormControlLabel
                    control={<Checkbox checked={profileData.agreeToTerms} onChange={(e) => handleChange('agreeToTerms', e.target.checked)} sx={{ color: '#5a5043', '&.Mui-checked': { color: '#c5a059' }, p: 0, mr: 1, ml: 0 }} />}
                    label={<Typography variant="caption" sx={{ color: '#9a8f80', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>I agree to the Royal Events Membership Terms.</Typography>}
                    sx={{ mt: 0.5, display: 'flex', alignItems: 'center', ml: 0 }}
                />

                <Box sx={{ pt: 1 }}>
                    <Button text="COMPLETE REGISTRATION →" />
                </Box>
            </form>

            {/* زر العودة للخلف الفاخر */}
            <MuiButton
                onClick={onBack}
                disableRipple
                sx={{
                    color: '#9a8f80',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.18em',
                    textDecoration: 'underline',
                    textUnderlineOffset: '5px',
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
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

export default FreelancerProfileForm;