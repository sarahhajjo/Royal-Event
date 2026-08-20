import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

// 💡 استيراد الألوان الموحدة (يرجى التأكد من مسار الملف لديكِ)
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW
} from '../../../../../utils/colorConstants';

const STATUS_FILTERS = [
    { key: 'waiting',  label: 'Waiting List', color: GOLD },
    { key: 'approved', label: 'Approved',     color: '#4CAF50' }, // أخضر متناسق
    { key: 'rejected', label: 'Rejected',     color: '#ef5350' }, // أحمر متناسق
];

// 💡 كرت الحجز المصغّر
function BookingCard({ booking, onAccept, onReject, isHighlighted, borderStyle, isDark }) {
    const status = STATUS_FILTERS.find(s => s.key === booking.status);

    return (
        <Box
            id={`booking-row-${booking.id}`}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.1,
                px: 1.4,
                borderBottom: borderStyle,
                '&:last-child': { borderBottom: 'none' },
                transition: 'background 0.15s',
                '&:hover': { backgroundColor: isDark ? 'rgba(197,160,89,0.06)' : 'rgba(197,160,89,0.08)' },

                ...(isHighlighted && {
                    animation: 'highlightBlink 2.5s ease-in-out',
                    backgroundColor: alpha(GOLD, 0.15),
                    borderRight: `3px solid ${GOLD}`,
                    '@keyframes highlightBlink': {
                        '0%': { backgroundColor: alpha(GOLD, 0.4), transform: 'scale(1.01)' },
                        '50%': { backgroundColor: alpha(GOLD, 0.2), transform: 'scale(1)' },
                        '100%': { backgroundColor: alpha(GOLD, 0.15) }
                    }
                })
            }}
        >
            <Avatar sx={{ width: 28, height: 28, backgroundColor: alpha(GOLD, 0.15), color: GOLD, fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, border: `1px solid ${alpha(GOLD, 0.3)}` }}>
                {booking.name.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.74rem', fontWeight: 600, color: isDark ? '#ffffff' : BROWN_TEXT }}>
                    {booking.name}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.62rem', color: isDark ? 'rgba(255,255,255,0.7)' : MUTED_TEXT }}>
                    {booking.company}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.6rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, opacity: 0.8 }}>
                    {booking.date} {booking.time ? `– ${booking.time}` : ''}
                </Typography>
            </Box>

            {booking.status === 'waiting' && (
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <IconButton size="small" onClick={() => onAccept(booking.id)} sx={{ width: 24, height: 24, backgroundColor: alpha('#4CAF50', 0.12), color: '#4CAF50', border: `1px solid ${alpha('#4CAF50', 0.3)}`, '&:hover': { backgroundColor: alpha('#4CAF50', 0.22) } }}>
                        <CheckIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => onReject(booking.id)} sx={{ width: 24, height: 24, backgroundColor: alpha('#ef5350', 0.12), color: '#ef5350', border: `1px solid ${alpha('#ef5350', 0.3)}`, '&:hover': { backgroundColor: alpha('#ef5350', 0.22) } }}>
                        <CloseIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                </Box>
            )}

            {booking.status !== 'waiting' && status && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status.color, flexShrink: 0 }} />
            )}
        </Box>
    );
}

// 💡 المربع (Stage) الواحد
function StageBox({ status, items, counts, onAccept, onReject, highlightedBookingId, borderStyle, isDark }) {
    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column',
                border: `1.5px solid ${alpha(status.color, 0.3)}`,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.3)',
            }}
        >
            {/* هيدر المربع */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.6,
                py: 1,
                backgroundColor: alpha(status.color, 0.1),
                borderBottom: `1px solid ${alpha(status.color, 0.2)}`,
            }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: status.color }}>
                    {status.label}
                </Typography>
                <Box sx={{ backgroundColor: alpha(status.color, 0.2), color: status.color, fontSize: '0.65rem', fontWeight: 700, px: 0.9, py: 0.15, borderRadius: 1, minWidth: 20, textAlign: 'center' }}>
                    {String(counts[status.key]).padStart(2, '0')}
                </Box>
            </Box>

            {/* محتوى المربع */}
            <Box sx={{ maxHeight: 340, overflowY: 'auto' }}>
                {items.length === 0 ? (
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }}>
                            لا يوجد حجوزات
                        </Typography>
                    </Box>
                ) : (
                    items.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onAccept={onAccept}
                            onReject={onReject}
                            isHighlighted={highlightedBookingId === booking.id}
                            borderStyle={borderStyle}
                            isDark={isDark}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

// 💡 الخط الرفيع الواصل بين مربعين
function Connector({ lineColor }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', pt: '26px', px: { xs: 0, md: 0.5 } }}>
            <Box sx={{ width: { xs: 16, md: 28 }, height: '2px', backgroundColor: lineColor, flexShrink: 0 }} />
        </Box>
    );
}

export default function BookingPipeline({ entityId, bookingsData = [], highlightedBookingId }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // إعداد متغيرات الحدود والخطوط الفاصلة بناءً على الثوابت
    const borderStyle = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
    const lineColor = isDark ? 'rgba(255,255,255,0.1)' : LIGHT_BORDER;

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!bookingsData || bookingsData.length === 0) {
            setItems([]);
            return;
        }

        const filteredByEntity = bookingsData.filter(b => b.listing?.id === entityId);

        const mapped = filteredByEntity.map(b => {
            let frontendStatus = 'rejected';
            if (b.status === 'pending') frontendStatus = 'waiting';
            if (b.status === 'completed' || b.status === 'accepted') frontendStatus = 'approved';

            return {
                id: b.id,
                status: frontendStatus,
                name: b.customer?.name || 'Unknown Client',
                company: b.variant?.name?.en || b.variant?.name?.ar || 'Standard Option',
                date: b.created_at_human || '',
                time: b.shift ? `${b.shift.start_time.slice(0,5)} - ${b.shift.end_time.slice(0,5)}` : 'Flexible Time'
            };
        });
        setItems(mapped);
    }, [bookingsData, entityId]);

    // التمرير التلقائي
    useEffect(() => {
        if (highlightedBookingId) {
            const el = document.getElementById(`booking-row-${highlightedBookingId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlightedBookingId, items]);

    const counts = {
        waiting:  items.filter(b => b.status === 'waiting').length,
        approved: items.filter(b => b.status === 'approved').length,
        rejected: items.filter(b => b.status === 'rejected').length,
    };

    const handleAccept = async (id) => {
        setItems(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/bookings/${id}/accept`, {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error('Failed to accept booking', error); }
    };

    const handleReject = async (id) => {
        setItems(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://127.0.0.1:8000/api/bookings/${id}/reject`, { reason: 'No availability' }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) { console.error('Failed to reject booking', error); }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                backdropFilter: 'blur(16px)',
                border: borderStyle,
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
                borderRadius: 3,
                mb: 2,
                p: 3
            }}
        >
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : BROWN_TEXT, mb: 2.5 }}>
                Booking Pipeline
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(GOLD, 0.5), borderRadius: '4px' } }}>
                {STATUS_FILTERS.map((status, index) => (
                    <React.Fragment key={status.key}>
                        <StageBox
                            status={status}
                            items={items.filter(b => b.status === status.key)}
                            counts={counts}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            highlightedBookingId={highlightedBookingId}
                            borderStyle={borderStyle}
                            isDark={isDark}
                        />
                        {index < STATUS_FILTERS.length - 1 && <Connector lineColor={lineColor} />}
                    </React.Fragment>
                ))}
            </Box>
        </Paper>
    );
}