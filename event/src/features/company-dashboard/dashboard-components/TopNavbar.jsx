import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';

function TopNavbar() {
    return (
        <Box sx={{
            height: '80px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            borderBottom: '1px solid rgba(78, 70, 57, 0.1)'
        }}>
            {/* Tabs Section */}
            <Box sx={{ display: 'flex', gap: 4 }}>
                {['Overview', 'Events', 'Concierge'].map((tab, i) => (
                    <Typography key={tab} sx={{
                        color: i === 0 ? '#c5a059' : '#9a8f80',
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
                            backgroundColor: '#c5a059'
                        } : {}
                    }}>
                        {tab}
                    </Typography>
                ))}
            </Box>

            {/* Action Icons Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ color: '#eee0da' }}><NotificationsNoneIcon /></IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, border: '1px solid #c5a059', backgroundColor: '#1c1512' }} src="/path-to-avatar.jpg" />
                    <Box sx={{ backgroundColor: 'rgba(197, 160, 89, 0.2)', p: 0.5, borderRadius: '4px' }}>
                        <SearchIcon sx={{ color: '#c5a059', fontSize: '16px' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default TopNavbar;