import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    CircularProgress,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import MuiButton from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

// 🚀 تأكدي من مسار ملف authSlice حسب هيكلة مشروعك
import { fetchProviderPolicy, acceptProviderPolicy } from './../features/auth/authSlice';

export default function ProviderPolicyDialog({ open, onSuccess }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const [policyText, setPolicyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAgreed, setIsAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            dispatch(fetchProviderPolicy()).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    // إذا كان موافقاً عليها مسبقاً من الداتا بيز، نتخطى النافذة فوراً للداشبورد
                    if (res.payload.already_accepted) {
                        onSuccess();
                    } else {
                        setPolicyText(res.payload.policy_text);
                    }
                } else {
                    // في حال فشل جلب السياسة
                    setPolicyText("تعذر جلب سياسة الاستخدام حالياً، يرجى المحاولة لاحقاً.");
                }
                setLoading(false);
            });
        }
    }, [open, dispatch, onSuccess]);

    const handleAccept = () => {
        setSubmitting(true);
        dispatch(acceptProviderPolicy()).then((res) => {
            setSubmitting(false);
            if (res.meta.requestStatus === 'fulfilled') {
                onSuccess(); // 🚀 التوجيه للوحة التحكم بعد الموافقة بنجاح
            } else {
                alert("حدث خطأ أثناء الموافقة على السياسة، يرجى المحاولة مرة أخرى.");
            }
        });
    };

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
            // منع إغلاق النافذة بالضغط خارجها لإجبار المستخدم على الموافقة
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    backgroundColor: isDark ? '#1c1512' : '#F8F6F2',
                    color: isDark ? '#eee0da' : '#2B211E',
                    borderRadius: '16px',
                    border: isDark ? '1px solid rgba(197, 160, 89, 0.2)' : 'none'
                }
            }}
        >
            <DialogTitle sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.8rem',
                color: isDark ? '#c5a059' : '#b38c45',
                borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
                pb: 2
            }}>
                Provider Policy & Subscription Terms
            </DialogTitle>

            <DialogContent sx={{ mt: 2, minHeight: '40vh' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress sx={{ color: isDark ? '#c5a059' : '#b38c45' }} />
                    </Box>
                ) : (
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                lineHeight: 1.8,
                                // 🚀 whiteSpace: 'pre-wrap' هامة جداً لكي تظهر الـ \n كأسطر جديدة وتنسيقات كما هي في البوستمان
                                whiteSpace: 'pre-wrap',
                                color: isDark ? '#d4c5b0' : '#4a4036'
                            }}
                        >
                            {policyText}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, flexDirection: 'column', alignItems: 'flex-start', borderTop: '1px solid rgba(197, 160, 89, 0.2)' }}>
                {!loading && (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    sx={{
                                        color: isDark ? '#c5a059' : '#b38c45',
                                        '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' }
                                    }}
                                />
                            }
                            label="I have read and agree to the Provider Policy & Subscription Terms."
                            sx={{ mb: 2, ml: 0 }}
                        />
                        <MuiButton
                            fullWidth
                            variant="contained"
                            disabled={!isAgreed || submitting}
                            onClick={handleAccept}
                            sx={{
                                backgroundColor: isDark ? '#c5a059' : '#2B211E',
                                color: isDark ? '#1c1512' : '#ffffff',
                                py: 1.5,
                                '&:hover': { backgroundColor: isDark ? '#d4b373' : '#4a3b34' },
                                '&:disabled': { backgroundColor: 'rgba(197, 160, 89, 0.3)' }
                            }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'ACCEPT & CONTINUE TO DASHBOARD'}
                        </MuiButton>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}