import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, Avatar, Popover, List, ListItem, Button, Skeleton, Switch, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useDispatch } from 'react-redux';
import { markAllAsRead } from '../../../notificationSlice';
import api from '../../../services/api';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER, DARK_CARD_SHADOW
} from '../../../utils/colorConstants';

const AVATAR_PALETTE = [GOLD, '#c0703e', '#a2673f', '#b38c45', '#8a6bbf', '#5b8f6b'];

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
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : alpha(BROWN_TEXT, 0.06) }} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="85%" height={16} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : alpha(BROWN_TEXT, 0.06) }} />
                <Skeleton variant="text" width="60%" height={14} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : alpha(BROWN_TEXT, 0.06) }} />
                <Skeleton variant="text" width="40%" height={12} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : alpha(BROWN_TEXT, 0.06) }} />
            </Box>
        </Box>
    );
}

// 💡 isDark: dark بتوصل من الأب كـ prop، isDarkProp، وإذا ما وصلت (undefined) منعتمد على theme.palette.mode
// هيك بنضمن إنه الـ Popover دايماً متوافق مع وضع الداشبورد الفعلي (Dark/Light) حتى لو الأب نسي يمررها
export default function NotificationsPopover({ id, open, anchorEl, onClose, isDark: isDarkProp }) {
    const muiTheme = useTheme();
    const isDark = typeof isDarkProp === 'boolean' ? isDarkProp : muiTheme.palette.mode === 'dark';

    const dispatch = useDispatch();
    const listRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errored, setErrored] = useState(false);
    const [scopeTab, setScopeTab] = useState('direct');
    const [onlyUnread, setOnlyUnread] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setErrored(false);
        try {
            const response = await api.get('/notifications');
            const dataArray = response.data?.data || response.data || [];
            setNotifications(dataArray);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
            setErrored(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            setFocusedIndex(-1);
            fetchNotifications();
        }
    }, [open, fetchNotifications]);

    const handleMarkAsRead = useCallback(async (notifId) => {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: 1 } : n));
        try {
            await api.patch(`/notifications/${notifId}/read`);
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
            await Promise.all(unreadNotifs.map(notif => api.patch(`/notifications/${notif.id}/read`)));
        } catch (error) {
            console.error('Failed to mark all as read', error);
            setNotifications(previous);
        }
    };

    const unreadTotal = notifications.filter(n => n.is_read === 0).length;

    const visibleNotifications = useMemo(() => {
        let list = notifications.filter(n => (n.scope || 'direct') === scopeTab);
        if (onlyUnread) list = list.filter(n => n.is_read === 0);
        return list;
    }, [notifications, scopeTab, onlyUnread]);

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
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            transitionDuration={220}
            marginThreshold={24}
            elevation={0}
            PaperProps={{
                elevation: 0,
                sx: {
                    mt: 2.5, width: 420,
                    height: 404, maxHeight: 404, minHeight: 404,
                    overflow: 'hidden', boxSizing: 'border-box',

                    background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                    backgroundImage: 'none !important',
                    backdropFilter: 'blur(24px) !important',
                    WebkitBackdropFilter: 'blur(24px) !important',

                    // 💡 حدود ذهبية أوضح بشوي بالوضع الفاتح عشان تبين على الخلفيات الفاتحة/الصور
                    border: isDark ? `${DARK_CARD_BORDER} !important` : `1.5px solid ${alpha(GOLD, 0.5)} !important`,
                    borderRadius: '18px !important',
                    boxShadow: isDark ? `${DARK_CARD_SHADOW} !important` : `0 18px 40px ${alpha(GOLD, 0.25)} !important`,

                    display: 'flex', flexDirection: 'column', flexShrink: 0
                }
            }}
        >
            <Box sx={{ px: 2.5, pt: 2.2, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, border: `2px solid ${isDark ? GOLD : BROWN_TEXT}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
                        <Typography sx={{ fontWeight: 700, color: isDark ? GOLD : BROWN_TEXT, fontSize: '1.25rem', letterSpacing: '-0.01em', fontFamily: "'Playfair Display', serif" }}>
                            Notifications
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mr: 0.5 }}>Only show unread</Typography>
                        <Switch
                            size="small" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)}
                            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: GOLD }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GOLD } }}
                        />
                        <Tooltip title="Refresh">
                            <IconButton size="small" onClick={fetchNotifications} sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT, '&:hover': { color: GOLD, backgroundColor: alpha(GOLD, 0.1) } }}>
                                <RefreshIcon sx={{ fontSize: '18px', animation: loading ? 'spin 0.8s linear infinite' : 'none', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Open notification settings">
                            <IconButton size="small" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT, '&:hover': { color: GOLD, backgroundColor: alpha(GOLD, 0.1) } }}><OpenInNewIcon sx={{ fontSize: '17px' }} /></IconButton>
                        </Tooltip>
                        <Tooltip title={unreadTotal > 0 ? 'Mark all as read' : 'Nothing to mark'}>
                            <span>
                                <IconButton size="small" onClick={handleMarkAllAsRead} disabled={unreadTotal === 0} sx={{ color: unreadTotal > 0 ? GOLD : (isDark ? 'rgba(255,255,255,0.2)' : alpha(MUTED_TEXT, 0.4)), '&:hover': { backgroundColor: alpha(GOLD, 0.1) } }}>
                                    <DoneAllIcon sx={{ fontSize: '18px' }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <IconButton size="small" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT, '&:hover': { color: GOLD, backgroundColor: alpha(GOLD, 0.1) } }}><MoreVertIcon sx={{ fontSize: '18px' }} /></IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mt: 2, borderBottom: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(GOLD, 0.2)}` }}>
                    {[{ key: 'direct', label: 'Direct' }, { key: 'watching', label: 'Watching' }].map(tab => (
                        <Box
                            key={tab.key} onClick={() => setScopeTab(tab.key)}
                            sx={{ cursor: 'pointer', pb: 1, fontSize: '13px', fontWeight: 600, color: scopeTab === tab.key ? GOLD : (isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT), borderBottom: scopeTab === tab.key ? `2px solid ${GOLD}` : '2px solid transparent' }}
                        >
                            {tab.label}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Typography sx={{ px: 2.5, pt: 1.5, pb: 0.5, fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: isDark ? 'rgba(255,255,255,0.4)' : alpha(MUTED_TEXT, 0.7), textTransform: 'uppercase' }}>
                Latest
            </Typography>

            <Box ref={listRef} sx={{
                flex: 1, minHeight: '100px', overflowY: 'auto', px: 1.25, pb: 1,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? alpha(GOLD, 0.3) : alpha(BROWN_TEXT, 0.3), borderRadius: '4px' },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: isDark ? alpha(GOLD, 0.5) : alpha(BROWN_TEXT, 0.5) }
            }}>
                {loading ? (
                    [0, 1, 2].map(i => <NotificationSkeletonRow key={i} isDark={isDark} />)
                ) : errored ? (
                    <Box sx={{ p: 5, textAlign: 'center' }}>
                        <ErrorOutlinedIcon sx={{ fontSize: 30, color: isDark ? 'rgba(255,255,255,0.3)' : alpha(GOLD, 0.4), mb: 1 }} />
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT, fontSize: '14px', mb: 1.5 }}>Couldn't load notifications</Typography>
                        <Button size="small" onClick={fetchNotifications} sx={{ textTransform: 'none', color: GOLD, fontWeight: 600 }}>Try again</Button>
                    </Box>
                ) : visibleNotifications.length === 0 ? (
                    <Box sx={{ p: 5, textAlign: 'center' }}>
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 30, color: isDark ? 'rgba(255,255,255,0.3)' : alpha(GOLD, 0.4), mb: 1, transform: 'rotate(-8deg)' }} />
                        <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : BROWN_TEXT, fontSize: '14px' }}>
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
                                        key={notif.id} onMouseEnter={() => setFocusedIndex(index)} onClick={() => notif.is_read === 0 && handleMarkAsRead(notif.id)}
                                        sx={{
                                            alignItems: 'flex-start', gap: 1.5, px: 1.5, py: 1.5, cursor: notif.is_read === 0 ? 'pointer' : 'default', borderRadius: '14px',
                                            backgroundColor: isFocused ? (isDark ? DARK_SURFACE_BG : alpha(GOLD, 0.08)) : 'transparent',
                                            border: isFocused ? (isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(GOLD, 0.3)}`) : '1px solid transparent',
                                            transition: 'background-color 0.15s ease, border-color 0.15s ease', animation: 'fadeSlideIn 0.25s ease both', animationDelay: `${Math.min(index, 8) * 30}ms`,
                                            '@keyframes fadeSlideIn': { from: { opacity: 0, transform: 'translateY(3px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                                        }}
                                    >
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '13px', fontWeight: 700, bgcolor: avatarColor, mt: 0.2, flexShrink: 0 }}>{initials}</Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ fontSize: '13.5px', color: isDark ? '#ffffff' : BROWN_TEXT, lineHeight: 1.45 }}>
                                                <Box component="span" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT }}>{actorName}</Box> {notif.action_text || notif.title} <Box component="span" sx={{ color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontWeight: 400, fontSize: '12.5px' }}>{formatRelativeTime(notif.created_at)}</Box>
                                            </Typography>
                                            {notif.task_title && <Typography sx={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.8)' : MUTED_TEXT, mt: 0.4 }}>{notif.task_title}</Typography>}
                                            {(notif.task_key || notif.task_status) && <Typography sx={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : alpha(MUTED_TEXT, 0.8), mt: 0.3 }}>{[notif.task_key, notif.task_status].filter(Boolean).join(' • ')}</Typography>}
                                            {notif.body && !notif.task_title && <Typography sx={{ fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.8)' : MUTED_TEXT, mt: 0.4 }}>{notif.body}</Typography>}
                                            {notif.grouped_count > 0 && (
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, mt: 1, px: 1, py: 0.4, borderRadius: '999px', backgroundColor: isDark ? alpha(GOLD, 0.15) : alpha(GOLD, 0.1) }}>
                                                    <Avatar sx={{ width: 16, height: 16, fontSize: '9px', bgcolor: avatarColor }}>{initials}</Avatar>
                                                    <Typography sx={{ fontSize: '12px', color: GOLD, fontWeight: 600 }}>+{notif.grouped_count} updates from {actorName}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        {notif.is_read === 0 && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GOLD, mt: 0.8, flexShrink: 0, boxShadow: `0 0 8px ${alpha(GOLD, 0.6)}` }} />}
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: isDark ? 'rgba(255,255,255,0.2)' : alpha(GOLD, 0.3), transform: 'rotate(-8deg)' }} />
                            <Typography sx={{ fontSize: '12.5px', color: isDark ? 'rgba(255,255,255,0.4)' : alpha(MUTED_TEXT, 0.7), mt: 1, lineHeight: 1.5 }}>That's all your notifications<br />from the last 30 days.</Typography>
                        </Box>
                    </>
                )}
            </Box>

            <Box sx={{ px: 2, py: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(GOLD, 0.2)}`, backgroundColor: isDark ? DARK_SURFACE_BG : alpha(GOLD, 0.05) }}>
                <Typography sx={{ fontSize: '11.5px', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>Press <Box component="span" sx={{ fontWeight: 700, color: isDark ? '#fff' : BROWN_TEXT }}>↓ ↑</Box> to move through notifications</Typography>
                <Tooltip title="↓ / ↑ move focus · Enter marks the focused notification as read">
                    <Button size="small" sx={{ textTransform: 'none', fontSize: '11.5px', color: isDark ? '#ffffff' : BROWN_TEXT, border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${alpha(GOLD, 0.4)}`, borderRadius: '8px', px: 1, py: 0.2, minWidth: 0, '&:hover': { backgroundColor: alpha(GOLD, 0.1) } }}>See all shortcuts</Button>
                </Tooltip>
            </Box>
        </Popover>
    );
}