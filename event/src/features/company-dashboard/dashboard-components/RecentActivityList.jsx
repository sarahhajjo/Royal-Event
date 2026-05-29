import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const activityIconMap = {
    booking: <ShoppingCartIcon sx={{ fontSize: '16px' }} />,
    job: <PersonAddIcon sx={{ fontSize: '16px' }} />,
    approved: <CheckCircleIcon sx={{ fontSize: '16px' }} />,
    action: <PriorityHighIcon sx={{ fontSize: '16px' }} />,
    payout: <AccountBalanceWalletIcon sx={{ fontSize: '16px' }} />
};

function RecentActivityList({ activityData }) {
    const defaultActivities = activityData || [
        { id: 1, text: 'New Booking Confirmed', sub: 'The Royal Gala - Dec 15th', time: '2 MINUTES AGO', type: 'booking', color: '#c5a059' },
        { id: 2, text: 'New Job Application', sub: 'Executive Sommelier (WIP events)', time: '14 MINUTES AGO', type: 'job', color: '#9a8f80' },
        { id: 3, text: 'Listing Approved', sub: 'Penthouse B - Skyline Suites', time: '1 HOUR AGO', type: 'approved', color: '#81c784' },
        { id: 4, text: 'Action Required', sub: "Contract renewal for 'Lumina Hall'", time: '3 HOURS AGO', type: 'action', color: '#e57373' },
        { id: 5, text: 'Payout Processed', sub: 'Weekly settlement ($42,500)', time: '5 HOURS AGO', type: 'payout', color: '#fff176' }
    ];

    return (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: '#140e0c', border: '1px solid rgba(78, 70, 57, 0.15)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: 2.5, width: { xs: '100%', lg: '340px' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: '#eee0da', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                    Recent Activity
                </Typography>
                <SortIcon sx={{ color: '#5a5043', fontSize: '18px' }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto', pr: 0.5 }}>
                {defaultActivities.map((act) => (
                    <Box key={act.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', textAlign: 'left' }}>
                        <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: 'rgba(28, 21, 18, 0.8)', color: act.color, border: `1px solid rgba(78, 70, 57, 0.25)`, display: 'flex', mt: 0.3 }}>
                            {activityIconMap[act.type]}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1 }}>
                            <Typography sx={{ color: '#eee0da', fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{act.text}</Typography>
                            <Typography sx={{ color: '#8a7f70', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>{act.sub}</Typography>
                            <Typography sx={{ color: '#5a5043', fontSize: '9px', fontWeight: 600, mt: 0.2, fontFamily: "'Inter', sans-serif" }}>{act.time}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Button variant="outlined" sx={{ mt: 'auto', border: '1px solid rgba(78, 70, 57, 0.3)', color: '#9a8f80', textTransform: 'none', fontSize: '12px', fontFamily: "'Inter', sans-serif", borderRadius: '8px', '&:hover': { borderColor: '#c5a059', color: '#eee0da' } }}>
                View Full Log
            </Button>
        </Paper>
    );
}

export default RecentActivityList;