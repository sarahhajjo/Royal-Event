import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPVerificationForm from './components/OTPVerificationForm';
import AccountTypeForm from './components/AccountTypeForm';
import FreelancerProfileForm from './components/FreelancerProfileForm';
import CompanyProfileForm from './components/CompanyProfileForm';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('company'); // 💡 تم جعل القيمة الافتراضية 'company' تماشياً مع الرؤية الحالية
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

        if (emailRegex.test(input.trim())) {
            return { isValid: true, type: 'email' };
        } else if (phoneRegex.test(input.trim().replace(/[\s-]/g, ''))) {
            return { isValid: true, type: 'phone' };
        }
        return { isValid: false, type: null };
    };

    const handleNextToOTP = (e) => {
        if (e) e.preventDefault();

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.contactInfo.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError('Please fill in all elite fields before continuing.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please verify your entries.');
            return;
        }

        const checkInput = validateContactInfo(formData.contactInfo);
        if (!checkInput.isValid) {
            setError('Please enter a valid Email Address or Phone Number.');
            return;
        }

        setError('');
        setStep(2);
    };

    const handleVerifyOTP = (code) => {
        console.log("Verifying OTP Code:", code);
        setStep(3);
    };

    // 👑 المتحكم الذكي بنوع الحساب المستلم من AccountTypeForm للتحكم بالخطوات التالية
    const handleAccountTypeSelection = (selectedType) => {
        setAccountType(selectedType);
        if (selectedType === 'freelancer') {
            setStep(4); // التوجه لاستكمال ملف الفريلانسر التوضيحي
        } else if (selectedType === 'company') {
            setStep(5); // التوجه لاستكمال ملف الشركة
        }
    };

    // 👑 معالجة الإرسال النهائي والتحويل الفوري بناءً على الكنترول المحدد
    // 👑 تحديث معالجة الإرسال النهائي والتوجيه الصارم الفوري
    const handleFinalSubmit = (profileData) => {
        const checkInput = validateContactInfo(formData.contactInfo);

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            [checkInput.type]: formData.contactInfo,
            accountType,
            ...profileData
        };

        console.log("Final Registration Payload to backend:", payload);

        // 🛠️ التوجيه الصريح المباشر فوراً بدون alert المتصفح المزعج
        if (accountType === 'company') {
            // 🚀 يمكنكِ لاحقاً حقن عمل dispatch للـ action الخاص بالباك إند هنا
            navigate('/company-dashboard');
        } else {
            navigate('/freelancer-coming-soon');
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, backgroundColor: '#18120f', color: '#eee0da', overflow: 'hidden', position: 'relative' }}>

            {/* الجناح الأيسر السينمائي الأصلي المحدث (صورة الفندق الفاخرة) */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                width: '50%',
                padding: '48px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
                borderRight: '1px solid rgba(78, 70, 57, 0.25)'
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.55), rgba(24, 18, 15, 0.85)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)',
                        '&:hover': {
                            transform: 'scale(1.12)'
                        }
                    }}
                />

                {/* الشعار العلوي المتوهج */}
                <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.25em', color: '#c5a059', textTransform: 'uppercase', fontSize: '13px', fontWeight: 'bold' }}>
                    <span>✦ Royal Events ✦</span>
                </Box>

                {/* الحاوية النصية الكلاسيكية المحدثة */}
                <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '440px', mt: 'auto', mb: 3, textAlign: 'left' }}>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", color: '#c5a059', fontWeight: 300, mb: 1.5, fontSize: '2.5rem', lineHeight: 1.25 }}>
                        A portal to refined <br />
                        <Box component="span" sx={{ color: '#ffffff', fontWeight: 400 }}>experiences and bespoke luxury.</Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#d1c5b4', fontSize: '12px', fontWeight: 300, lineHeight: 1.6, letterSpacing: '0.02em' }}>
                        Join an exclusive collective where meticulous craftsmanship meets timeless elegance.
                    </Typography>
                </Box>

                {/* نص الحقوق السفلي المطابق للجهة اليسرى */}
                <Box sx={{ position: 'relative', zIndex: 10, fontSize: '11px', color: '#8a7f70', letterSpacing: '0.05em', opacity: 0.7 }}>
                    © 2026 Royal Events International.
                </Box>
            </Box>

            {/* الجناح الأيمن التفاعلي الفحمي */}
            <Box sx={{
                width: { xs: '100%', md: '50%' },
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#18120f',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>

                <Box sx={{ pt: 4 }} />

                {/* حاوية الاستمارة لإنشاء الحساب */}
                <Box sx={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: 3.5, mt: 5, mb: 4 }}>

                    {step === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, textAlign: 'left' }}>
                                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#eee0da', fontSize: '2.4rem', letterSpacing: '0.02em' }}>
                                    Create Account
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#9a8f80', fontSize: '12px' }}>
                                    Step into the world of Royal Events.
                                </Typography>
                            </Box>

                            {/* شريط مؤشرات التقدم الثلاثي */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} />
                                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                                <Box sx={{ width: 32, height: 2, backgroundColor: '#261d19', borderRadius: '4px' }} />
                            </Box>

                            <form onSubmit={handleNextToOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                    <InputField label="First Name" placeholder="Elias" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                                    <InputField label="Last Name" placeholder="Aurelius" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                                </Box>
                                <InputField label="Email Address or Phone Number" placeholder="elias@royalevents.com or +15550000000" value={formData.contactInfo} onChange={(e) => handleChange('contactInfo', e.target.value)} />
                                <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
                                <InputField label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />

                                {error && (
                                    <Alert severity="error" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.04)', color: '#ffcdd2', border: '1px solid rgba(183, 28, 28, 0.25)', borderRadius: '4px', fontSize: '12px', py: 0.8 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Box sx={{ pt: 1 }}>
                                    <Button text="CONTINUE" />
                                </Box>
                            </form>
                        </Box>
                    )}

                    {step === 2 && <OTPVerificationForm onBack={() => setStep(1)} onVerify={handleVerifyOTP} />}
                    {step === 3 && <AccountTypeForm onBack={() => setStep(2)} onContinue={handleAccountTypeSelection} />}
                    {step === 4 && <FreelancerProfileForm onBack={() => setStep(3)} onSubmit={handleFinalSubmit} />}
                    {step === 5 && <CompanyProfileForm onBack={() => setStep(3)} onSubmit={handleFinalSubmit} />}

                </Box>

                {/* التذييل الفاخر المصغر ذو المسافات المتباعدة الناعمة */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '100%',
                    px: { xs: 4, sm: 6, lg: 8 },
                    borderTop: '1px solid rgba(78, 70, 57, 0.35)',
                    pt: 2.5,
                    pb: 3,
                    boxSizing: 'border-box'
                }}>
                    <Typography
                        sx={{
                            color: '#5a5043',
                            fontSize: '9px',
                            fontWeight: 300,
                            letterSpacing: '0.12em',
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: 'nowrap',
                            opacity: 0.8
                        }}
                    >
                        © 2026 ROYAL EVENTS INTERNATIONAL. ALL RIGHTS RESERVED.
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 3,
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}>
                        <Box
                            component="a"
                            href="#"
                            sx={{
                                color: '#5a5043',
                                textDecoration: 'none',
                                fontSize: '9px',
                                fontWeight: 300,
                                letterSpacing: '0.12em',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'color 0.2s',
                                '&:hover': { color: '#c5a059' }
                            }}
                        >
                            HELP CENTER
                        </Box>
                        <Box
                            component="a"
                            href="#"
                            sx={{
                                color: '#5a5043',
                                textDecoration: 'none',
                                fontSize: '9px',
                                fontWeight: 300,
                                letterSpacing: '0.12em',
                                fontFamily: "'Inter', sans-serif",
                                transition: 'color 0.2s',
                                '&:hover': { color: '#c5a059' }
                            }}
                        >
                            PRIVACY
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default RegisterPage;