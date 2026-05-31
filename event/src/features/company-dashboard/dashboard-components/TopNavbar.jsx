import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';

// استدعاء أيقونات التبديل
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ColorModeContext } from '../../../main'; // 🚀 استيراد سياق قلب الألوان

function TopNavbar() {
    const { mode, toggleColorMode } = useContext(ColorModeContext);

    return (
        <Box sx={{
            height: '80px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            backgroundColor: mode === 'dark' ? '#140e0c' : '#FAF0D5',
            borderBottom: mode === 'dark' ? '1px solid rgba(78, 70, 57, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)',
            transition: 'all 0.3s ease'
        }}>
            {/* Tabs Section */}
            <Box sx={{ display: 'flex', gap: 4 }}>
                {['Overview', 'Events', 'Concierge'].map((tab, i) => (
                    <Typography key={tab} sx={{
                        color: i === 0 ? (mode === 'dark' ? '#c5a059' : '#b38c45') : (mode === 'dark' ? '#9a8f80' : '#7A6F5E'),
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        position: 'relative',
                        '&:after': i === 0 ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -31,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: mode === 'dark' ? '#c5a059' : '#b38c45'
                        } : {}
                    }}>
                        {tab}
                    </Typography>
                ))}
            </Box>

            {/* Action Icons Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                {/* ☀️/🌙 الزر السحري لتحويل النمط بالكامل مع تأثيرات ارتداد الماوس */}
                <IconButton onClick={toggleColorMode} sx={{ color: mode === 'dark' ? '#c5a059' : '#b38c45', transition: 'transform 0.2s', '&:active': { transform: 'scale(0.9)' } }}>
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <IconButton sx={{ color: mode === 'dark' ? '#eee0da' : '#2B211E' }}><NotificationsNoneIcon /></IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, border: mode === 'dark' ? '1px solid #c5a059' : '1px solid #b38c45', backgroundColor: mode === 'dark' ? '#1c1512' : '#EFE4C9' }} src="/path-to-avatar.jpg" />
                    <Box sx={{ backgroundColor: mode === 'dark' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(179, 140, 69, 0.1)', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                        <SearchIcon sx={{ color: mode === 'dark' ? '#c5a059' : '#b38c45', fontSize: '16px' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default TopNavbar;