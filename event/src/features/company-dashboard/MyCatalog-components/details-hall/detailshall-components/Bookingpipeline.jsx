import React, { useState } from 'react';
import { Box, Typography, Divider, Paper, Avatar, Button, Tab, Tabs, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
    { id: 1, status: 'waiting', name: 'Elena Sterling',  company: 'Sterling Luxury Events',  date: '24 Oct', time: '09:00 AM', avatar: null },
    { id: 2, status: 'waiting', name: 'Julian Thorne',   company: 'Thorne Capital Partners', date: '27 Oct', time: '01:00 PM', avatar: null },
    { id: 3, status: 'approved', name: 'Sophia Vance',   company: 'Vance & Co.',              date: '15 Oct', time: '10:00 AM', avatar: null },
    { id: 4, status: 'approved', name: 'Marcus Reed',    company: 'Reed Global Events',       date: '18 Oct', time: '02:00 PM', avatar: null },
    { id: 5, status: 'rejected', name: 'Lara Fontaine',  company: 'Fontaine Corp.',            date: '10 Oct', time: '11:00 AM', avatar: null },
];

const STATUS_FILTERS = [
    { key: 'waiting',  label: 'Waiting List', color: '#c5a059' },
    { key: 'approved', label: 'Approved',     color: '#5fa06b' },
    { key: 'rejected', label: 'Rejected',     color: '#b05050' },
];

// ── Booking Row ───────────────────────────────────────────────────────────────
function BookingRow({ booking, onAccept, onReject }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    return (
        <Box
            sx={{
                display:         'flex',
                alignItems:      'center',
                gap:             1.5,
                py:              1.5,
                px:              2,
                borderBottom:    `1px solid ${border}`,
                '&:last-child':  { borderBottom: 'none' },
                transition:      'background 0.15s',
                '&:hover':       { backgroundColor: isDark ? 'rgba(197,160,89,0.04)' : 'rgba(197,160,89,0.06)' },
            }}
        >
            {/* Avatar */}
            <Avatar
                src={booking.avatar}
                sx={{
                    width:           36,
                    height:          36,
                    backgroundColor: isDark ? '#2e2318' : '#e8dcc0',
                    color:           theme.palette.primary.main,
                    fontSize:        '0.8rem',
                    fontWeight:      700,
                    flexShrink:      0,
                }}
            >
                {booking.name.charAt(0)}
            </Avatar>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary }}>
                    {booking.name}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary }}>
                    {booking.company}
                </Typography>
            </Box>

            {/* Date */}
            <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary, whiteSpace: 'nowrap', mr: 1 }}>
                {booking.date} – {booking.time}
            </Typography>

            {/* Actions */}
            {booking.status === 'waiting' && (
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                    <Button
                        size="small"
                        onClick={() => onAccept?.(booking.id)}
                        sx={{
                            minWidth:        0,
                            px:              1.5,
                            py:              0.5,
                            fontSize:        '0.65rem',
                            fontWeight:      700,
                            textTransform:   'none',
                            backgroundColor: 'rgba(95,160,107,0.12)',
                            color:           '#5fa06b',
                            border:          '1px solid rgba(95,160,107,0.3)',
                            borderRadius:    1,
                            '&:hover':       { backgroundColor: 'rgba(95,160,107,0.22)' },
                        }}
                    >
                        ACCP
                    </Button>
                    <Button
                        size="small"
                        onClick={() => onReject?.(booking.id)}
                        sx={{
                            minWidth:        0,
                            px:              1.5,
                            py:              0.5,
                            fontSize:        '0.65rem',
                            fontWeight:      700,
                            textTransform:   'none',
                            backgroundColor: 'rgba(176,80,80,0.12)',
                            color:           '#b05050',
                            border:          '1px solid rgba(176,80,80,0.3)',
                            borderRadius:    1,
                            '&:hover':       { backgroundColor: 'rgba(176,80,80,0.22)' },
                        }}
                    >
                        REJC
                    </Button>
                </Box>
            )}

            {booking.status === 'approved' && (
                <Chip label="Approved" size="small" icon={<CheckIcon sx={{ fontSize: '0.8rem !important' }} />}
                      sx={{ fontSize: '0.65rem', height: 22, backgroundColor: 'rgba(95,160,107,0.12)', color: '#5fa06b', border: '1px solid rgba(95,160,107,0.3)' }} />
            )}

            {booking.status === 'rejected' && (
                <Chip label="Rejected" size="small" icon={<CloseIcon sx={{ fontSize: '0.8rem !important' }} />}
                      sx={{ fontSize: '0.65rem', height: 22, backgroundColor: 'rgba(176,80,80,0.12)', color: '#b05050', border: '1px solid rgba(176,80,80,0.3)' }} />
            )}
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookingPipeline({ bookings = MOCK_BOOKINGS }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const [activeTab, setActiveTab] = useState('waiting');
    const [items, setItems]         = useState(bookings);

    const counts = {
        waiting:  items.filter(b => b.status === 'waiting').length,
        approved: items.filter(b => b.status === 'approved').length,
        rejected: items.filter(b => b.status === 'rejected').length,
    };

    const filtered = items.filter(b => b.status === activeTab);

    const handleAccept = (id) => setItems(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
    const handleReject = (id) => setItems(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));

    return (
        <Paper elevation={0} sx={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${border}`, borderRadius: 2, mb: 2, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ px: 3, pt: 3, pb: 0 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}>
                    Booking Pipeline
                </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                    px: 2,
                    borderBottom: `1px solid ${border}`,
                    '& .MuiTab-root': {
                        fontSize:      '0.72rem',
                        fontWeight:    600,
                        textTransform: 'none',
                        minHeight:     40,
                        color:         theme.palette.text.secondary,
                        '&.Mui-selected': { color: theme.palette.primary.main },
                    },
                    '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.main, height: 2 },
                }}
            >
                {STATUS_FILTERS.map(({ key, label }) => (
                    <Tab
                        key={key}
                        value={key}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                {label}
                                <Box
                                    sx={{
                                        backgroundColor: activeTab === key
                                            ? `${STATUS_FILTERS.find(s => s.key === key)?.color}22`
                                            : isDark ? '#2e2318' : '#e8dcc0',
                                        color:           activeTab === key
                                            ? STATUS_FILTERS.find(s => s.key === key)?.color
                                            : theme.palette.text.secondary,
                                        fontSize:        '0.65rem',
                                        fontWeight:      700,
                                        px:              0.8,
                                        py:              0.1,
                                        borderRadius:    1,
                                        minWidth:        20,
                                        textAlign:       'center',
                                    }}
                                >
                                    {String(counts[key]).padStart(2, '0')}
                                </Box>
                            </Box>
                        }
                    />
                ))}
            </Tabs>

            {/* Rows */}
            <Box>
                {filtered.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                            No bookings in this category.
                        </Typography>
                    </Box>
                ) : (
                    filtered.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} onAccept={handleAccept} onReject={handleReject} />
                    ))
                )}
            </Box>
        </Paper>
    );
}