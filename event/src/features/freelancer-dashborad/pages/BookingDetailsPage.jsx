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
    CircularProgress
} from '@mui/material';
// أيقونة المحادثة كـ SVG مباشر (بدون الاعتماد على @mui/icons-material)
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
    const { id } = useParams();
    const dispatch = useDispatch();
    const booking = useSelector((state) => state.freelancerOrders.selectedBooking);

    const handleAccept = () => {
        dispatch(acceptBookingAction(booking.id));
    };

    const handleReject = () => {
        dispatch(rejectBookingAction(booking.id));
    };

    // state لتخزين رابط صورة الخدمة الحقيقية
    const [serviceImage, setServiceImage] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchBookingDetails(id));
        }
    }, [dispatch, id]);

    // جلب صورة الخدمة فور توفر الـ listing id
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

    if (!booking) {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 1.5,
                color: (theme) => theme.palette.text.secondary
            }}>
                <CircularProgress size={20} sx={{ color: 'inherit' }} />
                <Typography sx={{ fontSize: '0.95rem' }}>Loading booking details...</Typography>
            </Box>
        );
    }

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1 }}>
                <Header />

                <Box
                    component="main"
                    sx={{
                        mx: 'auto',
                        maxWidth: '1152px', // ~ max-w-6xl
                        p: { xs: 3, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >

                    {/* رأس الصفحة */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        {/* 1. قسم العنوان والمعلومات */}
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
                                <Link
                                    component={RouterLink}
                                    to="/orders"
                                    underline="none"
                                    sx={{
                                        fontSize: '0.85rem',
                                        color: (theme) => theme.palette.text.secondary,
                                        '&:hover': { color: (theme) => theme.palette.primary.main }
                                    }}
                                >
                                    Orders
                                </Link>
                                <Typography sx={{ color: (theme) => theme.palette.text.secondary }}>/</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: (theme) => theme.palette.text.primary }}>
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
                                        bgcolor: (theme) => `${theme.palette.primary.main}33`, // ~ primary/20
                                        color: (theme) => theme.palette.primary.main,
                                        borderRadius: '999px'
                                    }}
                                />
                                <Typography sx={{ fontSize: '0.72rem', color: (theme) => theme.palette.text.secondary }}>
                                    {booking.created_at_human}
                                </Typography>
                            </Stack>

                            <Typography
                                sx={{
                                    fontSize: { xs: '1.6rem', md: '1.9rem' },
                                    fontWeight: 800,
                                    color: (theme) => theme.palette.text.primary,
                                    mt: 1
                                }}
                            >
                                {booking.listing?.title}
                            </Typography>

                            <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary, mt: 0.5 }}>
                                Booking ID:{' '}
                                <Box component="span" sx={{ fontFamily: 'monospace', color: (theme) => theme.palette.text.primary }}>
                                    #{booking.id}
                                </Box>
                            </Typography>
                        </Box>

                        {/* 2. قسم الأزرار */}
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            {/* زر التواصل (دائماً ظاهر بكل الحالات) */}
                            <Button
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    px: 2.2,
                                    py: 1,
                                    borderColor: (theme) => theme.palette.divider,
                                    color: (theme) => theme.palette.text.secondary,
                                    '&:hover': {
                                        bgcolor: (theme) => theme.palette.background.paper,
                                        borderColor: (theme) => theme.palette.divider
                                    }
                                }}
                            >
                                Message Client
                            </Button>

                            {/* إذا كان قيد الانتظار: نعرض القبول والرفض */}
                            {booking.status === 'pending' && (
                                <>
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
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                            bgcolor: (theme) => theme.palette.primary.main,
                                            color: '#000',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            '&:hover': {
                                                bgcolor: (theme) => theme.palette.primary.main,
                                                opacity: 0.9
                                            }
                                        }}
                                    >
                                        Accept
                                    </Button>
                                </>
                            )}

                            {/* إذا كان مكتمل أو مقبول: نعرض زر التأكيد */}
                            {(booking.status === 'completed' || booking.status === 'accepted') && (
                                <Button
                                    variant="contained"
                                    // إذا في API للـ Confirm مستقبلاً، بتضيفي onClick هون
                                    sx={{
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1,
                                        bgcolor: (theme) => theme.palette.primary.main,
                                        color: '#000',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        '&:hover': {
                                            bgcolor: (theme) => theme.palette.primary.main,
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    Confirm
                                </Button>
                            )}

                            {/* ملاحظة: إذا كان rejected، رح يتجاهل الشروط اللي فوق ومارح يعرض غير زر الـ Message */}
                        </Stack>
                    </Box>

                    {/* الكروت */}
                    {/* ملاحظة: استخدمنا CSS grid عبر Box بدل MUI <Grid item> لتفادي
                        مشاكل التوافق مع إصدار MUI عندك (اختلاف API بين v5 وv6/v7) */}
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
                            image={serviceImage} // تمرير الصورة الحقيقية
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
    );
}