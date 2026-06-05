import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchCategories, fetchDistricts, setupProfile} from '../authSlice'; // استيراد الـ thunk من الـ slice
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
import { useNavigate } from 'react-router-dom';

function CompanyProfileForm({ onBack, onSubmit ,accountType }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    // جلب الفئات من الـ Redux Store
    const user = useSelector((state) => state.auth.user); // تأكدي أن الـ user object يحتوي على الـ id
    const categories = useSelector((state) => state.auth.categories);
    const districts = useSelector((state) => state.auth.districts);
    const [companyData, setCompanyData] = useState({
        brand_name: '',
        provider_type:'company', // التحديد التلقائي بناءً على اختيار المستخدم
        tax_number: '',
        registration_no: '',
        district_id: '',
        categories: [],
        contact_name: '',
        position: '',
        agreeToTerms: false
    });
    // جلب البيانات عند تحميل المكون
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchDistricts());
    }, [dispatch]);



    const handleChange = (field, value) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        console.log("Token being sent from browser:", token);

        if (!token) {
            alert("خطأ: لا يوجد توكن! يرجى التأكد من تسجيل الدخول.");
            return;
        }
        if (companyData.agreeToTerms && onSubmit) {
            // نرسل البيانات ومعها الـ ID الخاص بالمستخدم
            dispatch(setupProfile(companyData)).then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    navigate('/company-dashboard');
                }
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }} className="animate-fade-in">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: 'left', width: '100%' }}>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? '#eee0da' : '#2B211E', fontSize: '2.3rem', letterSpacing: '0.08em', fontWeight: 400 }}>
                    Complete Company Profile
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '13px' }}>
                    Enter your legal and operational details to finalize corporate membership.
                </Typography>
            </Box>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, alignItems: 'flex-end' }}>
                    <InputField label="Brand/Stage Name" id="brand_name" name="brand_name" placeholder="Royal Events Ltd" value={companyData.brand_name} onChange={(e) => handleChange('brand_name', e.target.value)} />
                    <InputField label="CR Number" id="registration_no" name="registration_no" placeholder="1010XXXXXX" value={companyData.registration_no} onChange={(e) => handleChange('registration_no', e.target.value)} />
                </Box>

                <InputField label="Tax Number" id="tax_number" name="tax_number" placeholder="123456789" value={companyData.tax_number} onChange={(e) => handleChange('tax_number', e.target.value)} />

                {/* Service Categories (Dynamic) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                    <Box component="label" sx={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: isDark ? '#c5a059' : '#b38c45', textTransform: 'uppercase' }}>Service Categories</Box>
                    <FormControl variant="standard" fullWidth>
                        <Select
                            multiple // للسماح باختيار أكثر من فئة كما في Postman
                            value={companyData.categories}
                            onChange={(e) => handleChange('categories', e.target.value)}
                            renderValue={(selected) => selected.map(id => categories.find(c => c.id === id)?.name_en).join(', ')}
                            // ...
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name_en}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Headquarters Location */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                    <Box component="label" sx={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: isDark ? '#c5a059' : '#b38c45', textTransform: 'uppercase' }}>Headquarters Location</Box>
                    <FormControl variant="standard" fullWidth>
                        <Select
                            value={companyData.district_id || ''}
                            onChange={(e) => handleChange('district_id', e.target.value)}
                            sx={{ color: isDark ? '#eee0da' : '#2B211E' }}
                        >
                            {districts.map((d) => (
                                <MenuItem key={d.id} value={d.id}>
                                    {d.name_en}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <FormControlLabel
                    control={<Checkbox checked={companyData.agreeToTerms} onChange={(e) => handleChange('agreeToTerms', e.target.checked)} />}
                    label={<Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E' }}>I verify that this company is legally registered.</Typography>}
                />

                <Button text="COMPLETE REGISTRATION →" type="submit" />
            </form>

            <MuiButton onClick={onBack} sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', textTransform: 'none', textDecoration: 'underline' }}>
                Go Back
            </MuiButton>
        </Box>
    );
}

export default CompanyProfileForm;