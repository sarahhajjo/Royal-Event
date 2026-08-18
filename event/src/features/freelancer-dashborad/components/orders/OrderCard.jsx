import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { acceptBookingAction, rejectBookingAction } from "./OrdersSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAccept = (e) => {
        e.stopPropagation(); // منع انتقال الصفحة عند الضغط على الأزرار
        dispatch(acceptBookingAction(order.raw.id));
    };

    const handleReject = (e) => {
        e.stopPropagation(); // منع انتقال الصفحة عند الضغط على الأزرار
        dispatch(rejectBookingAction(order.raw.id));
    };

    const handleCardClick = () => {
        // الانتقال لصفحة التفاصيل باستخدام الـ id الحقيقي (order.raw.id)
        navigate(`/order-managment/${order.raw.id}`);
    };

    return (
        <Box
            onClick={handleCardClick}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: '12px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
            }}
        >
            {/* قسم الصورة */}
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '33.33%' }, height: { xs: 192, sm: 'auto' }, flexShrink: 0 }}>
                <Box
                    component="img"
                    src={order.image}
                    alt={order.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        borderRadius: '999px',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        color: '#fff',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {order.status}
                </Box>
            </Box>

            {/* قسم التفاصيل */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2.5 }}>
                <Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: (theme) => theme.palette.text.primary }}>
                        {order.title}
                    </Typography>

                    {/* شبكة التفاصيل */}
                    <Box
                        sx={{
                            mt: 2,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                            gap: 2,
                            fontSize: '0.85rem'
                        }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>Client</Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: (theme) => theme.palette.text.primary, mt: 0.3 }}>
                                {order.client}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>Event date</Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: (theme) => theme.palette.text.primary, mt: 0.3 }}>
                                {order.eventDate}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>Time</Typography>
                            <Typography dir="ltr" sx={{ fontSize: '0.85rem', fontWeight: 500, color: (theme) => theme.palette.text.primary, mt: 0.3 }}>
                                {order.time}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>Price</Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: (theme) => theme.palette.primary.main, mt: 0.3 }}>
                                {order.price}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* قسم الأزرار بالأسفل */}
                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`
                    }}
                >
                    {order.status === 'pending' ? (
                        <>
                            <Button
                                onClick={handleAccept}
                                fullWidth
                                variant="contained"
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    py: 1.1,
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    color: '#000',
                                    '&:hover': { bgcolor: (theme) => theme.palette.primary.main, opacity: 0.9 }
                                }}
                            >
                                Accept request
                            </Button>
                            <Button
                                onClick={handleReject}
                                variant="outlined"
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                    color: '#f87171',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        bgcolor: 'rgba(239, 68, 68, 0.2)',
                                        borderColor: 'rgba(239, 68, 68, 0.3)'
                                    }
                                }}
                            >
                                Reject request
                            </Button>
                        </>
                    ) : (
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                py: 1.1,
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                color: (theme) => theme.palette.text.secondary,
                                bgcolor: (theme) => theme.palette.background.default,
                                borderRadius: '10px'
                            }}
                        >
                            This order is {order.status}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}