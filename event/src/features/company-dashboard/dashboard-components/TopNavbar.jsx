import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Badge from '@mui/material/Badge';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';

import { useSelector } from 'react-redux';
import { ColorModeContext } from '../../../main';
import { alpha } from '@mui/material/styles';

// 🌟 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../utils/colorConstants';

// 🌟 استيراد المكونات التي قمنا بفصلها
import NotificationsPopover from './NotificationsPopover.jsx';
import ChatDrawer from './ChatDrawer';

function TopNavbar({ onProfileClick }) {
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const isDark = mode === 'dark';

    const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });

    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    const currentUserId = useSelector(state => state.auth.user?.id);

    // 💡 استخدام الألوان الموحدة
    const activeColor = isDark ? GOLD : BROWN_TEXT;
    const inactiveColor = isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT;
    const goldColor = GOLD;

    const notifOpen = Boolean(notifAnchorEl);
    const notifId = notifOpen ? 'notifications-popover' : undefined;

    return (
        <Box sx={{
            height: '84px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            // 💡 خلفية زجاجية متطابقة
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            transition: 'all 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
                {['Overview', 'Events', 'Concierge'].map((tab, i) => (
                    <Typography key={tab} sx={{
                        color: i === 0 ? activeColor : inactiveColor,
                        fontSize: '14px',
                        fontWeight: i === 0 ? 800 : 600,
                        cursor: 'pointer',
                        position: 'relative',
                        letterSpacing: '0.02em',
                        '&:after': i === 0 ? {
                            content: '""', position: 'absolute', bottom: -30, left: 0, width: '100%', height: '2px', backgroundColor: activeColor, borderRadius: '999px'
                        } : {}
                    }}>
                        {tab}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                {/* 🌙 زر الوضع الليلي/النهاري */}
                <IconButton onClick={toggleColorMode} sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, width: 38, height: 38, backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}` }}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                {/* 💬 زر الشات */}
                <IconButton onClick={() => setChatOpen(true)} sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, width: 38, height: 38, backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}` }}>
                    <ChatBubbleOutlinedIcon />
                </IconButton>

                {/* 🔔 زر الإشعارات */}
                <IconButton onClick={(e) => setNotifAnchorEl(e.currentTarget)} sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, width: 38, height: 38, backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.5)}` }}>
                    <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: 2, top: 4 } }}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>

                <NotificationsPopover
                    id={notifId}
                    open={notifOpen}
                    anchorEl={notifAnchorEl}
                    onClose={() => setNotifAnchorEl(null)}
                    isDark={isDark}
                    goldColor={goldColor}
                />

                <ChatDrawer
                    open={chatOpen}
                    onClose={() => setChatOpen(false)}
                    isDark={isDark}
                    goldColor={goldColor}
                    currentUserId={currentUserId}
                />

                {/* الملف الشخصي */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                    <Avatar onClick={onProfileClick} sx={{ width: 32, height: 32, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, backgroundColor: isDark ? DARK_SURFACE_BG : '#ffffff', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'scale(1.05)' } }} src="/path-to-avatar.jpg" />
                    <Box sx={{ backgroundColor: isDark ? alpha(GOLD, 0.15) : alpha(GOLD, 0.1), p: 0.5, borderRadius: '4px', display: 'flex' }}>
                        <SearchIcon sx={{ color: GOLD, fontSize: '16px' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default TopNavbar;