import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';

function OTPVerificationForm({ onBack, onVerify }) {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(59);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }} className="animate-fade-in">
            <div>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", color: '#eee0da', mb: 1, fontWeight: 600 }}>
                    Verify Your Account
                </Typography>
                <Typography variant="caption" sx={{ color: '#9a8f80', display: 'block' }}>
                    We have sent a 6-digit code to your email address. Please enter it below to proceed.
                </Typography>
            </div>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 32, height: 2, backgroundColor: '#c5a059', borderRadius: 1 }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#231b17', borderRadius: 1 }} />
                <Box sx={{ width: 32, height: 2, backgroundColor: '#231b17', borderRadius: 1 }} />
            </Box>

            {/* مدخلات الـ OTP المصممة هندسياً بـ MUI */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                {otp.map((data, index) => (
                    <Box
                        component="input"
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        sx={{
                            width: '48px',
                            height: '56px',
                            backgroundColor: '#1c1512',
                            color: '#eee0da',
                            border: '2px solid #261d19',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            '&:focus': { borderColor: '#c5a059', backgroundColor: '#231b17' }
                        }}
                    />
                ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <Button text="VERIFY & CONTINUE →" onClick={() => onVerify(otp.join(""))} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#9a8f80', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                        RESEND IN <Box component="span" sx={{ color: '#c5a059', ml: 1 }}>00:{timer < 10 ? `0${timer}` : timer}</Box>
                    </Typography>
                    <MuiButton disabled={timer > 0} sx={{ color: '#c5a059', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.15em', textDecoration: 'underline', '&:disabled': { color: '#261d19' } }}>
                        RESEND CODE
                    </MuiButton>
                </Box>

                <MuiButton onClick={onBack} sx={{ color: '#9a8f80', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', textDecoration: 'underline', '&:hover': { color: '#eee0da' } }}>
                    Go Back
                </MuiButton>
            </Box>
        </Box>
    );
}

export default OTPVerificationForm;