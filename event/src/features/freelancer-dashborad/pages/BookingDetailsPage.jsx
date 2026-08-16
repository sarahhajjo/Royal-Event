import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import freelancerOrderService from "../../../services/freelancerService/freelancerOrderService.js";
import {fetchBookingDetails , acceptBookingAction, rejectBookingAction} from "../components/orders/OrdersSlice.js";
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
        return <div className="p-10 text-center text-text-secondary">Loading booking details...</div>;
    }

    return (
        <div dir="ltr" className="flex min-h-screen bg-bg-default text-text-primary">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <main className="mx-auto max-w-6xl space-y-6 p-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* 1. قسم العنوان والمعلومات */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link to="/orders" className="text-sm text-text-secondary hover:text-primary">Orders</Link>
                                <span className="text-text-secondary">/</span>
                                <span className="text-sm font-medium text-text-primary">Booking Details</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary uppercase">
                                    {booking.status}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {booking.created_at_human}
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-text-primary mt-2">
                                {booking.listing?.title}
                            </h1>
                            <p className="text-sm text-text-secondary mt-1">
                                Booking ID: <span className="font-mono text-text-primary">#{booking.id}</span>
                            </p>
                        </div>

                        {/* 2. قسم الأزرار 🔥 */}
                        <div className="flex items-center gap-3">
                            {/* زر التواصل (دائماً ظاهر بكل الحالات) */}
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-paper transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Message Client
                            </button>

                            {/* إذا كان قيد الانتظار: نعرض القبول والرفض */}
                            {booking.status === 'pending' && (
                                <>
                                    <button
                                        onClick={handleReject}
                                        className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition shadow-sm">
                                        Reject
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="px-6 py-2 rounded-xl bg-primary text-black text-sm font-semibold hover:opacity-90 transition shadow-sm">
                                        Accept
                                    </button>
                                </>
                            )}

                            {/* إذا كان مكتمل أو مقبول: نعرض زر التأكيد */}
                            {(booking.status === 'completed' || booking.status === 'accepted') && (
                                <button
                                    // إذا في API للـ Confirm مستقبلاً، بتضيفي onClick هون
                                    className="px-6 py-2 rounded-xl bg-primary text-black text-sm font-semibold hover:opacity-90 transition shadow-sm">
                                    Confirm
                                </button>
                            )}

                            {/* ملاحظة: إذا كان rejected، رح يتجاهل الشروط اللي فوق ومارح يعرض غير زر الـ Message */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    </div>

                </main>
            </div>
        </div>
    );
}