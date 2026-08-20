import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Box, Typography, IconButton, Avatar, TextField, List, ListItem, Skeleton, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { chatService } from '../../../services/chatService';
import api from '../../../services/api';

const GOLD = '#c5a059';
const BROWN_TEXT = '#4a3b32';
const MUTED_TEXT = '#7a6652';
const LIGHT_BG = 'linear-gradient(180deg, rgba(255, 248, 232, 0.98) 0%, rgba(225, 190, 115, 0.18) 100%)';
const DARK_BG = 'linear-gradient(180deg, rgba(28, 21, 34, 0.96) 0%, rgba(20, 26, 42, 0.86) 100%)';
const SURFACE_LIGHT = 'rgba(255, 255, 255, 0.55)';
const SURFACE_DARK = 'rgba(255,255,255,0.05)';

const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} د`;
    if (diffHr < 24) return `منذ ${diffHr} س`;
    if (diffDay === 1) return 'أمس';
    if (diffDay < 30) return `منذ ${diffDay} ي`;
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
};

export default function ChatDrawer({ open, onClose, isDark, goldColor, currentUserId }) {
    const [view, setView] = useState('list');
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(false);

    const [clientNames, setClientNames] = useState({}); // تخزين الأسماء { id: name }
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [draft, setDraft] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [newReceiverId, setNewReceiverId] = useState(''); // لبدء محادثة جديدة
    const [creatingConversation, setCreatingConversation] = useState(false);

    // 1. مراقبة المحادثات لايف
    useEffect(() => {
        let unsubscribe;
        if (open && currentUserId) {
            setView('list');
            setConversationsLoading(true);
            unsubscribe = chatService.listenToConversations(currentUserId, (liveConversations) => {
                setConversations(liveConversations);
                setConversationsLoading(false);
            });
        }
        return () => { if (unsubscribe) unsubscribe(); };
    }, [open, currentUserId]);

    // 2. جلب الأسماء الحقيقية للمستخدمين من لارافيل
    useEffect(() => {
        const fetchNames = async () => {
            if (conversations.length === 0) return;

            const otherIds = conversations.map(c =>
                c.participants?.find(id => String(id) !== String(currentUserId))
            ).filter(Boolean);

            const uniqueIds = [...new Set(otherIds)];
            const idsToFetch = uniqueIds.filter(id => !clientNames[id]);

            if (idsToFetch.length === 0) return;

            try {
                const response = await api.post('/chat/users-info', { ids: idsToFetch });
                const newNamesMap = { ...clientNames };
                response.data.forEach(user => {
                    newNamesMap[user.id] = user.name;
                });
                setClientNames(newNamesMap);
            } catch (error) {
                console.error("Failed to fetch user names", error);
            }
        };

        fetchNames();
    }, [conversations, currentUserId, clientNames]);

    // 3. مراقبة الرسائل لايف
    useEffect(() => {
        let unsubscribe;
        if (view === 'thread' && selectedChat) {
            setMessagesLoading(true);
            unsubscribe = chatService.listenToMessages(selectedChat.firebase_chat_id, (liveMessages) => {
                setMessages(liveMessages);
                setMessagesLoading(false);
            });
        }
        return () => { if (unsubscribe) unsubscribe(); };
    }, [view, selectedChat]);

    const handleOpenChat = (conv) => {
        setSelectedChat(conv);
        setView('thread');
        setSearchQuery('');
    };

    // 💡 بدء محادثة جديدة كلياً
    const handleStartNew = async () => {
        if (!newReceiverId.trim() || creatingConversation) return;
        setCreatingConversation(true);
        try {
            const res = await chatService.initializeChat(newReceiverId.trim());
            if (res.status === 'success') {
                const newConv = {
                    firebase_chat_id: res.chat_id,
                    participants: [currentUserId, newReceiverId.trim()]
                };
                handleOpenChat(newConv);
                setNewReceiverId('');
            }
        } catch (error) {
            console.error("Failed to start chat", error);
        } finally {
            setCreatingConversation(false);
        }
    };

    const handleSend = async () => {
        if (!draft.trim() || !selectedChat) return;
        const text = draft.trim();
        setDraft('');

        const otherUserId = selectedChat.participants?.find(id => String(id) !== String(currentUserId));
        await chatService.sendMessageToFirebase(selectedChat.firebase_chat_id, currentUserId, otherUserId, text);
    };

    const getOtherUserId = (conv) => conv?.participants?.find(id => String(id) !== String(currentUserId));

    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            const otherId = getOtherUserId(conv);
            const name = clientNames[otherId] || 'مستخدم...';
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [conversations, searchQuery, clientNames]);

    return (
        <Drawer
            anchor="right" open={open} onClose={onClose}
            slotProps={{
                backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.32)' } },
                paper: {
                    sx: {
                        width: { xs: '100%', sm: '70%', md: '50%' },
                        display: 'flex', flexDirection: 'column',
                        background: isDark ? DARK_BG : LIGHT_BG,
                        borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(197, 160, 89, 0.4)',
                        boxShadow: isDark ? '-20px 0 60px rgba(0,0,0,0.4)' : '-20px 0 60px rgba(130, 100, 40, 0.12)',
                        backdropFilter: 'blur(18px)'
                    }
                }
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', flexShrink: 0, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255, 248, 232, 0.45)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    {view === 'thread' && (
                        <IconButton onClick={() => setView('list')} sx={{ color: isDark ? 'rgba(255,255,255,0.75)' : MUTED_TEXT, '&:hover': { color: GOLD } }}>
                            <ArrowBackIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                    )}
                    <Avatar sx={{ width: 32, height: 32, bgcolor: GOLD, fontSize: '13px', fontWeight: 700, color: isDark ? '#0B101C' : '#fff' }}>
                        {view === 'thread' ? 'ش' : 'EP'}
                    </Avatar>
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: isDark ? '#fff' : BROWN_TEXT }}>
                        {view === 'thread' ? (clientNames[getOtherUserId(selectedChat)] || 'المحادثة') : 'المحادثات'}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: isDark ? 'rgba(255,255,255,0.65)' : MUTED_TEXT, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(197, 160, 89, 0.18)', '&:hover': { color: GOLD, borderColor: GOLD } }}>
                    <CloseIcon sx={{ fontSize: '17px' }} />
                </IconButton>
            </Box>

            {/* Body */}
            {view === 'list' ? (
                <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>

                    {/* ✏️ خانة بدء محادثة جديدة */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, pb: 1, pt: 1 }}>
                        <TextField
                            value={newReceiverId} onChange={(e) => setNewReceiverId(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleStartNew(); } }}
                            placeholder="أدخل ID الفريلانسر أو المستخدم لبدء شات..." size="small" fullWidth disabled={creatingConversation}
                            sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: '10px', color: isDark ? '#fff' : BROWN_TEXT, bgcolor: isDark ? SURFACE_DARK : SURFACE_LIGHT, '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197,160,89,0.18)' }, '&:hover fieldset': { borderColor: GOLD }, '&.Mui-focused fieldset': { borderColor: GOLD } } }}
                        />
                        <IconButton onClick={handleStartNew} disabled={!newReceiverId.trim() || creatingConversation} sx={{ width: 38, height: 38, flexShrink: 0, bgcolor: GOLD, color: isDark ? '#0B101C' : '#fff', '&:hover': { bgcolor: GOLD, opacity: 0.9 }, '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' } }}>
                            <SendIcon sx={{ fontSize: '17px' }} />
                        </IconButton>
                    </Box>

                    {/* 🔍 شريط البحث */}
                    <Box sx={{ px: 2.5, pb: 2, pt: 0.5 }}>
                        <TextField
                            placeholder="البحث بالاسم..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} size="small" fullWidth
                            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT, fontSize: '18px' }} /></InputAdornment>) }}
                            sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: '10px', color: isDark ? '#fff' : BROWN_TEXT, bgcolor: isDark ? SURFACE_DARK : 'transparent', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197,160,89,0.18)' }, '&.Mui-focused fieldset': { borderColor: GOLD } } }}
                        />
                    </Box>

                    {conversationsLoading ? (
                        [0, 1, 2].map(i => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 2 }}>
                                <Skeleton variant="circular" width={38} height={38} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                                    <Skeleton variant="text" width="40%" height={15} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                                </Box>
                            </Box>
                        ))
                    ) : filteredConversations.length === 0 ? (
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <ChatBubbleOutlinedIcon sx={{ fontSize: 30, color: isDark ? 'rgba(255,255,255,0.3)' : '#d8cbb0', mb: 1 }} />
                            <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.68)' : BROWN_TEXT, fontSize: '14px' }}>
                                {searchQuery ? 'لا توجد نتائج بحث' : 'لا توجد محادثات حتى الآن'}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {filteredConversations.map((conv) => {
                                const otherId = getOtherUserId(conv);
                                const displayName = clientNames[otherId] || 'مستخدم...';

                                return (
                                    <ListItem
                                        key={conv.firebase_chat_id}
                                        onClick={() => handleOpenChat(conv)}
                                        sx={{ alignItems: 'flex-start', gap: 1.5, px: 2.5, py: 1.4, cursor: 'pointer', transition: 'background-color 0.15s ease', '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(197,160,89,0.08)' } }}
                                    >
                                        <Avatar sx={{ width: 38, height: 38, fontSize: '14px', fontWeight: 700, bgcolor: GOLD, color: isDark ? '#0B101C' : '#fff', flexShrink: 0 }}>
                                            {displayName.substring(0, 1).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#fff' : BROWN_TEXT }}>
                                                    {displayName}
                                                </Typography>
                                                {conv.last_message_time && (
                                                    <Typography sx={{ fontSize: '11.5px', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, flexShrink: 0, ml: 1 }}>
                                                        {formatRelativeTime(conv.last_message_time?.toDate())}
                                                    </Typography>
                                                )}
                                            </Box>
                                            {conv.last_message && (
                                                <Typography sx={{ fontSize: '12.5px', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mt: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {conv.last_message}
                                                </Typography>
                                            )}
                                        </Box>
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Box>
            ) : (
                <>
                    {/* الرسائل المتبادلة */}
                    <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {messagesLoading ? (
                            [0, 1].map(i => <Skeleton key={i} variant="rounded" width="50%" height={60} sx={{ alignSelf: i%2===0 ? 'flex-end' : 'flex-start', borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />)
                        ) : (
                            messages.map((m) => {
                                const isMe = String(m.sender_id) === String(currentUserId);
                                return (
                                    <Box
                                        key={m.id}
                                        sx={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%', borderRadius: '14px', px: 2, py: 1.2, fontSize: '0.85rem', lineHeight: 1.6,
                                            bgcolor: isMe ? GOLD : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(197,160,89,0.10)'),
                                            color: isMe ? (isDark ? '#0B101C' : '#fff') : (isDark ? 'rgba(255,255,255,0.85)' : BROWN_TEXT),
                                            borderBottomLeftRadius: isMe ? '14px' : '4px', borderBottomRightRadius: isMe ? '4px' : '14px',
                                        }}
                                    >
                                        {m.text}
                                    </Box>
                                )
                            })
                        )}
                    </Box>

                    {/* إدخال الرسالة */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.6, borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                        <TextField
                            value={draft} onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="اكتب رسالتك..." size="small" fullWidth multiline maxRows={4}
                            sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: '10px', color: isDark ? '#fff' : BROWN_TEXT, bgcolor: isDark ? SURFACE_DARK : SURFACE_LIGHT, '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197,160,89,0.18)' }, '&:hover fieldset': { borderColor: GOLD }, '&.Mui-focused fieldset': { borderColor: GOLD } } }}
                        />
                        <IconButton onClick={handleSend} disabled={!draft.trim()} sx={{ width: 38, height: 38, flexShrink: 0, bgcolor: GOLD, color: isDark ? '#0B101C' : '#fff', '&:hover': { bgcolor: GOLD, opacity: 0.9 }, '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' } }}>
                            <SendIcon sx={{ fontSize: '17px' }} />
                        </IconButton>
                    </Box>
                </>
            )}
        </Drawer>
    );
}