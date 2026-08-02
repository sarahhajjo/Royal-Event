import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchServiceDetails, clearServiceDetails } from "./ServiceDetailsSlice";
import {pickLocalized} from "../../../../i18n/localize.js";


const formatDate = (isoString, locale = "en-GB") => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function ServiceDetailsDrawer({
                                                 serviceId,
                                                 onClose,
                                                 onApprove,
                                                 onReject
                                             }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en-GB";

    const { serviceData, isLoading, error } = useSelector((state) => state.serviceDetails);

    // 🚀 أضيفي هذا السطر هنا لنرى ما الذي يأتي من الـ API بالظبط في متصفحك
    console.log("FULL SERVICE DATA FROM REDUX:", serviceData);
    useEffect(() => {
        if (serviceId) {
            dispatch(fetchServiceDetails(serviceId));
        }
        return () => {
            dispatch(clearServiceDetails());
        };
    }, [dispatch, serviceId]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="text-lg font-semibold bg-white px-8 py-4 rounded-xl shadow-2xl">
                    Loading details...
                </div>
            </div>
        );
    }

    if (error || !serviceData) {
        return (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center flex flex-col gap-5">
                    <div className="text-xl font-bold text-red-600">{error || "Service not found."}</div>
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // 👑 تجهيز البيانات مع فحص ذكي للشركة أو الفريلانسر
    const primaryVariant = serviceData.variants?.[0];

    const providerEntity = serviceData.company || serviceData.freelancer || {};
    const providerType = serviceData.company ? "Company" : serviceData.freelancer ? "Freelancer" : "Provider";

    const mappedService = {
        id: serviceData.id,
        title: pickLocalized(serviceData.title, "Untitled Service"),
        description: pickLocalized(serviceData.description, "No description available."),
        category: serviceData.category?.name || "Service Listing",
        location: serviceData.district?.name || "Location not specified",
        status: serviceData.status || "PENDING REVIEW",
        deadline: serviceData.created_at ? formatDate(serviceData.created_at, locale) : "No Date",
        pricing: {
            amount: primaryVariant?.price ?? 0,
            currency: primaryVariant?.currency || "USD",
            type: primaryVariant?.price_type === "fixed" ? "Fixed" : "Session",
        },
        providerInfo: {
            id: providerEntity.id || null,
            name: providerEntity.name || "Unknown Provider",
            email: providerEntity.email || providerEntity.user?.email || "No Email Provided",
            typeLabel: `Submitted By ${providerType}`
        },
        images: serviceData.images || [],
    };

    return (
        <div className="fixed inset-0 z-[999] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="w-full max-w-2xl bg-[#FAF9F5] h-full shadow-2xl flex flex-col overflow-y-auto animate-slide-in-right">

                {/* --- Header --- */}
                <div className="p-6 border-b border-[#E8E6DF] flex flex-col gap-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
                    >
                        ✕
                    </button>
                    <div className="text-right mt-8">
                        <h2 className="text-2xl font-serif text-[#333]">{mappedService.title}</h2>
                        <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#F2EFE8] text-[#8C7A54] text-xs font-bold tracking-wider rounded-full border border-[#DEDBCD]">
                            STATUS: {mappedService.status.toUpperCase()}
                            <span className="w-2 h-2 rounded-full bg-[#8C7A54]"></span>
                        </span>
                    </div>
                </div>

                {/* --- Content --- */}
                <div className="p-6 flex-1 flex flex-col gap-8">

                    {/* معرض الصور */}
                    {mappedService.images.length > 0 && (
                        <div className="mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Service Images</p>
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                                {mappedService.images.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        alt={img.alt || "Service Image"}
                                        className="w-48 h-32 object-cover rounded-lg shadow-sm border border-gray-200 flex-shrink-0 snap-center"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* معلومات الناشر (شركة أو فريلانسر) قابلة للضغط */}
                    <div className="bg-white border border-[#E8E6DF] rounded-xl p-5 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                            🏢
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {mappedService.providerInfo.typeLabel}
                            </p>

                            {mappedService.providerInfo.id ? (
                                <button
                                    onClick={() => navigate(`/admin-dashboard/companies/${mappedService.providerInfo.id}`)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left"
                                >
                                    {mappedService.providerInfo.name}
                                </button>
                            ) : (
                                <p className="text-sm font-bold text-gray-800">{mappedService.providerInfo.name}</p>
                            )}

                            <p className="text-xs text-gray-500 mt-1">📧 {mappedService.providerInfo.email}</p>
                        </div>
                    </div>

                    {/* شبكة المعلومات */}
                    <div className="grid grid-cols-2 gap-y-8 mt-2">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                            <p className="font-serif text-[#333] text-lg">{mappedService.category}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rate</p>
                            <p className="font-serif text-[#333] text-lg">{mappedService.pricing.type} / {mappedService.pricing.amount} {mappedService.pricing.currency}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created At</p>
                            <p className="font-serif text-[#333] text-lg">{mappedService.deadline} 📅</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                            <p className="font-serif text-[#333] text-lg">{mappedService.location} 📍</p>
                        </div>
                    </div>

                    {/* الوصف */}
                    <div className="mt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description & Features</p>
                        <div className="bg-[#F5F3EC] border border-[#E8E6DF] rounded-xl p-6 shadow-inner text-left">
                            <p className="italic text-[#555] leading-relaxed text-sm">
                                {mappedService.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- أزرار الإدارة الخاصة بالأدمن حصراً --- */}
                <div className="p-6 bg-white border-t border-[#E8E6DF] flex gap-4 mt-auto">
                    <button
                        onClick={onReject}
                        className="flex-1 py-3 px-4 border border-[#B91C1C] text-[#B91C1C] font-semibold rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Reject
                    </button>
                    <button
                        onClick={onApprove}
                        className="flex-[2] py-3 px-4 bg-[#6E5C19] text-white font-semibold rounded-lg hover:bg-[#584913] shadow-md transition-colors"
                    >
                        Approve Submission
                    </button>
                </div>
            </div>
        </div>
    );
}