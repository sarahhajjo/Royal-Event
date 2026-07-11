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
        startDate: null,
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

    // 👑 دالة الإرسال الموحدة والمحدثة
    const submitService = async (statusValue, successMsg) => {
        try {
            // 1. رفع الصورة أولاً
            let uploadedPath = null;
            if (formData.photos?.length > 0 && typeof formData.photos[0] === 'object') {
                const uploadResponse = await freelancerOfferService.uploadImage(formData.photos[0]);
                // نستخدم temp_path كما اتفقنا
                uploadedPath = uploadResponse.temp_path || uploadResponse.path;
            }

            // 2. تحديث هيكل البيانات ليتضمن الصورة في مصفوفة images
            const imagesArray = uploadedPath ? [{ path: uploadedPath }] : [];

            const preparedData = {
                ...formData,
                moderation_status: statusValue,
                secondary_contact_number: "0933333333",
                is_provider_location_based: true,
                images: imagesArray, // 👑 هنا يتم ربط الصورة التي تم رفعها
            };

            // تنظيف الحقول التي لا يريدها الباك إند
            delete preparedData.photos;
            delete preparedData.shifts;

            // تحقق إضافي: هل الصورة موجودة؟
            if (preparedData.images.length === 0) {
                alert("يرجى اختيار صورة للخدمة أولاً.");
                return;
            }

            // ... (باقي منطق التوقيتات) ...
            if (preparedData.isAllDay) {
                preparedData.variants[0].availabilities = [{
                    available_date: dayjs(preparedData.startDate).format('YYYY-MM-DD'),
                    slots: [{ start_time: "00:00", end_time: "23:59" }]
                }];
            } else {
                preparedData.variants[0].availabilities = formData.shifts.map(shift => {
                    const [startStr, endStr] = shift.split(' - ');
                    return {
                        available_date: dayjs(preparedData.startDate).format('YYYY-MM-DD'),
                        slots: [{
                            start_time: dayjs(startStr, ["hh:mm A", "HH:mm"]).format("HH:mm"),
                            end_time: dayjs(endStr, ["hh:mm A", "HH:mm"]).format("HH:mm")
                        }]
                    };
                });
            }

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