import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BusinessIcon from '@mui/icons-material/Business';

import InputField from '../../components/InputField';
import Button from '../../components/Button';

import OTPVerificationForm from './components/OTPVerificationForm';
import FreelancerProfileForm from './components/FreelancerProfileForm';
import CompanyProfileForm from './components/CompanyProfileForm';
import AccountTypeForm from './components/AccountTypeForm';

import { useDispatch } from 'react-redux';
import {registerUser, verifyOTPEmail, verifyOTPUser} from './authSlice';

function RegisterPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('company');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactInfo: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const validateContactInfo = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (emailRegex.test(input.trim())) return { isValid: true, type: 'email' };
        if (phoneRegex.test(input.trim().replace(/[\s-]/g, ''))) return { isValid: true, type: 'phone' };
        return { isValid: false, type: null };
    };

    // في دالة handleFirstStepSubmit
    const handleFirstStepSubmit = (e) => {
        if (e) e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.contactInfo.trim() || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields before continuing.');
            return;
        }

        const registerPayload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            identity: formData.contactInfo,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            role: 'provider' // دائماً provider
        };

        dispatch(registerUser(registerPayload)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                setError('');
                setStep(2);
            } else {
                setError(result.payload?.message || 'Registration failed.');
            }
        });
    };

// في دالة handleVerifyOTP للتأكد من الانتقال الصحيح
    const handleVerifyOTP = async (code) => {
        setError('');
        const infoValidation = validateContactInfo(formData.contactInfo);

        let result;
        if (infoValidation.type === 'email') {
            result = await dispatch(verifyOTPEmail({ email: formData.contactInfo, otp: code }));
        } else {
            result = await dispatch(verifyOTPUser({ phone: formData.contactInfo, code: code }));
        }

        if (result.meta.requestStatus === 'fulfilled') {
            if (accountType === 'freelancer') setStep(3);
            else setStep(4);
            return true; // نجح
        } else {
            return false; // فشل
        }
    };

    const handleFinalSubmit = (profileData) => {
        // هنا يتم إرسال بيانات البروفايل (Company/Freelancer Profile)
        console.log("Finalizing profile:", profileData);
        // dispatch(setupProviderProfile(profileData));
        navigate('/company-dashboard');
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, overflow: 'hidden' }}>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '50%', padding: '48px', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(78, 70, 57, 0.25)' }}>
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.55), rgba(24, 18, 15, 0.85)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)', '&:hover': { transform: 'scale(1.12)' } }} />
                <Box sx={{ position: 'relative', zIndex: 10, color: '#c5a059', textTransform: 'uppercase', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.25em' }}>✦ Royal Events ✦</Box>
                <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '440px', mt: 'auto', mb: 3, textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ color: '#c5a059', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, mb: 1, display: 'block', fontSize: '11px' }}>Heritage & Excellence</Typography>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", color: '#c5a059', fontWeight: 300, mb: 1.5, fontSize: '2.5rem', lineHeight: 1.25 }}>
                        A portal to refined <br />
                        <Box component="span" sx={{ color: theme.palette.text.primary, fontWeight: 400 }}>experiences and bespoke luxury.</Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '12px', fontWeight: 300, lineHeight: 1.6 }}>Join an exclusive collective where meticulous craftsmanship meets timeless elegance.</Typography>
                </Box>
                <Box sx={{ position: 'relative', zIndex: 10, fontSize: '11px', color: '#8a7f70', opacity: 0.7 }}>© 2026 Royal Events International.</Box>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '50%' }, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.palette.background.default, overflowY: 'auto', p: 4, boxSizing: 'border-box' }}>
                <Box sx={{ pt: 2 }} />

                <Box sx={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 3.5, my: 'auto' }}>
                    {step === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }} className="animate-fade-in">
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, textAlign: 'center', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}><Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} /><Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} /><Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} /></Box>
                                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: theme.palette.text.primary, fontSize: '2.2rem', letterSpacing: '0.02em' }}>Create Account</Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '13px' }}>Step into the world of Royal Events.</Typography>
                            </Box>

                            <form onSubmit={handleFirstStepSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2.5 }}>
                                    <InputField label="First Name" id="firstName" name="first_name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                                    <InputField label="Last Name" id="lastName" name="last_name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                                </Box>
                                <InputField label="Email or Phone" id="contactInfo" name="identity" value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} />
                                <InputField label="Password" id="password" name="password" type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
                                <InputField label="Confirm Password" id="confirmPassword" name="password_confirmation" type="password" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                                    <Typography sx={{ color: '#c5a059', fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center' }}>
                                        Membership Category
                                    </Typography>

                                </Box>

                                {error && <Alert severity="error" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.04)', color: '#ffcdd2', border: '1px solid rgba(183, 28, 28, 0.25)', fontSize: '12px', py: 0.6 }}>{error}</Alert>}
                                <Box sx={{ pt: 1 }}><Button text="CONTINUE" type="submit" /></Box>
                            </form>
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '13px', mt: 1, textAlign: 'center' }}>Already have an account?
                                <Box
                                    component="span"
                                    onClick={() => navigate('/')}
                                    sx={{ color: '#c5a059', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
                                >
                                    Sign In
                                </Box>
                            </Typography>
                        </Box>
                    )}

                    {step === 2 && <OTPVerificationForm onBack={() => setStep(1)} onVerify={handleVerifyOTP} />}

                    {/* خطوة اختيار النوع الجديدة */}
                    {step === 3 && (
                        <AccountTypeForm
                            onBack={() => setStep(2)}
                            onContinue={(type) => {
                                setAccountType(type); // تخزين الاختيار (freelancer/company)
                                setStep(4); // الانتقال لخطوة إكمال الملف
                            }}
                        />
                    )}

                    {/* خطوة إكمال الملف الشخصي */}
                    {step === 4 && accountType === 'freelancer' && (
                        <FreelancerProfileForm onBack={() => setStep(3)} onSubmit={handleFinalSubmit} accountType={accountType} />
                    )}
                    {step === 4 && accountType === 'company' && (
                        <CompanyProfileForm onBack={() => setStep(3)} onSubmit={handleFinalSubmit} accountType={accountType} />
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid rgba(78, 70, 57, 0.2)', pt: 2, boxSizing: 'border-box' }}>
                    <Typography sx={{ color: '#5a5043', fontSize: '9px', letterSpacing: '0.12em', fontFamily: "'Inter', sans-serif" }}>© 2026 ROYAL EVENTS. ALL RIGHTS RESERVED.</Typography>
                    <Box sx={{ display: 'flex', gap: 2.5 }}><Box component="a" href="#" sx={{ color: '#5a5043', textDecoration: 'none', fontSize: '9px', letterSpacing: '0.12em', '&:hover': { color: '#c5a059' } }}>PRIVACY</Box><Box component="a" href="#" sx={{ color: '#5a5043', textDecoration: 'none', fontSize: '9px', letterSpacing: '0.12em', '&:hover': { color: '#c5a059' } }}>TERMS</Box></Box>
                </Box>
            </Box>
        </Box>
    );
}

export default RegisterPage;