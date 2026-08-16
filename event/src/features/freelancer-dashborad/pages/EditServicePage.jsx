import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// استيراد المكونات
import CoreDetails from '../components/add-service/CoreDetails';
import CustomizationPricing from '../components/add-service/CustomizationPricing';
import Logistics from '../components/add-service/Logistics';
import PhotoGallery from '../components/add-service/PhotoGallery';
import ActionBar from '../components/add-service/ActionBar';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { fetchServiceForEdit } from "../components/service-details/ServiceDetailsSlice.js";

export default function EditServicePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // حالة محلية للفورم لضمان سلاسة الكتابة والتعديل
    const [formData, setFormData] = useState({
        title: { ar: "", en: "" },
        description: { ar: "", en: "" },
        category_id: "",
        district_id: "",
        material_composition: "",
        includesTools: false,
        price_type: "fixed",
        currency: "SAR",
        variants: [{ variant_name: { ar: "", en: "" }, price: 0 }],
        images: [],
        cancel_before_acceptance: false,
        cancel_after_acceptance: false,
        cancel_before_payment: false,
        dateSelectionMode: "Date Range",
        startDate: null,
        endDate: null,
        selectedDates: [],
        isAllDay: false,
        shifts: [],
        secondaryPhone: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    const { status } = useSelector((state) => state.serviceDetails || state.services || {});

    // جلب بيانات الخدمة عند فتح الصفحة وتعبئتها بـ formData
    useEffect(() => {
        const loadServiceData = async () => {
            if (id) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`http://127.0.0.1:8000/api/listings/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const item = response.data.data;

                    if (item) {
                        // استخراج التواريخ والأوقات من أول variant كقيمة افتراضية
                        const firstVariant = item.variants?.[0] || {};
                        const availabilities = firstVariant.availabilities || [];

                        let extractedSelectedDates = [];
                        let extractedShifts = [];

                        // تجميع التواريخ والفترات من مصفوفة availabilities
                        availabilities.forEach(avail => {
                            if (avail.available_date) {
                                // اقتطاع الجزء الخاص بالتاريخ فقط (YYYY-MM-DD)
                                extractedSelectedDates.push(avail.available_date.split('T')[0]);
                            }

                            // تجميع الفترات (Shifts)
                            if (avail.slots && avail.slots.length > 0) {
                                avail.slots.forEach(slot => {
                                    if (slot.start_time && slot.end_time) {
                                        // تحويل الوقت من HH:mm:ss إلى صيغة أسهل للقراءة أو حفظه كما هو
                                        // مثال: "17:00:00 - 23:00:00"
                                        const shiftStr = `${slot.start_time.slice(0,5)} - ${slot.end_time.slice(0,5)}`;
                                        // تجنب تكرار الفترات المتشابهة
                                        if (!extractedShifts.includes(shiftStr)) {
                                            extractedShifts.push(shiftStr);
                                        }
                                    }
                                });
                            }
                        });

                        setFormData({
                            title: item.title || { ar: "", en: "" },
                            description: item.description || { ar: "", en: "" },
                            category_id: item.category_id || "",
                            district_id: item.district_id || "",
                            material_composition: item.material_composition || "",
                            includesTools: !!item.material_composition,

                            price_type: firstVariant.price_type || "fixed",
                            currency: firstVariant.currency || "SYP",
                            variants: item.variants?.length > 0 ? item.variants : [{ variant_name: { ar: "", en: "" }, price: 0 }],

                            images: item.images || [],

                            cancel_before_acceptance: Boolean(item.cancel_before_acceptance),
                            cancel_after_acceptance: Boolean(item.cancel_after_acceptance),
                            cancel_before_payment: Boolean(item.cancel_before_payment),

                            secondaryPhone: item.secondary_contact_number || "",

                            // ربط بيانات اللوجستيات المستخرجة
                            dateSelectionMode: extractedSelectedDates.length > 0 ? "Multiple Days" : "Date Range",
                            selectedDates: extractedSelectedDates,
                            shifts: extractedShifts,
                            startDate: null,
                            endDate: null,
                            isAllDay: extractedShifts.length === 0, // إذا لم يكن هناك فترات، نعتبرها All Day
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch service for edit", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadServiceData();
    }, [id]);

    if (isLoading) {
        return <div className="p-10 text-center text-text-primary text-xl">جاري تحميل بيانات الخدمة للتعديل...</div>;
    }

    return (
        <div dir="ltr" className="flex min-h-screen bg-bg-default text-text-primary">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <main className="mx-auto max-w-6xl space-y-6 p-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary mb-2">Edit Service</h1>
                        <p className="text-text-secondary">Update your service details below.</p>
                    </div>

                    {/* تمرير البيانات وحالة التحديث لكل المكونات */}
                    <div className="space-y-8">
                        <CoreDetails data={formData} onChange={setFormData} />
                        <CustomizationPricing data={formData} onChange={setFormData} />
                        <PhotoGallery data={formData} onChange={setFormData} />
                        <Logistics data={formData} onChange={setFormData} />
                    </div>

                    <ActionBar editMode={true} serviceId={id} data={formData} />
                </main>
            </div>
        </div>
    );
}