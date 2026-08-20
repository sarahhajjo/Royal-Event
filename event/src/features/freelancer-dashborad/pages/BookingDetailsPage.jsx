import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Stack,
    Typography,
    Chip,
    Button,
    Link,
    CircularProgress,
    useTheme
} from '@mui/material';

const ChatIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import freelancerOrderService from "../../../services/freelancerService/freelancerOrderService.js";
import { fetchBookingDetails, acceptBookingAction, rejectBookingAction } from "../components/orders/OrdersSlice.js";
import BookingServiceCard from "../components/order-detail/BookingServiceCard.jsx";
import BookingScheduleCard from "../components/order-detail/BookingScheduleCard.jsx";
import BookingCustomerCard from "../components/order-detail/BookingCustomerCard.jsx";

export default function BookingDetailsPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { id } = useParams();
    const dispatch = useDispatch();
    const booking = useSelector((state) => state.freelancerOrders.selectedBooking);

    const handleAccept = () => {
        dispatch(acceptBookingAction(booking.id));
    };

    const handleReject = () => {
        dispatch(rejectBookingAction(booking.id));
    };

    const [serviceImage, setServiceImage] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchBookingDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        const fetchImage = async () => {
            if (booking?.listing?.id) {
                try {
                    const imagesData = await freelancerOrderService.getListingImages(booking.listing.id);
                    const imagesArray = imagesData.data || imagesData;
                    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                        const imgUrl = imagesArray[0].url || imagesArray[0].path || imagesArray[0];
                        setServiceImage(imgUrl);
                    }
                } catch (err) {
                    console.error("فشل جلب صورة التفاصيل", err);
                }
            }
        };
        fetchImage();
    }, [booking]);

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم وصورة القلعة
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: { xs: 3, md: 4, lg: 5 },
    };

    if (!booking) {
        return (
            <Box
                dir="ltr"
                sx={{
                    display: 'flex',
                    height: '100vh',
                    overflow: 'hidden',
                    backgroundImage: isDark
                        ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                        : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    color: theme.palette.text.primary,
                }}
            >
                <Sidebar />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header title="Booking Details" />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 1.5, color: theme.palette.text.secondary }}>
                        <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                        <Typography sx={{ fontSize: '0.95rem', fontFamily: "'Raleway', sans-serif" }}>Loading booking details...</Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: isDark
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Booking Details" />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, md: 4, lg: 5 },
                        py: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ ...glassSx, maxWidth: '1152px', mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>

                        {/* رأس الصفحة */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            borderBottom: '1px solid',
                            borderColor: theme.palette.divider,
                            pb: 3
                        }}>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
                                    <Link
                                        component={RouterLink}
                                        to="/orders"
                                        underline="none"
                                        sx={{
                                            fontSize: '0.85rem',
                                            color: theme.palette.text.secondary,
                                            '&:hover': { color: 'primary.main' }
                                        }}
                                    >
                                        Orders
                                    </Link>
                                    <Typography sx={{ color: theme.palette.text.secondary }}>/</Typography>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: theme.palette.text.primary }}>
                                        Booking Details
                                    </Typography>
                                </Stack>

                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Chip
                                        label={booking.status}
                                        size="small"
                                        sx={{
                                            px: 1,
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            letterSpacing: 0.5,
                                            textTransform: 'uppercase',
                                            bgcolor: 'rgba(212, 175, 55, 0.15)',
                                            color: 'primary.main',
                                            borderRadius: '999px',
                                            border: '1px solid rgba(212, 175, 55, 0.3)'
                                        }}
                                    />
                                    <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                        {booking.created_at_human}
                                    </Typography>
                                </Stack>

                                <Typography
                                    sx={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: { xs: '1.6rem', md: '1.9rem' },
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        mt: 1.5
                                    }}
                                >
                                    {booking.listing?.title}
                                </Typography>

                                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, mt: 0.5 }}>
                                    Booking ID:{' '}
                                    <Box component="span" sx={{ fontFamily: 'monospace', color: theme.palette.text.primary }}>
                                        #{booking.id}
                                    </Box>
                                </Typography>
                            </Box>

                            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                <Button
                                    variant="outlined"
                                    startIcon={<ChatIcon />}
                                    sx={{
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        px: 2.5,
                                        py: 1,
                                        borderColor: theme.palette.divider,
                                        color: theme.palette.text.secondary,
                                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                                            borderColor: 'primary.main',
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    Message Client
                                </Button>

                                {booking.status === 'pending' && (
                                    <>
                                        <Button
                                            onClick={handleReject}
                                            variant="outlined"
                                            sx={{
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                px: 3,
                                                py: 1,
                                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                                color: '#f87171',
                                                '&:hover': {
                                                    bgcolor: 'rgba(239, 68, 68, 0.2)',
                                                    borderColor: 'rgba(239, 68, 68, 0.3)'
                                                }
                                            }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={handleAccept}
                                            variant="contained"
                                            sx={{
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                px: 3,
                                                py: 1,
                                            }}
                                        >
                                            Accept
                                        </Button>
                                    </>
                                )}

                                {(booking.status === 'completed' || booking.status === 'accepted') && (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                )}
                            </Stack>
                        </Box>

                        {/* شبكة الكروت مع إزالة الخلفيات الصلبة من الكروت الفرعية */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                gap: 3
                            }}
                        >
                            <BookingServiceCard
                                listing={booking.listing}
                                variant={booking.variant}
                                price={booking.price}
                                currency={booking.currency}
                                image={serviceImage}
                            />
                            <BookingScheduleCard
                                bookedDate={booking.booked_date}
                                shift={booking.shift}
                                createdAtHuman={booking.created_at_human}
                            />
                            <BookingCustomerCard
                                customer={booking.customer}
                            />
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}