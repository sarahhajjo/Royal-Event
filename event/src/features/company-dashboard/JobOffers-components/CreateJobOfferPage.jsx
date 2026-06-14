import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Button, Typography, CircularProgress,
    Alert, Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EssentialDetails        from './components/EssentialDetails';
import FinancialsAndSpecifics  from './components/FinancialsAndSpecifics';
import RequirementsAndOutreach from './components/RequirementsAndOutreach';

// 💡 تم تحديث الاستيرادات لتتطابق مع الـ Slice الجديد
import {
    submitJobOffer,
    selectJobOfferStatus,
    clearJobOfferMessages,
} from './CreateJobOfferSlice';

export default function CreateJobOfferPage() {
    const dispatch  = useDispatch();
    const theme     = useTheme();
    const isDark    = theme.palette.mode === 'dark';

    // لم نعد بحاجة لجلب الفورم كاملاً هنا، الـ Slice سيتكفل بالبيانات
    const { status, error, successMessage } = useSelector(selectJobOfferStatus);

    const isLoading = status === 'loading';

    // 💡 دالة الإرسال أصبحت بسيطة جداً وتستدعي الـ Thunk مباشرة
    const handlePublish    = () => dispatch(submitJobOffer());

    // دالة وهمية للـ Draft حالياً بما أنه لا يوجد API لها
    const handleSaveDraft  = () => {
        alert("Save as Draft is currently not supported by the API.");
    };

    const handleCloseSnack = () => dispatch(clearJobOfferMessages());

    return (
        <Box
            sx={{
                minHeight:       '70vh',
                backgroundColor: 'transparent',
                py:              '-9%',
                ml:              {  md: '-3%' },
                mt:              '-3%',
                width:           '100%',
                boxSizing:       'border-box'
            }}
        >
            <Box sx={{ maxWidth: '1000px', width: '100%' }}>

                {/* ── Page Header ── */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box
                            component="svg"
                            viewBox="0 0 24 24"
                            sx={{
                                width: { xs: '28px', sm: '36px' },
                                height: { xs: '28px', sm: '36px' },
                                fill: 'none',
                                stroke: isDark ? '#c5a059' : '#b38c45',
                                strokeWidth: 1.2,
                            }}
                        >
                            <path d="M12 2.5L21.5 12L12 21.5L2.5 12Z" />
                        </Box>

                        <Typography
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize:   { xs: '2rem', sm: '2.5rem' },
                                fontWeight: 500,
                                color:      isDark ? '#c5a059' : '#b38c45',
                                lineHeight: 1.2,
                            }}
                        >
                            Create New Job Offer
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? '#9a8f80' : '#7A6F5E',
                            fontWeight: 300,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Define the requirements for your premium event staffing needs.
                    </Typography>
                </Box>

                {/* ── Form Sections ── */}
                <EssentialDetails />
                <FinancialsAndSpecifics />
                <RequirementsAndOutreach />

                {/* ── Inline Error ── */}
                {error && (
                    <Alert
                        severity="error"
                        onClose={handleCloseSnack}
                        sx={{ mb: 2, borderRadius: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* ── Action Buttons ── */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pb: 6 }}>
                    {/* Save as Draft */}
                    <Button
                        variant="outlined"
                        onClick={handleSaveDraft}
                        disabled={isLoading}
                        sx={{
                            borderColor: isDark ? '#5a4a30' : 'rgba(179, 140, 69, 0.4)',
                            color:       isDark ? '#ffffff' : '#2B211E',
                            '&:hover': {
                                borderColor:     isDark ? '#c5a059' : '#b38c45',
                                backgroundColor: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.05)',
                            },
                            px: 4, py: 1.2,
                            borderRadius: 1,
                            fontWeight: 500,
                            textTransform: 'none',
                            fontFamily: 'Inter',
                            letterSpacing: '0.03em'
                        }}
                    >
                        Save as Draft
                    </Button>

                    {/* Publish */}
                    <Button
                        variant="contained"
                        onClick={handlePublish}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} sx={{ color: '#18120f' }} /> : null}
                        sx={{
                            backgroundColor: isDark ? '#c5a059' : '#b38c45',
                            color:           '#131110',
                            '&:hover': {
                                backgroundColor: isDark ? '#d4ae6a' : '#c9a055',
                            },
                            px: 4, py: 1.2,
                            borderRadius: 1,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontFamily: 'Inter',
                            letterSpacing: '0.03em'
                        }}
                    >
                        Publish Job Offer
                    </Button>
                </Box>
            </Box>

            {/* ── Success Snackbar ── */}
            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={4000}
                onClose={handleCloseSnack}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}