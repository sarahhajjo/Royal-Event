import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import axios from 'axios';

// استيراد المكونات
import CoreDetails from '../components/add-service/CoreDetails';
import CustomizationPricing from '../components/add-service/CustomizationPricing';
import Logistics from '../components/add-service/Logistics';
import PhotoGallery from '../components/add-service/PhotoGallery';
import ActionBar from '../components/add-service/ActionBar';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageBreadcrumb from '../components/PageBreadcrumb.jsx';

export default function EditServicePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
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
                        const firstVariant = item.variants?.[0] || {};
                        const availabilities = firstVariant.availabilities || [];

                        let extractedSelectedDates = [];
                        let extractedShifts = [];

                        availabilities.forEach(avail => {
                            if (avail.available_date) {
                                extractedSelectedDates.push(avail.available_date.split('T')[0]);
                            }

                            if (avail.slots && avail.slots.length > 0) {
                                avail.slots.forEach(slot => {
                                    if (slot.start_time && slot.end_time) {
                                        const shiftStr = `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;
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
                            currency: firstVariant.currency || "SAR",
                            variants: item.variants?.length > 0 ? item.variants : [{ variant_name: { ar: "", en: "" }, price: 0 }],

                            images: item.images || [],

                            cancel_before_acceptance: Boolean(item.cancel_before_acceptance),
                            cancel_after_acceptance: Boolean(item.cancel_after_acceptance),
                            cancel_before_payment: Boolean(item.cancel_before_payment),

                            secondaryPhone: item.secondary_contact_number || "",

                            dateSelectionMode: extractedSelectedDates.length > 0 ? "Multiple Days" : "Date Range",
                            selectedDates: extractedSelectedDates,
                            shifts: extractedShifts,
                            startDate: null,
                            endDate: null,
                            isAllDay: extractedShifts.length === 0,
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

    // 👑 الستايل الزجاجي الموحد والمتكيف مع الثيم
    const glassSx = {
        background: isDark ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        borderRadius: "16px",
        boxShadow: isDark ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
        p: { xs: 3, md: 4, lg: 5 },
    };

    if (isLoading) {
        return (
            <Box dir="ltr" sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <CircularProgress color="primary" />
                <Typography sx={{ ml: 2, fontSize: '1rem', fontFamily: "'Raleway', sans-serif" }}>جاري تحميل بيانات الخدمة للتعديل...</Typography>
            </Box>
        );
    }

    return (
        <Box
            dir="ltr"
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: isDark
                    ? 'linear-gradient(to bottom, rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.95)), url("/images/image_58ec0a.jpg")'
                    : 'linear-gradient(to bottom, rgba(240, 235, 225, 0.4), rgba(255, 255, 255, 0.85)), url("/images/image_58ec0a.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                color: theme.palette.text.primary,
            }}
        >
            <Sidebar />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Header title="Edit Service" />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        px: { xs: 3, md: 4, lg: 5 },
                        py: 3.5,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ ...glassSx, maxWidth: '1152px', mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <PageBreadcrumb
                            title="Edit Service"
                            subtitle="Update your service details below."
                        />

                        {/* تمرير البيانات وحالة التحديث لكل المكونات */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                            <CoreDetails data={formData} onChange={setFormData} />
                            <CustomizationPricing data={formData} onChange={setFormData} />
                            <PhotoGallery data={formData} onChange={setFormData} />
                            <Logistics data={formData} onChange={setFormData} />
                        </Box>

                        <ActionBar editMode={true} serviceId={id} data={formData} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}