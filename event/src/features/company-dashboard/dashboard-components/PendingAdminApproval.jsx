import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme, alpha } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// 💡 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER, DARK_CARD_SHADOW
} from '../../../utils/colorConstants';

function PendingAdminApproval({ approvalsData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const defaultApprovals = approvalsData || [
        { id: 1, title: 'Grand Crystal Ballroom - Hall Listing', time: 'Submitted: 2 hours ago', status: 'UNDER REVIEW' },
        { id: 2, title: 'Luxury Crystal Chandelier - Product Add', time: 'Submitted: 5 hours ago', status: 'VERIFYING ASSETS' },
        { id: 3, title: 'Royal Andalusia Palace - Ready Arrangement', time: 'Submitted: Yesterday', status: 'FINAL AUDIT' }
    ];

    return (
        <Paper elevation={0} sx={{
            p: 3,
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1,
            transition: 'background-color 0.3s ease', backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : `0 18px 40px ${alpha(GOLD, 0.1)}`
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '18px', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em', fontWeight: 700 }}>
                        Pending Admin Approval
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.35, backgroundColor: isDark ? alpha(GOLD, 0.15) : LIGHT_INPUT, borderRadius: '20px', border: `1px solid ${alpha(GOLD, 0.2)}` }}>
                        <Typography sx={{ color: GOLD, fontSize: '10px', fontWeight: 800, fontFamily: "'Inter', sans-serif", letterSpacing: '0.06em' }}>3 PENDING</Typography>
                    </Box>
                </Box>
                <VerifiedUserIcon sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : GOLD, fontSize: '18px' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.3 }}>
                {defaultApprovals.map((item) => (
                    <Box key={item.id} sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,
                        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                        border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.6)}`,
                        borderRadius: '14px'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.15, backgroundColor: alpha(GOLD, 0.1), borderRadius: '10px', color: GOLD, display: 'flex', border: `1px solid ${alpha(GOLD, 0.2)}` }}>
                                <BusinessCenterIcon sx={{ fontSize: '18px' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, textAlign: 'left' }}>
                                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{item.title}</Typography>
                                <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{item.time}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ px: 1.5, py: 0.5, backgroundColor: isDark ? alpha(GOLD, 0.15) : 'transparent', borderRadius: '999px', border: `1px solid ${alpha(GOLD, 0.3)}` }}>
                            <Typography sx={{ color: GOLD, fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '0.05em' }}>{item.status}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default PendingAdminApproval;