import React from 'react';
import { Box, Typography, Button as MuiButton, CircularProgress, Paper } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { T, typography, avatarBaseSx } from '../Theme.jsx';

// 👑 الدالة السحرية لتصحيح مسار الصور
const getImageUrl = (path) => {
    // صورة افتراضية فخمة في حال عدم وجود صورة للخدمة
    const defaultImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=200";

    if (!path) return defaultImage;
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    const mode = import.meta.env.VITE_ENV_MODE || 'ngrok';
    const apiUrl = mode === 'ngrok'
        ? (import.meta.env.VITE_API_NGROK || 'https://preflight-refusal-luminous.ngrok-free.dev/api')
        : (import.meta.env.VITE_API_LOCAL || 'http://127.0.0.1:8000/api');

    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};

export default function ApprovalList({ items, status, actionStatusMap, onViewDetails, onApprove, onReject }) {

    if (status === "loading") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: T.gold }} />
            </Box>
        );
    }

    if (!items || items.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: T.cardBg,
                    border: `1px solid ${T.border}`,
                    borderRadius: '8px'
                }}
            >
                <Typography sx={{ color: T.textMuted, fontSize: '0.85rem', fontFamily: typography.fontFamily }}>
                    No pending approval requests found at the moment.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {items.map((item) => {
                const actionState = actionStatusMap[item.id];
                const isApproving = actionState === "approving";
                const isRejecting = actionState === "rejecting";

                const titleText = typeof item.title === 'object' ? (item.title?.en || item.title?.ar || 'Untitled') : item.title;
                const descText = typeof item.description === 'object' ? (item.description?.en || item.description?.ar || '') : item.description;

                // 👑 استخراج المسار وتمريره للدالة السحرية
                const rawImagePath = item.imageUrl || (item.images && item.images.length > 0 ? (item.images[0].url || item.images[0]) : null);
                const imageSrc = getImageUrl(rawImagePath);

                return (
                    <Paper
                        key={item.id}
                        elevation={0}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            backgroundColor: T.cardBg,
                            border: `1px solid ${T.border}`,
                            borderRadius: '8px',
                            p: 3,
                            gap: 3,
                            transition: 'background 0.15s ease, border-color 0.15s ease',
                            '&:hover': {
                                backgroundColor: T.rowHover,
                                borderColor: T.infoBorder,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: { xs: '100%', md: '60%' } }}>
                            <Box
                                component="img"
                                src={imageSrc}
                                alt={titleText}
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '6px',
                                    objectFit: 'cover',
                                    border: `1px solid ${T.border}`,
                                    filter: T.avatarFilter,
                                    flexShrink: 0
                                }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
                                <Typography
                                    sx={{
                                        color: T.textPrimary,
                                        fontWeight: typography.rowName.fontWeight,
                                        fontSize: typography.rowName.fontSize,
                                        fontFamily: typography.fontFamily,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {titleText}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: T.textMuted,
                                        fontSize: typography.rowContact.fontSize,
                                        fontFamily: typography.fontFamily,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {descText}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                    <Typography sx={{ color: T.goldLabel, fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                                        Category: {item.category?.name || 'General'}
                                    </Typography>
                                    <Typography sx={{ color: T.textMuted, fontSize: '0.65rem', fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                                        Company: {item.company?.name || item.submittedBy || 'Partner'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-end', md: 'flex-start' } }}>

                            <MuiButton
                                onClick={() => onViewDetails(item)}
                                sx={{
                                    color: T.textMuted,
                                    borderColor: T.infoBorder,
                                    fontSize: '0.78rem',
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.8,
                                    borderRadius: '6px',
                                    '&:hover': { color: T.gold, borderColor: T.gold, bgcolor: 'transparent' }
                                }}
                                variant="outlined"
                                startIcon={<VisibilityIcon sx={{ fontSize: '16px !important' }} />}
                            >
                                Details
                            </MuiButton>

                            {item.status === 'pending_approval' ? (
                                <>
                                    <MuiButton
                                        onClick={() => onReject(item.id)}
                                        disabled={isRejecting || isApproving}
                                        sx={{
                                            color: '#b33939',
                                            borderColor: '#e0b4b4',
                                            fontSize: '0.78rem',
                                            textTransform: 'none',
                                            px: 2,
                                            py: 0.8,
                                            borderRadius: '6px',
                                            '&:hover': { backgroundColor: 'rgba(179, 57, 57, 0.05)', borderColor: '#b33939' }
                                        }}
                                        variant="outlined"
                                        startIcon={isRejecting ? <CircularProgress size={14} color="error" /> : <HighlightOffIcon sx={{ fontSize: '16px !important' }} />}
                                    >
                                        {isRejecting ? 'Rejecting...' : 'Reject'}
                                    </MuiButton>

                                    <MuiButton
                                        onClick={() => onApprove(item.id)}
                                        disabled={isRejecting || isApproving}
                                        sx={{
                                            backgroundColor: T.gold,
                                            color: T.btnText,
                                            fontWeight: 700,
                                            fontSize: '0.78rem',
                                            textTransform: 'none',
                                            px: 2.5,
                                            py: 0.8,
                                            borderRadius: '6px',
                                            boxShadow: 'none',
                                            '&:hover': { backgroundColor: T.goldHover }
                                        }}
                                        variant="contained"
                                    >
                                        {isApproving ? <CircularProgress size={14} sx={{ color: T.btnText }} /> : 'Approve'}
                                    </MuiButton>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: '6px',
                                        backgroundColor: item.status === 'approved' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                        color: item.status === 'approved' ? '#2ecc71' : '#e74c3c',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        border: `1px solid ${item.status === 'approved' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`
                                    }}
                                >
                                    {item.status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                );
            })}
        </Box>
    );
}