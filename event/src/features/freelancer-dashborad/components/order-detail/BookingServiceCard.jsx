import React from 'react';

export default function BookingServiceCard({ listing, variant, price, currency, image }) {
    return (
        <div className="flex flex-col md:flex-row bg-[#1a1714] rounded-2xl border border-border overflow-hidden col-span-2">
            {/* صورة الخدمة */}
            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                <img
                    src={image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed"}
                    alt="Service"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* تفاصيل الخدمة والسعر */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold">Service</span>
                    <h3 className="text-2xl font-bold text-text-primary mt-1">{listing?.title || "خدمة بدون عنوان"}</h3>
                    <p className="text-text-secondary mt-1">{variant?.name || "الباقة الأساسية"}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary">Total Price</p>
                        <p className="text-2xl font-bold text-primary mt-0.5">
                            {price ? `${parseFloat(price).toLocaleString()} ${currency || 'SYP'}` : "0"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}