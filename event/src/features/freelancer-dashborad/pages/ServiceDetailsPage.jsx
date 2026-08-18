import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { fetchServiceDetails, clearServiceDetails } from "../components/service-details/ServiceDetailsSlice";
import { pickLocalized } from "../../../i18n/localize.js";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ServiceDetailsTopBar, ServiceOverviewCard, ServiceInfoGrid, ServiceBottomSection } from "../components/service-details";

// ── Helpers ──────────────────────────────────────────────
const formatTime = (time) => (time ? time.slice(0, 5) : "");

const formatDate = (isoString, locale = "en-GB") => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

// 👑 دالة إصلاح مسار الصورة لتظهر بشكل كامل وسليم
const fixImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    const imagePath = typeof img === 'string' ? img : (img.url || img.path || '');
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const BACKEND_URL = 'http://127.0.0.1:8000';
    let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    if (cleanPath.includes('/uploads/') && !cleanPath.includes('/storage/')) {
        cleanPath = cleanPath.replace('/uploads/', '/storage/uploads/');
    }
    if (!cleanPath.startsWith('/storage/')) {
        cleanPath = `/storage${cleanPath}`;
    }
    return `${BACKEND_URL}${cleanPath}`;
};

const buildAvailableDates = (variants = [], locale = "en-GB") =>
    variants.flatMap((variant) =>
        (variant.availabilities || []).flatMap((availability) =>
            (availability.slots || []).map((slot) => ({
                id: slot.id,
                dayLabel: formatDate(availability.available_date, locale),
                timeRange: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
                remainingCapacity: slot.remaining_capacity,
                variantName: pickLocalized(variant.name, "Option"),
            }))
        )
    );

export default function ServiceDetailsPage() {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const locale = i18n.language?.startsWith("ar") ? "ar" : "en-GB";

    const handleDeleteService = async () => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://127.0.0.1:8000/api/listings/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate("/catalog");
            } catch (error) {
                console.error("Failed to delete service:", error);
                alert("حدث خطأ أثناء محاولة حذف الخدمة");
            }
        }
    };

    const { serviceData, isLoading, error } = useSelector((state) => state.serviceDetails);

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
            <div key="loading-screen-container" className="flex min-h-screen bg-bg-default items-center justify-center">
                <div className="text-xl text-primary">
                    <span>Loading service details...</span>
                </div>
            </div>
        );
    }

    if (error || !serviceData) {
        return (
            <div key="error-screen-container" className="flex min-h-screen bg-bg-default items-center justify-center flex-col gap-4">
                <div className="text-xl text-red-500">
                    <span>{error || "Service not found."}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 border border-border rounded text-text-secondary hover:bg-bg-paper hover:text-primary transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const primaryVariant = serviceData.variants?.[0];

    const mappedService = {
        id: serviceData.id,
        title: pickLocalized(serviceData.title, "Untitled"),
        description: pickLocalized(serviceData.description, "No description."),
        // 👑 تمرير الصور على دالة الإصلاح fixImageUrl لتعمل الروابط بدقة
        images:
            serviceData.images?.length > 0
                ? serviceData.images.map((img) => fixImageUrl(img))
                : primaryVariant?.images?.length > 0
                    ? primaryVariant.images.map((img) => fixImageUrl(img))
                    : ["https://placehold.co/1200x800/eeeeee/999999?text=No+Image"],
        category: serviceData.category?.name || "Uncategorized",
        location: serviceData.district?.name || "Unknown",
        status: serviceData.status || "pending",
        statusLabel: serviceData.moderation_status || "Pending",
        contact: {
            phone: serviceData.secondary_contact_number || "Not provided",
            location: serviceData.district?.name || "Unknown Location",
        },
        pricing: {
            priceType: primaryVariant?.price_type === "fixed" ? "Fixed Price" : "Variable",
            amount: serviceData.price ?? primaryVariant?.price ?? 0,
            currency: primaryVariant?.currency || "SAR",
        },
        serviceStatus: {
            currentStatus: serviceData.status === "approved" ? "Active" : "Pending Review",
            message: serviceData.status === "approved" ? "Live and visible." : "Being reviewed by our quality team.",
        },
        cancellationPolicy: {
            beforeAcceptance: Boolean(serviceData.cancel_before_acceptance),
            afterAcceptance: Boolean(serviceData.cancel_after_acceptance),
            beforePayment: Boolean(serviceData.cancel_before_payment),
        },
        variants: serviceData.variants?.map((v, i) => ({
            id: v.id || `v${i}`,
            label: `Option ${i + 1}`,
            name: pickLocalized(v.name, "Main Option"),
            description: pickLocalized(v.description, ""),
            amount: v.price || 0,
            currency: v.currency || "SAR",
            badge: i === 0 ? "BASE PRICE" : null,
        })) || [],
        dates: buildAvailableDates(serviceData.variants, locale),
    };

    return (
        <div key={`details-page-${serviceId}`} className="flex min-h-screen bg-bg-default text-text-primary">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header />

                <main className="flex-1 space-y-6 p-6">
                    <ServiceDetailsTopBar
                        serviceId={mappedService.id}
                        status={mappedService.status}
                        statusLabel={mappedService.statusLabel}
                        onBack={() => navigate(-1)}
                    />

                    {/* أزرار الإدارة (تعديل وحذف) */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/edit-service/${serviceId}`)}
                            className="px-6 py-2 rounded-xl bg-primary text-bg-default text-sm font-semibold hover:opacity-90 transition shadow-sm"
                        >
                            Edit Service
                        </button>

                        <button
                            onClick={handleDeleteService}
                            className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition shadow-sm"
                        >
                            Delete Service
                        </button>
                    </div>

                    <ServiceOverviewCard
                        title={serviceData.title}
                        description={serviceData.description}
                        category={serviceData.category?.name}
                        location={serviceData.district?.name}
                        images={mappedService.images}
                    />

                    <ServiceInfoGrid
                        contact={mappedService.contact}
                        pricing={mappedService.pricing}
                        status={mappedService.serviceStatus}
                        policy={mappedService.cancellationPolicy}
                    />

                    <ServiceBottomSection
                        variants={mappedService.variants}
                        dates={mappedService.dates}
                        materialComposition={serviceData.material_composition}
                        calendarProps={{
                            monthLabel: "July 2026",
                            onPrevMonth: () => {},
                            onNextMonth: () => {},
                            onViewAll: () => navigate(`/catalog/services/${serviceId}/schedule`),
                        }}
                    />
                </main>

                <Footer />
            </div>
        </div>
    );
}