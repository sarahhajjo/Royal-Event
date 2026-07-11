import React, { useState, useEffect } from "react";
import OfferStatusBadge from "./OfferStatusBadge"; // تأكدي من مسار هذا المكون
import freelancerCatalogService from "../../../../services/freelancerService/freelancerCatalogService.js";

export default function OfferCard({ offer }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // استدعاء الـ API لجلب الصور
                const data = await freelancerCatalogService.getListingImages(offer.id);

                // الباك إند يعيد: { success: true, images: [...] }
                // لذا نأخذ مصفوفة الصور مباشرة، أو مصفوفة فارغة إذا لم تكن موجودة
                if (data && data.images) {
                    setImages(data.images);
                } else if (Array.isArray(data)) {
                    setImages(data);
                }
            } catch (err) {
                console.error("خطأ في جلب صور الخدمة:", err);
            }
        };

        if (offer.id) {
            fetchImages();
        }
    }, [offer.id]);

    // 👑 بما أن الباك إند يعطي الرابط الكامل في مفتاح `url`، نستخدمه مباشرة!
  const displayImage = images.length > 0 && images[0].url
        ? images[0].url
        : "https://placehold.co/600x400/eeeeee/999999?text=No+Image";
    return (
        <div className="flex flex-row border border-border bg-bg-paper rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 h-48">

            {/* 1. قسم الصورة على اليسار */}
            <img
                src={displayImage}
                alt={offer.title?.en || offer.title?.ar || "Service Image"}
                className="w-56 h-full object-cover"
            />

            {/* 2. قسم المحتوى والتفاصيل على اليمين */}
            <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] uppercase font-bold text-primary tracking-widest">
                            {offer.category?.name || "Uncategorized"}
                        </span>
                        <OfferStatusBadge status={offer.status} />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">
                        {offer.title?.en || offer.title?.ar || offer.title}
                    </h3>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-text-primary">
                        {/* تأكدي من عرض السعر من الـ variants إذا كان offer.price غير موجود */}
                        {offer.price || (offer.variants && offer.variants[0]?.price) || 0}
                        <span className="text-sm font-normal text-text-secondary ml-1">SAR</span>
                    </span>
                    <button className="text-sm px-6 py-2 border border-border rounded text-text-secondary hover:bg-bg-default hover:text-primary transition-colors">
                        View Details
                    </button>
                </div>
            </div>

        </div>
    );
}