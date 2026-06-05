import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles'; // 🚀 استدعاء قارئ المود من MUI
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
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark'; // 👑 كاشف النمط الحالي

    const defaultStats = statsData || [
        { id: 1, title: 'Total Revenue', value: '$1.24M', info: '+12% this month', icon: 'revenue' },
        { id: 2, title: 'Active Listings', value: '42', info: 'Premium venues', icon: 'listings' },
        { id: 3, title: 'Pending Requests', value: '18', info: 'Needs review', icon: 'pending', alert: true },
    ];

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3.5,
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {defaultStats.map((stat) => (
                <Paper
                    key={stat.id}
                    elevation={0}
                    sx={{
                        p: 2.5,
                        backgroundColor: isDark ? '#1c1512' : '#EFE4C9', // ☀️ تبديل الخلفية الفخمة للعاج الملكي
                        border: isDark ? '1px solid rgba(78, 70, 57, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: isDark ? '0 12px 24px rgba(197, 160, 89, 0.08)' : '0 12px 24px rgba(179, 140, 69, 0.12)',
                            borderColor: isDark ? 'rgba(197, 160, 89, 0.3)' : 'rgba(179, 140, 69, 0.4)'
                        },
                        '&:active': {
                            transform: 'scale(0.98) translateY(-2px)',
                            transition: 'all 0.05s ease'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                            {stat.title}
                        </Typography>
                        <Box sx={{ display: 'flex', p: 0.8, backgroundColor: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(179, 140, 69, 0.08)', borderRadius: '8px' }}>
                            {iconMap[stat.icon]}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography sx={{ color: isDark ? '#ffffff' : '#2B211E', fontSize: '26px', fontWeight: 500, fontFamily: "'Playfair Display', serif", textAlign: 'left' }}>
                            {stat.value}
                        </Typography>
                        <Typography sx={{ color: stat.alert ? '#ff8a80' : (isDark ? '#5a5043' : '#7A6F5E'), fontSize: '11px', fontFamily: "'Inter', sans-serif", textAlign: 'left' }}>
                            {stat.alert ? `! ${stat.info}` : stat.info}
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}

export default CompanyStatsCards;