import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function PendingAdminApproval({ approvalsData }) {
    const defaultApprovals = approvalsData || [
        { id: 1, title: 'Grand Crystal Ballroom - Hall Listing', time: 'Submitted: 2 hours ago', status: 'UNDER REVIEW' },
        { id: 2, title: 'Luxury Crystal Chandelier - Product Add', time: 'Submitted: 5 hours ago', status: 'VERIFYING ASSETS' },
        { id: 3, title: 'Royal Andalusia Palace - Ready Arrangement', time: 'Submitted: Yesterday', status: 'FINAL AUDIT' }
    ];

    return (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#140e0c', border: '1px solid rgba(78, 70, 57, 0.15)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: '#eee0da', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                        Pending Admin Approval
                    </Typography>
                    <Box sx={{ px: 1.2, py: 0.3, backgroundColor: 'rgba(197, 160, 89, 0.1)', borderRadius: '20px', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                        <Typography sx={{ color: '#c5a059', fontSize: '10px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>3 PENDING</Typography>
                    </Box>
                </Box>
                <VerifiedUserIcon sx={{ color: '#5a5043', fontSize: '18px' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {defaultApprovals.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#1c1512', border: '1px solid rgba(78, 70, 57, 0.1)', borderRadius: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.2, backgroundColor: '#140e0c', borderRadius: '8px', color: '#c5a059', display: 'flex' }}>
                                <BusinessCenterIcon sx={{ fontSize: '18px' }} />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, textAlign: 'left' }}>
                                <Typography sx={{ color: '#eee0da', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>{item.title}</Typography>
                                <Typography sx={{ color: '#5a5043', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{item.time}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ px: 1.5, py: 0.5, backgroundColor: 'rgba(197, 160, 89, 0.05)', borderRadius: '6px', border: '1px solid rgba(197, 160, 89, 0.15)' }}>
                            <Typography sx={{ color: '#c5a059', fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{item.status}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default PendingAdminApproval;