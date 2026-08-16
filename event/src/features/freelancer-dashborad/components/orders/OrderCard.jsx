import React from 'react';
import { acceptBookingAction, rejectBookingAction } from "./OrdersSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // 🔥 استيراد الـ navigate

export default function OrderCard({ order }) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 🔥 تفعيل الـ navigate

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
        <div
            onClick={handleCardClick} // 🔥 الضغط على الكرت ينقلك للتفاصيل
            className="flex flex-col sm:flex-row bg-bg-paper rounded-xl border border-border overflow-hidden shadow-sm transition-transform hover:-translate-y-1 cursor-pointer">

            {/* 🖼️ قسم الصورة */}
            <div className="relative w-full sm:w-1/3 h-48 sm:h-auto shrink-0">
                <img
                    src={order.image}
                    alt={order.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {order.status}
                </div>
            </div>

            {/* 📝 قسم التفاصيل */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <h3 className="text-xl font-bold text-text-primary">{order.title}</h3>

                    {/* شبكة التفاصيل */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                        <div>
                            <p className="text-text-secondary">Client</p>
                            <p className="font-medium text-text-primary mt-0.5">{order.client}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary">Event date</p>
                            <p className="font-medium text-text-primary mt-0.5">{order.eventDate}</p>
                        </div>
                        <div>
                            <p className="text-text-secondary">Time</p>
                            <p className="font-medium text-text-primary mt-0.5" dir="ltr">
                                {order.time}
                            </p>
                        </div>
                        <div>
                            <p className="text-text-secondary">Price</p>
                            <p className="font-medium text-primary mt-0.5">{order.price}</p>
                        </div>
                    </div>
                </div>

                {/* 🔘 قسم الأزرار في الأسفل */}
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    {order.status === 'pending' ? (
                        <>
                            <button
                                onClick={handleAccept}
                                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-black transition hover:opacity-90">
                                Accept request
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition shadow-sm">                                Reject request
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 text-center py-2.5 text-sm font-medium text-text-secondary bg-bg-default rounded-lg">
                            This order is {order.status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}