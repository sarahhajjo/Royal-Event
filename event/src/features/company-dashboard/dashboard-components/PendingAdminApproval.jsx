import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
            backgroundColor: isDark ? '#140e0c' : '#EFE4C9', // ☀️ قلب خلفية البطاقة للألوان العاجية الملكية
            border: isDark ? '1px solid rgba(78, 70, 57, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            flex: 1,
            transition: 'background-color 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                        Pending Admin Approval
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.3, backgroundColor: isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(179, 140, 69, 0.15)', borderRadius: '20px', border: isDark ? '1px solid rgba(197, 160, 89, 0.2)' : '1px solid rgba(179, 140, 69, 0.25)' }}>
                        <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '10px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>3 PENDING</Typography>
                    </Box>
                </Box>
                <VerifiedUserIcon sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '18px' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {defaultApprovals.map((item) => (
                    <Box key={item.id} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: isDark ? '#1c1512' : '#FAF0D5', // ☀️ قلب خلفية الليستة الفردية للدرجة الرملية العاجية
                        border: isDark ? '1px solid rgba(78, 70, 57, 0.1)' : '1px solid rgba(179, 140, 69, 0.12)',
                        borderRadius: '12px'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.2, backgroundColor: isDark ? '#140e0c' : '#EFE4C9', borderRadius: '8px', color: isDark ? '#c5a059' : '#b38c45', display: 'flex' }}>
                                <BusinessCenterIcon sx={{ fontSize: '18px' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, textAlign: 'left' }}>
                                <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{item.title}</Typography>
                                <Typography sx={{ color: isDark ? '#5a5043' : '#7A6F5E', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{item.time}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ px: 1.5, py: 0.5, backgroundColor: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.08)', borderRadius: '6px', border: isDark ? '1px solid rgba(197, 160, 89, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)' }}>
                            <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{item.status}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default PendingAdminApproval;