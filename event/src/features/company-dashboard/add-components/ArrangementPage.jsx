import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, useTheme, Button, CircularProgress } from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import MediaPreview from './addition_readyarrangement_components/MediaPreview';
import GeneralInfoForm from './addition_readyarrangement_components/GeneralInfoForm';
import InventorySection from "./addition_readyarrangement_components/InventorySection.jsx";
import ServicesSection from "./addition_readyarrangement_components/ServicesSection.jsx";
import AdditionalInfoSection from "./addition_readyarrangement_components/AdditionalInfoSection.jsx";
import ScheduleSection from "./addition_readyarrangement_components/ScheduleSection.jsx";
import additionService from '../../../services/companyService/additionService.js';
import { fetchProductsByType, fetchCategories, fetchDistricts } from "./addition_slices/arrangementSlice.js";

const ArrangementPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [loading, setLoading] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        district_id: '',
        price: '',
        currency: 'SAR', // 💡 1. إضافة الحقل الافتراضي للعملة هنا
        price_type: 'fixed',
        capacity: '',
        secondary_contact_number: '',
        cancel_before_acceptance: false,
        cancel_after_acceptance: false,
        cancel_before_payment: false,
    });

    const servicesEnabled = useSelector(state => state.arrangement.servicesEnabled);
    const selectedStaff = useSelector(state => state.arrangement.selectedStaff);
    const scheduleDates = useSelector(state => state.arrangement.scheduleDates);
    const categories = useSelector(state => state.arrangement.categories);
    const districts = useSelector(state => state.arrangement.districts);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchDistricts());
        dispatch(fetchProductsByType());
    }, [dispatch]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let uploadedImagesPaths = [];
            for (const media of mediaFiles) {
                const uploadRes = await additionService.uploadTempImage(media.file);
                uploadedImagesPaths.push(uploadRes.temp_path || uploadRes.path || uploadRes.url || '');
            }

            let availabilities = [];
            if (scheduleDates) {
                let dates = [];
                if (scheduleDates.selectionMode === 'multiple' && scheduleDates.selectedDates?.length > 0) {
                    dates = scheduleDates.selectedDates;
                } else if (scheduleDates.startDate && scheduleDates.endDate) {
                    let curr = dayjs(scheduleDates.startDate);
                    const end = dayjs(scheduleDates.endDate);
                    while (curr.isBefore(end, 'day') || curr.isSame(end, 'day')) {
                        dates.push(curr.format('YYYY-MM-DD'));
                        curr = curr.add(1, 'day');
                    }
                } else if (scheduleDates.startDate) {
                    dates.push(scheduleDates.startDate);
                }

                const slots = scheduleDates.isAllDay ? [] : (scheduleDates.shiftRanges || []).map(shift => ({
                    start_time: shift.start,
                    end_time: shift.end
                }));

                availabilities = dates.map(d => ({ date: d, slots }));
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                category_id: Number(formData.category_id),
                district_id: Number(formData.district_id),
                price: Number(formData.price),
                currency: formData.currency, // 💡 2. إرسال قيمة العملة المختارة للباك إند هنا
                price_type: formData.price_type,
                capacity: Number(formData.capacity),
                secondary_contact_number: formData.secondary_contact_number,
                cancel_before_acceptance: Boolean(formData.cancel_before_acceptance),
                cancel_after_acceptance: Boolean(formData.cancel_after_acceptance),
                cancel_before_payment: Boolean(formData.cancel_before_payment),
                images: uploadedImagesPaths.filter(Boolean),
                availabilities: availabilities,
                items: selectedProducts.map(p => ({
                    variant_id: p.variantId,
                    quantity: Number(p.qty)
                })),
                freelancers: !servicesEnabled ? [] : selectedStaff.map(s => ({
                    freelancer_id: s.id,
                    contract_id: s.contract_id || "test_contract_id"
                }))
            };

            console.log("🚀 Payload sending to backend:", JSON.stringify(payload, null, 2));
            console.log("📦 Payload Object:", payload);

            await additionService.createArrangement(payload);
            alert("تم إرسال التنسيق بنجاح!");
        } catch (error) {
            console.error("Submit Error:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                console.log("🚨 أخطاء الباك إند بالتفصيل:", backendErrors);
                const errorMessages = Object.values(backendErrors).flat().join('\n');
                alert(`فشل الإرسال بسبب الأخطاء التالية:\n${errorMessages}`);
            } else {
                alert("حدث خطأ غير متوقع أثناء الإرسال.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, ml: '-2%', mt: -6, bgcolor: 'transparent', minHeight: '100vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, ml: '-3%' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add Ready Arrangement</Box>
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                        Add Ready Arrangement
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                        Curate your exclusive venue for the world's most discerning event organizers.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ bgcolor: '#c5a059', color: '#140e0c', fontWeight: 'bold', px: 4, '&:hover': { bgcolor: '#b38c45' } }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Arrangement'}
                </Button>
            </Box>

            <Grid container spacing={4} sx={{ maxWidth: 'none', ml: '-3%' }}>
                <Grid item xs={12} md={5} lg={4} sx={{ flex: 0.5 }}>
                    <MediaPreview mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
                </Grid>

                <Grid item xs={12} md={7} lg={8} sx={{ flex: 1 }}>
                    <Box sx={{ bgcolor: isDark ? '#261d19' : '#E5D9B8', p: 4, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                        <GeneralInfoForm
                            formData={formData}
                            setFormData={setFormData}
                            categories={categories}
                            districts={districts}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <ScheduleSection />
            </Box>

            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <InventorySection selectedItems={selectedProducts} setSelectedItems={setSelectedProducts} />
            </Box>

            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <ServicesSection />
            </Box>

            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <AdditionalInfoSection formData={formData} setFormData={setFormData} />
            </Box>
        </Box>
    );
};

export default ArrangementPage;