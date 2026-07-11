import React, { useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { ColorModeContext } from '../../../main';
import { markAllAsRead } from '../../../notificationSlice';

// لوحة ألوان دافئة للأفاتار — نفس عائلة الثيم (ذهبي/طيني) مع لمسات مميزة لكل شخص
const AVATAR_PALETTE = ['#b38c45', '#c0703e', '#5b8f6b', '#5b7fc7', '#a2673f', '#8a6bbf'];

const getAvatarColor = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

// وقت نسبي: "منذ 5 د"، "منذ 3 س"، إلخ
const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function NotificationSkeletonRow({ isDark }) {
    return (
        <Box sx={{ display: 'flex', gap: 1.5, p: 2 }}>
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="85%" height={16} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                <Skeleton variant="text" width="60%" height={14} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                <Skeleton variant="text" width="40%" height={12} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
            </Box>
        </Box>
    );
}

function TopNavbar({ onProfileClick }) {
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const isDark = mode === 'dark';

    const dispatch = useDispatch();
    const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });

    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [scopeTab, setScopeTab] = useState('direct'); // 'direct' | 'watching'
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const listRef = useRef(null);
    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;
    const goldColor = isDark ? '#c5a059' : '#b38c45';

    const fetchNotifications = async () => {
        setLoading(true);
        setErrored(false);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const dataArray = response.data?.data || response.data || [];
            setNotifications(dataArray);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        setFocusedIndex(-1);
        fetchNotifications();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = useCallback(async (notifId) => {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/notifications/${notifId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Failed to mark as read', error);
            setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 0 } : n));
        }
    }, []);

    const handleMarkAllAsRead = async () => {
        const unreadNotifs = notifications.filter(n => n.is_read === 0);
        if (unreadNotifs.length === 0) return;

        const previous = notifications;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        dispatch(markAllAsRead());

        try {
            const token = localStorage.getItem('token');
            await Promise.all(unreadNotifs.map(notif =>
                axios.patch(`http://127.0.0.1:8000/api/notifications/${notif.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));
        } catch (error) {
            console.error('Failed to mark all as read', error);
            setNotifications(previous);
        }
    };

    const unreadTotal = notifications.filter(n => n.is_read === 0).length;

    // Direct = موجّهة لك مباشرة، Watching = تتبع عنصر (scope اختياري بالبيانات، افتراضياً "direct")
    const visibleNotifications = useMemo(() => {
        let list = notifications.filter(n => (n.scope || 'direct') === scopeTab);
        if (onlyUnread) list = list.filter(n => n.is_read === 0);
        return list;
    }, [notifications, scopeTab, onlyUnread]);

    // تنقل بلوحة المفاتيح: أسهم فوق/تحت + Enter لتعليم كمقروء
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(prev => Math.min(prev + 1, visibleNotifications.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && focusedIndex >= 0) {
                const notif = visibleNotifications[focusedIndex];
                if (notif && notif.is_read === 0) handleMarkAsRead(notif.id);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, visibleNotifications, focusedIndex, handleMarkAsRead]);

    return (
        <Box sx={{
            height: '80px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            backgroundColor: isDark ? '#140e0c' : '#FAF0D5',
            borderBottom: isDark ? '1px solid rgba(78, 70, 57, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)',
            transition: 'all 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
                {['Overview', 'Events', 'Concierge'].map((tab, i) => (
                    <Typography key={tab} sx={{
                        color: i === 0 ? goldColor : (isDark ? '#9a8f80' : '#7A6F5E'),
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
                            backgroundColor: goldColor
                        } : {}
                    }}>
                        {tab}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={toggleColorMode} sx={{ color: goldColor, transition: 'transform 0.2s', '&:active': { transform: 'scale(0.9)' } }}>
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>

                <IconButton onClick={handleNotificationClick} sx={{ color: isDark ? '#eee0da' : '#2B211E' }}>
                    <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: 2, top: 4 } }}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>

                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transitionDuration={220}
                    marginThreshold={24}
                    PaperProps={{
                        style: {
                            height: 380,
                            maxHeight: 380,
                            minHeight: 380,
                            overflow: 'hidden',
                            boxSizing: 'border-box'
                        },
                        sx: {
                            mt: 2.5,
                            width: 400,
                            // نفس لون بطاقات الداشبورد (Total Revenue إلخ) بدل الأبيض/الشفاف
                            backgroundColor: isDark ? '#1c1512' : '#FFFFFF',
                            border: isDark ? '1px solid rgba(197, 160, 89, 0.2)' : '1px solid rgba(179, 140, 69, 0.15)',
                            borderRadius: '14px',
                            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.55)' : '0 20px 50px rgba(60,45,20,0.14)',
                            display: 'flex',
                            flexDirection: 'column',
                            flexShrink: 0
                        }
                    }}
                >
                    {/* هيدر */}
                    <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 700, color: isDark ? '#fff' : '#1c1512', fontSize: '1.25rem' }}>
                                Notifications
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography sx={{ fontSize: '13px', color: isDark ? '#9a8f80' : '#7A6F5E', mr: 0.5 }}>
                                    Only show unread
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={onlyUnread}
                                    onChange={(e) => setOnlyUnread(e.target.checked)}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: goldColor },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: goldColor }
                                    }}
                                />
                                <Tooltip title="Refresh">
                                    <IconButton size="small" onClick={fetchNotifications} sx={{ color: isDark ? '#9a8f80' : '#7A6F5E' }}>
                                        <RefreshIcon sx={{ fontSize: '18px', animation: loading ? 'spin 0.8s linear infinite' : 'none', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Open notification settings">
                                    <IconButton size="small" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E' }}>
                                        <OpenInNewIcon sx={{ fontSize: '17px' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={unreadTotal > 0 ? 'Mark all as read' : 'Nothing to mark'}>
                                    <span>
                                        <IconButton size="small" onClick={handleMarkAllAsRead} disabled={unreadTotal === 0} sx={{ color: unreadTotal > 0 ? goldColor : (isDark ? '#4a423a' : '#c9bda6') }}>
                                            <DoneAllIcon sx={{ fontSize: '18px' }} />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <IconButton size="small" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E' }}>
                                    <MoreVertIcon sx={{ fontSize: '18px' }} />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* تبويبات Direct / Watching */}
                        <Box sx={{ display: 'flex', gap: 3, mt: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
                            {[
                                { key: 'direct', label: 'Direct' },
                                { key: 'watching', label: 'Watching' }
                            ].map(tab => (
                                <Box
                                    key={tab.key}
                                    onClick={() => setScopeTab(tab.key)}
                                    sx={{
                                        cursor: 'pointer',
                                        pb: 1,
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: scopeTab === tab.key ? goldColor : (isDark ? '#9a8f80' : '#7A6F5E'),
                                        borderBottom: scopeTab === tab.key ? `2px solid ${goldColor}` : '2px solid transparent'
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Typography sx={{ px: 2.5, pt: 1.5, pb: 0.5, fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: isDark ? '#7a7062' : '#9E9484', textTransform: 'uppercase' }}>
                        Latest
                    </Typography>

                    {/* جسم القائمة — minHeight: 0 ضروري ليسكرول الصندوق فعلاً بدل ما يتمدد بارتفاع كل الإشعارات */}
                    <Box ref={listRef} style={{ flex: 1, minHeight: '100px', overflowY: 'auto' }} sx={{ px: 1, pb: 1 }}>
                        {loading ? (
                            [0, 1, 2].map(i => <NotificationSkeletonRow key={i} isDark={isDark} />)
                        ) : errored ? (
                            <Box sx={{ p: 5, textAlign: 'center' }}>
                                <ErrorOutlinedIcon sx={{ fontSize: 30, color: isDark ? '#8a7f70' : '#b0a690', mb: 1 }} />
                                <Typography sx={{ color: isDark ? '#8a7f70' : '#7A6F5E', fontSize: '14px', mb: 1.5 }}>
                                    Couldn't load notifications
                                </Typography>
                                <Button size="small" onClick={fetchNotifications} sx={{ textTransform: 'none', color: goldColor, fontWeight: 600 }}>
                                    Try again
                                </Button>
                            </Box>
                        ) : visibleNotifications.length === 0 ? (
                            <Box sx={{ p: 5, textAlign: 'center' }}>
                                <InsertDriveFileOutlinedIcon sx={{ fontSize: 30, color: isDark ? '#4a423a' : '#d8cbb0', mb: 1, transform: 'rotate(-8deg)' }} />
                                <Typography sx={{ color: isDark ? '#8a7f70' : '#7A6F5E', fontSize: '14px' }}>
                                    {onlyUnread ? 'No unread notifications' : `Nothing in ${scopeTab === 'direct' ? 'Direct' : 'Watching'} yet`}
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <List sx={{ p: 0 }}>
                                    {visibleNotifications.map((notif, index) => {
                                        const actorName = notif.actor_name || notif.title || 'Someone';
                                        const initials = getInitials(actorName);
                                        const avatarColor = getAvatarColor(actorName);
                                        const isFocused = index === focusedIndex;

                                        return (
                                            <ListItem
                                                key={notif.id}
                                                onMouseEnter={() => setFocusedIndex(index)}
                                                onClick={() => notif.is_read === 0 && handleMarkAsRead(notif.id)}
                                                sx={{
                                                    alignItems: 'flex-start',
                                                    gap: 1.5,
                                                    px: 1.5,
                                                    py: 1.5,
                                                    cursor: notif.is_read === 0 ? 'pointer' : 'default',
                                                    borderRadius: '10px',
                                                    backgroundColor: isFocused
                                                        ? (isDark ? 'rgba(197, 160, 89, 0.14)' : 'rgba(179, 140, 69, 0.08)')
                                                        : 'transparent',
                                                    transition: 'background-color 0.15s ease',
                                                    animation: 'fadeSlideIn 0.25s ease both',
                                                    animationDelay: `${Math.min(index, 8) * 30}ms`,
                                                    '@keyframes fadeSlideIn': {
                                                        from: { opacity: 0, transform: 'translateY(3px)' },
                                                        to: { opacity: 1, transform: 'translateY(0)' }
                                                    }
                                                }}
                                            >
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '13px', fontWeight: 700, bgcolor: avatarColor, mt: 0.2, flexShrink: 0 }}>
                                                    {initials}
                                                </Avatar>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: '13.5px', color: isDark ? '#eee0da' : '#2B211E', lineHeight: 1.45 }}>
                                                        <Box component="span" sx={{ fontWeight: 700 }}>{actorName}</Box>{' '}
                                                        {notif.action_text || notif.title}{' '}
                                                        <Box component="span" sx={{ color: isDark ? '#7a7062' : '#9E9484', fontWeight: 400, fontSize: '12.5px' }}>
                                                            {formatRelativeTime(notif.created_at)}
                                                        </Box>
                                                    </Typography>

                                                    {notif.task_title && (
                                                        <Typography sx={{ fontSize: '13px', color: isDark ? '#c5b9a8' : '#5A5043', mt: 0.4 }}>
                                                            {notif.task_title}
                                                        </Typography>
                                                    )}

                                                    {(notif.task_key || notif.task_status) && (
                                                        <Typography sx={{ fontSize: '12px', color: isDark ? '#7a7062' : '#9E9484', mt: 0.3 }}>
                                                            {[notif.task_key, notif.task_status].filter(Boolean).join(' • ')}
                                                        </Typography>
                                                    )}

                                                    {notif.body && !notif.task_title && (
                                                        <Typography sx={{ fontSize: '13px', color: isDark ? '#c5b9a8' : '#5A5043', mt: 0.4 }}>
                                                            {notif.body}
                                                        </Typography>
                                                    )}

                                                    {notif.grouped_count > 0 && (
                                                        <Box sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.6,
                                                            mt: 1,
                                                            px: 1,
                                                            py: 0.4,
                                                            borderRadius: '999px',
                                                            backgroundColor: isDark ? 'rgba(91,127,199,0.15)' : 'rgba(91,127,199,0.08)'
                                                        }}>
                                                            <Avatar sx={{ width: 16, height: 16, fontSize: '9px', bgcolor: avatarColor }}>{initials}</Avatar>
                                                            <Typography sx={{ fontSize: '12px', color: '#5b7fc7', fontWeight: 600 }}>
                                                                +{notif.grouped_count} updates from {actorName}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {notif.is_read === 0 && (
                                                    <Box sx={{
                                                        width: 8, height: 8, borderRadius: '50%',
                                                        backgroundColor: '#5b7fc7',
                                                        mt: 0.8, flexShrink: 0
                                                    }} />
                                                )}
                                            </ListItem>
                                        );
                                    })}
                                </List>

                                {/* رسالة نهاية القائمة */}
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: isDark ? '#4a423a' : '#d8cbb0', transform: 'rotate(-8deg)' }} />
                                    <Typography sx={{ fontSize: '12.5px', color: isDark ? '#7a7062' : '#9E9484', mt: 1, lineHeight: 1.5 }}>
                                        That's all your notifications<br />from the last 30 days.
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* شريط اختصارات لوحة المفاتيح */}
                    <Box sx={{
                        px: 2, py: 1.2,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'
                    }}>
                        <Typography sx={{ fontSize: '11.5px', color: isDark ? '#7a7062' : '#9E9484' }}>
                            Press <Box component="span" sx={{ fontWeight: 700 }}>↓ ↑</Box> to move through notifications
                        </Typography>
                        <Tooltip title="↓ / ↑ move focus · Enter marks the focused notification as read">
                            <Button size="small" sx={{ textTransform: 'none', fontSize: '11.5px', color: isDark ? '#c5b9a8' : '#5A5043', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', px: 1, py: 0.2, minWidth: 0 }}>
                                See all shortcuts
                            </Button>
                        </Tooltip>
                    </Box>
                </Popover>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                    <Avatar
                        onClick={onProfileClick}
                        sx={{
                            width: 32,
                            height: 32,
                            border: isDark ? '1px solid #c5a059' : '1px solid #b38c45',
                            backgroundColor: isDark ? '#1c1512' : '#EFE4C9',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                        src="/path-to-avatar.jpg"
                    />
                    <Box sx={{ backgroundColor: isDark ? 'rgba(197, 160, 89, 0.2)' : 'rgba(179, 140, 69, 0.1)', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                        <SearchIcon sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default TopNavbar;
