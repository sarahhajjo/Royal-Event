import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '../../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import Alert from '@mui/material/Alert'; // 1. استيراد Alert للتنبيه
function OTPVerificationForm({ onBack, onVerify }) {
    const theme = useTheme();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(59);
    const [error, setError] = useState(''); // 2. إضافة حالة للخطأ

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return false;

        // تحديث الرمز: هنا نستخدم القيمة مباشرة
        setOtp(prev => prev.map((data, idx) => (idx === index ? value : data)));

        // الانتقال للخانة التالية
        if (value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };
    const handleSubmit = async () => {
        setError('');
        const code = otp.join("");
        if (code.length < 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        // ننتظر نتيجة الـ onVerify (يجب أن يكون الدالة الأصلية في RegisterPage ترجع Promise أو نتيجة)
        const isSuccess = await onVerify(code);
        if (isSuccess === false) {
            setError('Invalid verification code. Please try again.');
        }
    };

    const handleResend = () => {
        setTimer(59);
        setError('');
        // هنا يمكنك إضافة استدعاء API لإعادة إرسال الكود
        console.log("Resending code...");
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }} className="animate-fade-in">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, textAlign: 'center', alignItems: 'center' }}>
                {/* مؤشر التقدم */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 32, height: 2, backgroundColor: theme.palette.mode === 'dark' ? '#261d19' : '#d1c5b4', borderRadius: '4px' }} />
                    <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: '4px' }} />
                    <Box sx={{ width: 32, height: 2, backgroundColor: theme.palette.mode === 'dark' ? '#261d19' : '#d1c5b4', borderRadius: '4px' }} />
                </Box>

                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: theme.palette.text.primary, mb: 1, fontWeight: 400, fontSize: '2.2rem', letterSpacing: '0.02em' }}>
                    Verify Your Account
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', fontSize: '13px' }}>
                    We have sent a 6-digit code to your contact address. Please enter it below to proceed.
                </Typography>
            </Box>

            {/* حقول الإدخال */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                {otp.map((data, index) => (
                    <Box
                        component="input"
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(e, index)}
                        onFocus={e => e.target.select()}
                        onKeyDown={e => handleKeyDown(e, index)} // التعديل هنا
                        sx={{
                            width: '48px',
                            height: '56px',
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(78, 70, 57, 0.25)' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            outline: 'none',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:focus': {
                                borderColor: '#c5a059',
                                backgroundColor: theme.palette.mode === 'dark' ? '#231b17' : '#fdfaf0',
                                boxShadow: '0 0 8px rgba(197, 160, 89, 0.2)'
                            }
                        }}
                    />
                ))}
            </Box>
            {error && <Alert severity="error" sx={{ fontSize: '12px' }}>{error}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <Button text="VERIFY & CONTINUE →" onClick={() => onVerify(otp.join(""))} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.15em', fontWeight: 500, fontSize: '11px' }}>
                        RESEND IN <Box component="span" sx={{ color: '#c5a059', ml: 0.5 }}>00:{timer < 10 ? `0${timer}` : timer}</Box>
                    </Typography>
                    <MuiButton
                        disabled={timer > 0}
                        disableRipple
                        onClick={handleResend}
                        sx={{
                            color: '#c5a059',
                            fontSize: '11px',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textDecoration: 'underline',
                            backgroundColor: 'transparent',
                            '&:disabled': { color: theme.palette.mode === 'dark' ? '#261d19' : '#ccc', textDecoration: 'none' },
                            '&:hover': { color: theme.palette.text.primary, backgroundColor: 'transparent' }
                        }}
                    >
                        RESEND CODE
                        </MuiButton>
                    </Box>

                <MuiButton
                    onClick={onBack}
                    disableRipple
                    sx={{
                        color: theme.palette.text.secondary,
                        textTransform: 'none',
                        letterSpacing: '0.18em',
                        fontSize: '14px',
                        fontFamily: "'Playfair Display', serif",
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                        alignSelf: 'center',
                        '&:hover': { color: theme.palette.text.primary, backgroundColor: 'transparent' }
                    }}
                >
                    Go Back
                </MuiButton>
            </Box>
        </Box>
    );
}

export default OTPVerificationForm;