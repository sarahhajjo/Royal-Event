import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../components/offers/OffersSlice.js"; // تأكدي من مسار الملف لديكِ
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import OfferTabs from "../components/offers/OfferTabs";
import OfferCard from "../components/offers/OfferCard";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";

export default function OfferManagementPage() {
    const dispatch = useDispatch();
    // جلب البيانات وحالة التحميل من الـ Store
    const { offers = [], isLoading } = useSelector((state) => state.OffersSlice);
    const [activeTab, setActiveTab] = useState("active");

    // جلب البيانات عند فتح الصفحة
    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    // فلترة البيانات بناءً على الحالة
    // ملاحظة: تأكدي من قيم الـ status التي يرسلها الباك إند (مثلاً 'approved', 'pending', 'rejected')
// في ملف OfferManagementPage.jsx
    const safeOffers = Array.isArray(offers) ? offers : [];
    const filteredOffers = safeOffers.filter(offer => {
        if (!offer) return false;

        // الحالات الخمس:
        if (activeTab === "active")    return offer.status === "approved";
        if (activeTab === "pending")   return offer.status === "pending_approval";
        if (activeTab === "rejected")  return offer.status === "rejected";
        if (activeTab === "draft")     return offer.status === "draft";
        if (activeTab === "cancelled") return offer.status === "cancelled"; // الحالة الخامسة

        return true;
    });


    return (
        <div className="min-h-screen bg-bg-default text-text-primary transition-colors duration-300">
            <Sidebar />
            <div className="pl-[260px]">
                <Header title="My Catalog" />
                <main className="max-w-7xl mx-auto p-8">
                    <PageBreadcrumb
                        title="My Catalog"
                        subtitle="Track the status of your offers and manage them easily."
                    />

                    <OfferTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        counts={{
                            active:    safeOffers.filter(o => o.status === "approved").length,
                            pending:   safeOffers.filter(o => o.status === "pending_approval").length,
                            rejected:  safeOffers.filter(o => o.status === "rejected").length,
                            draft:     safeOffers.filter(o => o.status === "draft").length,
                            cancelled: safeOffers.filter(o => o.status === "cancelled").length // العد للحالة الخامسة
                        }}
                    />

                    {isLoading ? (
                        <div className="flex justify-center p-10">جاري تحميل خدماتك...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
                            {filteredOffers.length > 0 ? (
                                filteredOffers.map(offer => (
                                    <OfferCard key={offer.id} offer={offer} />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">لا توجد خدمات في هذا القسم حالياً.</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}