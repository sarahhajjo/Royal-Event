import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LayersIcon from '@mui/icons-material/Layers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const iconMap = {
    revenue: <AttachMoneyIcon sx={{ color: '#c5a059', fontSize: '20px' }} />,
    listings: <LayersIcon sx={{ color: '#c5a059', fontSize: '20px' }} />,
    pending: <AccessTimeIcon sx={{ color: '#c5a059', fontSize: '20px' }} />,
    events: <EventAvailableIcon sx={{ color: '#c5a059', fontSize: '20px' }} />
};

function CompanyStatsCards({ statsData }) {
    const defaultStats = statsData || [
        { id: 1, title: 'Total Revenue', value: '$1.24M', info: '+12% this month', icon: 'revenue' },
        { id: 2, title: 'Active Listings', value: '42', info: 'Premium venues', icon: 'listings' },
        { id: 3, title: 'Pending Requests', value: '18', info: 'Needs review', icon: 'pending', alert: true },
        { id: 4, title: 'Upcoming Events', value: '24', info: 'Confirmed bookings', icon: 'events' }
    ];

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5, width: '100%' }}>
            {defaultStats.map((stat) => (
                <Paper
                    key={stat.id}
                    elevation={0}
                    sx={{
                        p: 2.5,
                        backgroundColor: '#1c1512',
                        border: '1px solid rgba(78, 70, 57, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#9a8f80', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                            {stat.title}
                        </Typography>
                        <Box sx={{ display: 'flex', p: 0.8, backgroundColor: 'rgba(197, 160, 89, 0.05)', borderRadius: '8px' }}>
                            {iconMap[stat.icon]}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ color: '#eee0da', fontSize: '26px', fontWeight: 500, fontFamily: "'Playfair Display', serif" }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ color: stat.alert ? '#ff8a80' : '#5a5043', fontSize: '11px', fontFamily: "'Inter', sans-serif" }}>
                            {stat.alert ? `! ${stat.info}` : stat.info}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

export default CompanyStatsCards;