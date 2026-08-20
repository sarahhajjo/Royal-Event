import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Button, Typography, CircularProgress,
    Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EssentialDetails        from './components/EssentialDetails';
import FinancialsAndSpecifics  from './components/FinancialsAndSpecifics';
import RequirementsAndOutreach from './components/RequirementsAndOutreach';

import {
    submitJobOffer,
    selectJobOfferStatus,
    clearJobOfferMessages,
} from './CreateJobOfferSlice';

// 💡 استيراد الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, TITLE_TEXT_LIGHT,
    LIGHT_CARD, LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER
} from '../../../utils/colorConstants';

export default function CreateJobOfferPage() {
    const dispatch  = useDispatch();
    const theme     = useTheme();
    const isDark    = theme.palette.mode === 'dark';

    const { status, error, successMessage } = useSelector(selectJobOfferStatus);
    const isLoading = status === 'loading';

    const handlePublish    = () => dispatch(submitJobOffer());

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
                            sx={{
                                width: 14,
                                height: 14,
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                border: `2px solid ${isDark ? theme.palette.primary.main : BROWN_TEXT}`,
                                transform: 'rotate(45deg)',
                                boxShadow: `0 0 10px ${isDark ? theme.palette.primary.main + '40' : 'rgba(74, 59, 50, 0.2)'}`,
                                flexShrink: 0
                            }}
                        />

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2.5rem',
                                // 💡 بني بالفاتح، وذهبي بالداكن
                                color: isDark ? theme.palette.primary.main : BROWN_TEXT,
                                fontWeight: 50,
                                m: 0
                            }}
                        >
                            Create New Job Offer
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT,
                            fontWeight: isDark ? 300 : 500,
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

                {/* ── Action Buttons ── */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pb: 6 }}>
                    <Button
                        variant="outlined"
                        onClick={handleSaveDraft}
                        disabled={isLoading}
                        sx={{
                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : LIGHT_BORDER,
                            color:       isDark ? '#ffffff' : BROWN_TEXT,
                            '&:hover': {
                                borderColor:     GOLD,
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 59, 50, 0.05)',
                            },
                            px: 4, py: 1.2,
                            borderRadius: 1,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontFamily: 'Inter',
                            letterSpacing: '0.03em'
                        }}
                    >
                        Save as Draft
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handlePublish}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} sx={{ color: '#18120f' }} /> : null}
                        sx={{
                            backgroundColor: GOLD,
                            color:           '#131110',
                            '&:hover': {
                                backgroundColor: '#d4b06a',
                            },
                            px: 4, py: 1.2,
                            borderRadius: 1,
                            fontWeight: 700,
                            textTransform: 'none',
                            fontFamily: 'Inter',
                            letterSpacing: '0.03em'
                        }}
                    >
                        Publish Job Offer
                    </Button>
                </Box>
            </Box>

            {/* 💡 نافذة الأخطاء بتأثير الزجاج */}
            <Dialog
                open={Boolean(error)}
                onClose={handleCloseSnack}
                PaperProps={{
                    sx: {
                        bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                        backdropFilter: 'blur(12px)',
                        borderRadius: '12px',
                        minWidth: '350px',
                        textAlign: 'center',
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ color: '#c0392b', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                    Notice
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: isDark ? '#ffffff' : '#1A120D', fontSize: '1.05rem', mt: 1, fontWeight: 600, whiteSpace: 'pre-line' }}>
                        {error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                        onClick={handleCloseSnack}
                        variant="contained"
                        sx={{
                            bgcolor: GOLD,
                            color: '#131110',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4,
                            '&:hover': { bgcolor: '#b38c45' }
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

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