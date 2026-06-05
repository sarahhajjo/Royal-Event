import React, { useState,useEffect } from 'react';
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
import { useTheme } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux'; // استيراد الـ hooks
import { fetchCategories, setupfreelancerProfile } from '../authSlice';

function FreelancerProfileForm({ onBack, onSubmit }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.auth.categories);
    useEffect(() => {
        dispatch(fetchCategories()); // جلب البيانات عند تحميل المكون
    }, [dispatch]);


    const [profileData, setProfileData] = useState({
        brandName: '', specialty: '', experience: '0', idNumber: '', portfolio: '', agreeToTerms: false
    });

    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!profileData.agreeToTerms) return;

        const payload = {
            brand_name: profileData.brandName,
            provider_type: 'freelancer',
            national_id: profileData.idNumber,
            experience_years: parseInt(profileData.experience),
            // نرسل الـ ID المختار من القائمة
            categories: profileData.specialty ? [parseInt(profileData.specialty)] : [],
            portfolio: profileData.portfolio || null
        };

        dispatch(setupfreelancerProfile(payload)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                // الانتقال للداشبورد هنا
            }
        });
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%' }} className="animate-fade-in">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left', width: '100%' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Playfair Display', serif",
                        color: isDark ? '#eee0da' : '#2B211E',
                        fontSize: '2.6rem',
                        letterSpacing: '0.02em',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                        width: 'max-content'
                    }}
                >
                    Complete Your Profile
                </Typography>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px', lineHeight: 1.5, width: '100%' }}>
                    Provide your professional details to join our exclusive network of event experts.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: isDark ? '#261d19' : '#E5D9B8', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: isDark ? '#261d19' : '#E5D9B8', borderRadius: '4px' }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: isDark ? '#c5a059' : '#b38c45', borderRadius: '4px' }} />
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Brand/Stage Name" placeholder="e.g. Noir Studio" value={profileData.brandName} onChange={(e) => handleChange('brandName', e.target.value)} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <Box component="label" sx={{ fontSize: '11px', fontWeight: 400, color: isDark ? '#c5a059' : '#b38c45', textTransform: 'uppercase', letterSpacing: '0.25em', textAlign: 'left' }}>
                            Primary Specialty
                        </Box>
                        <FormControl variant="standard" fullWidth>
                            <Select
                                value={profileData.specialty}
                                displayEmpty
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                sx={{
                                    color: isDark ? '#eee0da' : '#2B211E',
                                    fontSize: '15px',
                                    fontFamily: "'Inter', sans-serif",
                                    py: 0.2,
                                    height: '28px',
                                    '&:before': { borderBottom: isDark ? '1px solid rgba(78, 70, 57, 0.45) !important' : '1px solid rgba(122, 111, 94, 0.45) !important' },
                                    '&:after': { borderBottom: isDark ? '2px solid #c5a059 !important' : '2px solid #b38c45 !important' },
                                    '& .MuiSelect-select': { padding: '2px 0px !important', textAlign: 'left' },
                                    '& .MuiSvgIcon-root': { color: isDark ? '#c5a059' : '#b38c45' }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: isDark ? '#1c1512' : '#EFE4C9',
                                            color: isDark ? '#eee0da' : '#2B211E',
                                            borderRadius: '0px',
                                            border: isDark ? '1px solid rgba(197, 160, 89, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)'
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>Select specialty</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name_en}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Years of Experience" type="number" value={profileData.experience} onChange={(e) => handleChange('experience', e.target.value)} />
                    <InputField label="National ID Number" placeholder="Enter ID" value={profileData.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} />
                </Box>

                <InputField label="Portfolio Link (Optional)" placeholder="https://..." value={profileData.portfolio} onChange={(e) => handleChange('portfolio', e.target.value)} />
                <FormControlLabel
                    control={<Checkbox checked={profileData.agreeToTerms} onChange={(e) => handleChange('agreeToTerms', e.target.checked)} />}
                    label="I agree to the Royal Events Membership Terms."
                />

                <Box sx={{ pt: 1 }}>
                    <Button text="COMPLETE REGISTRATION →" type="submit" />
                </Box>
            </form>

            <MuiButton
                onClick={onBack}
                disableRipple
                sx={{
                    color: isDark ? '#9a8f80' : '#7A6F5E',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '0.18em',
                    textDecoration: 'underline',
                    textUnderlineOffset: '5px',
                    backgroundColor: 'transparent',
                    alignSelf: 'center',
                    '&:hover': { color: isDark ? '#eee0da' : '#2B211E', backgroundColor: 'transparent' }
                }}
            >
                Go Back
            </MuiButton>
        </Box>
    );
}

export default FreelancerProfileForm;