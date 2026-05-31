import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
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

        dispatch(loginStart());

        setTimeout(() => {
            dispatch(loginSuccess({
                token: 'mock_royal_token_xyz',
                user: { name: 'Executive Partner' }
            }));
            localStorage.setItem('token', 'mock_royal_token_xyz');
            navigate('/company-dashboard');
        }, 1200);
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: isDark ? '#18120f' : '#FAF0D5', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, color: isDark ? '#eee0da' : '#2B211E', overflow: 'hidden', transition: 'background-color 0.3s' }}>

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
                borderRight: isDark ? '1px solid rgba(78, 70, 57, 0.25)' : '1px solid rgba(179, 140, 69, 0.25)'
            }}>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.55), rgba(24, 18, 15, 0.85)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)',
                        '&:hover': { transform: 'scale(1.12)' }
                    }}
                />
                <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.25em', color: isDark ? '#c5a059' : '#b38c45', textTransform: 'uppercase', fontSize: '13px', fontWeight: 'bold' }}>
                    <span>✦ Royal Events ✦</span>
                </Box>
                <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '460px' }}>
                    <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: isDark ? '#c5a059' : '#b38c45', fontWeight: 300, mb: 3, fontSize: '3.2rem', lineHeight: 1.15 }}>
                        Welcome to <br /><Box component="span" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 400 }}>Bespoke Luxury</Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: isDark ? '#d1c5b4' : '#5A5043', fontSize: '14px', fontWeight: 300, lineHeight: 1.7 }}>
                        Sign in to manage and orchestrate exclusive experiences, connecting with elite partners and creators globally.
                    </Typography>
                </Box>
                <Box sx={{ position: 'relative', zIndex: 10, fontSize: '11px', color: isDark ? '#8a7f70' : '#7A6F5E', letterSpacing: '0.15em' }}>
                    &copy; 2026 Royal Events International.
                </Box>
            </Box>

            {/* الجناح الأيمن التفاعلي للبيانات */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, sm: 8, lg: 12 }, backgroundColor: isDark ? '#18120f' : '#FAF0D5' }}>
                <Box sx={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 5 }} className="animate-fade-in">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: isDark ? '#c5a059' : '#b38c45', fontSize: '2.6rem' }}>
                            Sign In
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '14px' }}>
                            Enter your credentials to access your portal
                        </Typography>
                    </Box>

                    {(localError || error) && (
                        <Alert severity="error" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.04)', color: '#ffcdd2', border: '1px solid rgba(183, 28, 28, 0.25)', borderRadius: '4px', fontSize: '13px', py: 1 }}>
                            {localError || error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                        <InputField label="Email Address or Phone Number" placeholder="username@domain.com" value={formData.identity} onChange={(e) => handleChange(e, 'identity')} />
                        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <InputField label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange(e, 'password')} />
                            <Box component="span" sx={{ position: 'absolute', right: 0, bottom: '16px', fontSize: '11px', color: isDark ? '#c5a059' : '#b38c45', opacity: 0.7, cursor: 'pointer', zIndex: 10, '&:hover': { color: isDark ? '#d6b26a' : '#FFE088' } }}>Forgot?</Box>
                        </Box>
                        <Box sx={{ pt: 1.5 }}><Button text={loading ? "OPENING GATES..." : "ENTER PORTAL"} type="submit" disabled={loading} /></Box>
                    </form>

                    <Box sx={{ fontSize: '13px', color: isDark ? '#9a8f80' : '#7A6F5E', pt: 4, borderTop: isDark ? '1px solid rgba(78, 70, 57, 0.18)' : '1px solid rgba(179, 140, 69, 0.2)', textAlign: 'center' }}>
                        Don't have a partner account yet?{' '}
                        <Box component="button" type="button" onClick={() => navigate('/signup')} sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', p: 0, ml: 0.5, '&:hover': { textDecoration: 'underline' } }}>Create account</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;