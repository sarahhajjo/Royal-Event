import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import PageBreadcrumb from "../components/PageBreadcrumb.jsx";
import CoreDetails from "../components/add-service/CoreDetails";
import CustomizationPricing from "../components/add-service/CustomizationPricing";
import Logistics from "../components/add-service/Logistics";
import PhotoGallery from "../components/add-service/PhotoGallery";
import ActionBar from "../components/add-service/ActionBar";
import { createService } from "../components/add-service/ServicesSlice.js";
import freelancerOfferService from "../../../services/freelancerService/freelancerOfferService.js";

dayjs.extend(customParseFormat);

const FreelancerAddServicePage = () => {
    const [activeNav, setActiveNav] = useState("add-service");
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        category_id: "",
        district_id: "",
        listing_type: "service",
        cancel_before_acceptance: false,
        cancel_after_acceptance: false,
        cancel_before_payment: false,
        material_composition: "",
        includesTools: false,
        title: { ar: "", en: "" },
        description: { ar: "", en: "" },
        price_type: "fixed",
        // 👑 تحديث حالة التواريخ لدعم النطاقات والأيام المتعددة
        dateSelectionMode: "Date Range",
        startDate: null,
        endDate: null,
        selectedDates: [],

        isAllDay: false,
        shifts: [],
        variants: [
            {
                variant_name: { ar: "", en: "" },
                price: 0,
                availabilities: [],
            }
        ],
        photos: []
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const cats = await freelancerOfferService.getCategories();
                const dists = await freelancerOfferService.getDistricts();
                setCategories(cats);
                setDistricts(dists);
            } catch (err) {
                console.error("Failed to load categories/districts:", err);
            }
        };
        loadInitialData();
    }, []);

    // دالة الإرسال المحدثة
    const submitService = async (statusValue, successMsg) => {
        try {
            // 1. 👑 رفع الصور (يدعم الآن رفع أكثر من صورة دفعة واحدة)
            let imagesArray = [];
            if (formData.photos?.length > 0) {
                for (const file of formData.photos) {
                    if (typeof file === 'object') {
                        const uploadResponse = await freelancerOfferService.uploadImage(file);
                        const uploadedPath = uploadResponse.temp_path || uploadResponse.path;
                        if (uploadedPath) {
                            imagesArray.push({ path: uploadedPath });
                        }
                    }
                }
            }

            if (imagesArray.length === 0) {
                alert("يرجى اختيار صورة للخدمة أولاً.");
                return;
            }

            // 2. تجهيز البيانات الأساسية
            const preparedData = {
                ...formData,
                moderation_status: statusValue,
                secondary_contact_number: formData.secondaryPhone ||null,
                is_provider_location_based: true,
                images: imagesArray,
            };

            // تنظيف الحقول المؤقتة الخاصة بالواجهة قبل الإرسال للباك إند
            delete preparedData.photos;
            delete preparedData.shifts;
            delete preparedData.dateSelectionMode;
            delete preparedData.endDate;
            delete preparedData.selectedDates;
            delete preparedData.secondaryPhone;

            // 3. 👑 تجهيز الأوقات (Slots)
            let formattedSlots = [];
            if (preparedData.isAllDay) {
                formattedSlots = [{ start_time: "00:00", end_time: "23:59" }];
            } else if (formData.shifts.length > 0) {
                formattedSlots = formData.shifts.map(shift => {
                    const [startStr, endStr] = shift.split(' - ');
                    return {
                        start_time: dayjs(startStr, ["hh:mm A", "HH:mm"]).format("HH:mm"),
                        end_time: dayjs(endStr, ["hh:mm A", "HH:mm"]).format("HH:mm")
                    };
                });
            } else {
                alert("يرجى تحديد أوقات العمل (Shifts) أو تفعيل خيار All Day.");
                return;
            }

            // 4. 👑 توليد مصفوفة availabilities (تغطية كافة التواريخ المحددة)
            let availabilities = [];
            const mode = formData.dateSelectionMode;

            if (mode === "Date Range" && formData.startDate && formData.endDate) {
                let currentDate = dayjs(formData.startDate);
                const lastDate = dayjs(formData.endDate);

                while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
                    availabilities.push({
                        available_date: currentDate.format("YYYY-MM-DD"),
                        slots: formattedSlots
                    });
                    currentDate = currentDate.add(1, 'day');
                }
            }
            else if (mode === "Multiple Days" && formData.selectedDates?.length > 0) {
                formData.selectedDates.forEach(dateStr => {
                    availabilities.push({
                        available_date: dateStr,
                        slots: formattedSlots
                    });
                });
            }
            else if (formData.startDate) {
                // حالة احتياطية لو اختار يوماً واحداً فقط في الـ Date Range
                availabilities.push({
                    available_date: dayjs(formData.startDate).format("YYYY-MM-DD"),
                    slots: formattedSlots
                });
            } else {
                alert("يرجى تحديد تواريخ الخدمة من التقويم.");
                return;
            }

            // إرفاق التواريخ بالباقة (Variant)
            preparedData.variants[0].availabilities = availabilities;

            console.log("البيانات النهائية المرسلة للسيرفر:", preparedData);
            await dispatch(createService(preparedData)).unwrap();
            alert(successMsg);

        } catch (err) {
            console.error("Error during submission:", err);
            alert("حدث خطأ: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdate = (updatedFields) => {
        setFormData(prev => ({ ...prev, ...updatedFields }));
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", overflow: "hidden" }}>
            <Sidebar activeNav={activeNav} onNavChange={setActiveNav} user={{ name: "Ghazal kawas", role: "Service Provider" }} />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Add New Service" notificationCount={0} isOnline />
                <Box component="main" sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 4 }, pt: 3 }}>
                    <PageBreadcrumb
                        crumbs={[{ label: "Catalog", onClick: () => setActiveNav("catalog") }, { label: "Add New Service" }]}
                        title="Add New Service"
                        subtitle='Curate your next exclusive Service.'
                    />
                    <Grid container spacing={3.5}>
                        <Grid item xs={12} lg={7}>
                            <CoreDetails data={formData} onChange={handleUpdate} categories={categories} districts={districts} />
                            <CustomizationPricing data={formData} onChange={handleUpdate} />
                            <PhotoGallery photos={formData.photos} onPhotosChange={(photos) => handleUpdate({ photos })} />
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <Logistics data={formData} onChange={handleUpdate} />
                        </Grid>
                    </Grid>
                    <Box sx={{ height: 60 }} />
                </Box>
                <ActionBar
                    onSaveDraft={() => submitService("draft", "تم حفظ المسودة بنجاح!")}
                    onPublish={() => submitService("pending_approval", "تم إرسال الخدمة للمراجعة بنجاح!")}
                />
            </Box>
        </Box>
    );
};

export default FreelancerAddServicePage;