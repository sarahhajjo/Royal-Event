import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ identity: '', password: '' });
    const [localError, setLocalError] = useState('');

    const handleChange = (e, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
        if (localError) setLocalError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        // 1. التحقق من أن الخانات ليست فارغة فقط
        if (!formData.identity.trim() || !formData.password) {
            setLocalError('Please enter your credentials.');
            return;
        }

        dispatch(loginStart());

        // 2. محاكاة حركة دخول سريعة (1.2 ثانية) ثم الانتقال مباشرة مهما كانت البيانات المكتوبة
        setTimeout(() => {
            // تم إلغاء شرط الرقم المحدد، الآن أي مدخلات ستعبر البوابة بنجاح ✦
            dispatch(loginSuccess({
                token: 'mock_royal_token_xyz',
                user: { name: 'Executive Partner' }
            }));

            localStorage.setItem('token', 'mock_royal_token_xyz');

            // الانتقال الفوري والمبهر إلى لوحة تحكم الشركة
            navigate('/company-dashboard');

        }, 1200);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#18120f', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, color: '#eee0da', overflow: 'hidden', position: 'relative' }}>

            {/* الجناح الأيسر السينمائي الفخم */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                width: '50%',
                padding: '64px',
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
                        /* 💡 التعديل الدرامي: تمديد المدة وزيادة عمق الترانزشن للزوم */
                        transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)', // ترانزشن بطيء وعميق (Slow & Deep)

                        /* تأثير الزوم الدرامي (Deep Hover Zoom) */
                        '&:hover': {
                            transform: 'scale(1.12)' // زيادة نسبة الزوم لتأثير أقوى وأعمق كطلبكِ (كان 1.02)
                        }
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.25em', color: '#c5a059', textTransform: 'uppercase', fontSize: '13px', fontWeight: 'bold' }}>
                    <span>✦ Royal Events ✦</span>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '460px' }}>
                    <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: '#c5a059', fontWeight: 300, mb: 3, fontSize: '3.2rem', lineHeight: 1.15 }}>
                        Welcome to <br /><Box component="span" sx={{ color: '#ffffff', fontWeight: 400 }}>Bespoke Luxury</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#d1c5b4', fontSize: '14px', fontWeight: 300, lineHeight: 1.7, letterSpacing: '0.02em' }}>
                        Sign in to manage and orchestrate exclusive experiences, connecting with elite partners and creators globally.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 10, fontSize: '11px', color: '#8a7f70', letterSpacing: '0.15em' }}>
                    &copy; 2026 Royal Events International.
                </Box>
            </Box>

            {/* الجناح الأيمن التفاعلي للبيانات */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, sm: 8, lg: 12 }, backgroundColor: '#18120f' }}>
                <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 5 }} className="animate-fade-in">

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#c5a059', letterSpacing: '0.03em', fontSize: '2.6rem' }}>
                            Sign In
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9a8f80', fontSize: '14px', letterSpacing: '0.01em' }}>
                            Enter your credentials to access your portal
                        </Typography>
                    </Box>

                    {(localError || error) && (
                        <Alert severity="error" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.04)', color: '#ffcdd2', border: '1px solid rgba(183, 28, 28, 0.25)', borderRadius: '4px', fontSize: '13px', py: 1 }}>
                            {localError || error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                        <InputField
                            label="Email Address or Phone Number"
                            placeholder="username@domain.com or +963..."
                            value={formData.identity}
                            onChange={(e) => handleChange(e, 'identity')}
                        />

                        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <InputField
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleChange(e, 'password')}
                            />
                            <Box
                                component="span"
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: '16px',
                                    fontSize: '11px',
                                    color: '#c5a059',
                                    opacity: 0.55,
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { color: '#d6b26a', opacity: 1 }
                                }}
                            >
                                Forgot?
                            </Box>
                        </Box>

                        <Box sx={{ pt: 1.5 }}>
                            <Button text={loading ? "OPENING GATES..." : "ENTER PORTAL"} type="submit" disabled={loading} />
                        </Box>
                    </form>

                    <Box sx={{ fontSize: '13px', color: '#9a8f80', pt: 4, borderTop: '1px solid rgba(78, 70, 57, 0.18)', textAlign: 'center', letterSpacing: '0.02em' }}>
                        Don't have a partner account yet?{' '}
                        <Box component="button" type="button" onClick={() => navigate('/signup')} sx={{ color: '#c5a059', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', p: 0, ml: 0.5, '&:hover': { textDecoration: 'underline' } }}>
                            Create account
                        </Box>
                    </Box>
                </Box>
            </Box>

        </Box>
    );
};

export default LoginPage;