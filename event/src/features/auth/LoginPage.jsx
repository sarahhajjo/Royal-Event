import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
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

        if (!formData.identity.trim() || !formData.password) {
            setLocalError('Please enter your credentials.');
            return;
        }

        dispatch(loginUser(formData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/company-dashboard');
            }
        });
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: isDark ? '#18120f' : '#FAF0D5', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, color: isDark ? '#eee0da' : '#2B211E', overflow: 'hidden', transition: 'background-color 0.3s' }}>

            {/* الجناح الأيسر - التصميم الفخم */}
            {/* الجناح الأيسر - التصميم الفخم */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                width: '50%',
                padding: '64px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
                borderRight: isDark ? '1px solid rgba(78, 70, 57, 0.25)' : '1px solid rgba(179, 140, 69, 0.25)'
            }}>
                {/* 💡 زيادة درجة التعتيم في الـ Overlay لتظهر النصوص بوضوح */}
                <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.7), rgba(24, 18, 15, 0.7)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)', '&:hover': { transform: 'scale(1.12)' } }} />

                {/* 💡 ألوان ثابتة ذهبية تبرز دائماً فوق الصورة */}
                <Box sx={{ position: 'relative', zIndex: 10, color: '#c5a059', textTransform: 'uppercase', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.25em' }}>✦ Royal Events ✦</Box>

                <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '460px' }}>
                    <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontWeight: 300, mb: 3, fontSize: '3.2rem', lineHeight: 1.15 }}>
                        Welcome to <br /><Box component="span" sx={{ color: '#c5a059', fontWeight: 400 }}>Bespoke Luxury</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#e0e0e0', fontSize: '14px', fontWeight: 300, lineHeight: 1.7 }}>
                        Sign in to manage and orchestrate exclusive experiences, connecting with elite partners and creators globally.
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', zIndex: 10, fontSize: '11px', color: '#c5a059', letterSpacing: '0.15em' }}>&copy; 2026 Royal Events International.</Box>
            </Box>

            {/* الجناح الأيمن - نموذج الدخول */}
            {/* الجناح الأيمن - نموذج الدخول */}
            {/* الجناح الأيمن - نموذج الدخول */}
            <Box sx={{
                width: { xs: '100%', md: '50%' },
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // التأكد من أخذ كامل طول الشاشة
                boxSizing: 'border-box',
                backgroundColor: isDark ? '#18120f' : '#FAF0D5'
            }}>

                {/* المحتوى الرئيسي (النموذج) - يأخذ مساحة المرونة (flexGrow) ليدفع الفوتر للأسفل */}
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                }}>
                    <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? '#c5a059' : '#b38c45', fontSize: '2.6rem' }}>Sign In</Typography>
                            <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', mt: 1 }}>Enter your credentials to access your portal</Typography>
                        </Box>

                        {(localError || error) && <Alert severity="error" sx={{ fontSize: '13px' }}>{localError || error}</Alert>}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <InputField label="Email or Phone" value={formData.identity} onChange={(e) => handleChange(e, 'identity')} />
                            <InputField label="Password" type="password" value={formData.password} onChange={(e) => handleChange(e, 'password')} />
                            <Button text={loading ? "OPENING GATES..." : "ENTER PORTAL"} type="submit" disabled={loading} />
                            {/*<button type="button" onClick={() => navigate('/admin-dashboard')} style={{ marginTop: '10px', padding: '10px', background: '#ccc', cursor: 'pointer' }}>*/}
                            {/*    GO TO ADMIN (Quick Link)*/}
                            {/*</button>*/}
                        </form>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E' }}>
                                Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: isDark ? '#c5a059' : '#b38c45', cursor: 'pointer', fontWeight: 600 }}>Create account</span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* الـ Footer السفلي */}
                {/* الـ Footer السفلي مع تعديل المسافات */}
                <Box sx={{
                    width: '100%',
                    pb: 4, // مسافة من أسفل الشاشة
                    pt: 2
                }}>
                    {/* الخط القاسم مع Margin من الأطراف */}
                    <Box sx={{
                        borderTop: isDark ? '1px solid rgba(78, 70, 57, 0.2)' : '1px solid rgba(179, 140, 69, 0.2)',
                        mx: 4, // المسافة من اليمين واليسار (الأطراف)
                        mb: 2  // مسافة بين الخط والنصوص
                    }} />

                    {/* صندوق النصوص والروابط */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 4 // مطابقة لمسافة الخط ليكونوا على نفس الخط
                    }}>
                        <Typography sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '9px', letterSpacing: '0.12em', fontFamily: "'Inter', sans-serif" }}>
                            © 2026 ROYAL EVENTS. ALL RIGHTS RESERVED.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2.5 }}>
                            <Box component="a" href="#" sx={{ color: isDark ? '#5a5043' : '#7A6F5E', textDecoration: 'none', fontSize: '9px', letterSpacing: '0.12em', '&:hover': { color: isDark ? '#c5a059' : '#b38c45' } }}>PRIVACY</Box>
                            <Box component="a" href="#" sx={{ color: isDark ? '#5a5043' : '#7A6F5E', textDecoration: 'none', fontSize: '9px', letterSpacing: '0.12em', '&:hover': { color: isDark ? '#c5a059' : '#b38c45' } }}>TERMS</Box>
                        </Box>
                    </Box>
                </Box>
            </Box>


        </Box>
    );
};

export default LoginPage;