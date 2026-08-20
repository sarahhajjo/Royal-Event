import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, useTheme, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import MediaPreview from './addition_readyarrangement_components/MediaPreview';
import GeneralInfoForm from './addition_readyarrangement_components/GeneralInfoForm';
import InventorySection from "./addition_readyarrangement_components/InventorySection.jsx";
import ServicesSection from "./addition_readyarrangement_components/ServicesSection.jsx";
import AdditionalInfoSection from "./addition_readyarrangement_components/AdditionalInfoSection.jsx";
import ScheduleSection from "./addition_readyarrangement_components/ScheduleSection.jsx";
import additionService from '../../../services/companyService/additionService.js';
import {
    fetchFreelancers, fetchProductsByType, fetchCategories, fetchDistricts,
    setAllStaff, setServicesEnabled, setScheduleDates, resetArrangementState
} from "./addition_slices/arrangementSlice.js";

// 💡 استيراد الدالة من ملف الـ Helper بدلاً من كتابتها يدوياً
import { fixImageUrl } from '../../../utils/imageUrlHelper';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../utils/colorConstants';
const ArrangementPage = ({ editData = null, onBack }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const isEditMode = !!editData;

    const [loading, setLoading] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const dispatch = useDispatch();

    const [originalData, setOriginalData] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        district_id: '',
        price: '',
        currency: 'SAR',
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
        dispatch(fetchFreelancers());
    }, [dispatch]);

    useEffect(() => {
        if (editData) {
            const mappedData = {
                title: editData.title?.en || editData.title || '',
                description: editData.description?.en || editData.description || '',
                category_id: editData.category?.id || editData.category_id || '',
                district_id: editData.district?.id || editData.district_id || '',
                price: editData.price || '',
                currency: editData.currency || 'SAR',
                price_type: editData.price_type || 'fixed',
                capacity: editData.capacity || '',
                secondary_contact_number: editData.secondary_contact_number || '',
                cancel_before_acceptance: !!editData.cancel_policies?.before_acceptance,
                cancel_after_acceptance: !!editData.cancel_policies?.after_acceptance,
                cancel_before_payment: !!editData.cancel_policies?.before_payment,
            };

            setFormData(mappedData);
            setOriginalData(mappedData);

            let incomingImages = [];
            if (editData.images) {
                incomingImages = Array.isArray(editData.images) ? editData.images : Object.values(editData.images);
            } else if (editData.media) {
                incomingImages = Array.isArray(editData.media) ? editData.media : Object.values(editData.media);
            } else if (editData.image) {
                incomingImages = [editData.image];
            }

            if (incomingImages.length > 0) {
                setMediaFiles(incomingImages.map(img => ({
                    preview: fixImageUrl(img),
                    file: null,
                    id: (typeof img === 'object' && img !== null) ? img.id : null,
                    _raw: img,
                    type: 'image/jpeg'
                })));
            } else {
                setMediaFiles([]);
            }

            if (editData.items && editData.items.length > 0) {
                setSelectedProducts(editData.items.map(item => ({
                    id: item.variant?.id || item.variant_id,
                    variantId: item.variant?.id || item.variant_id,
                    qty: item.quantity,
                    name: item.variant?.listing?.title?.en || item.variant?.listing?.title || 'Included Product',
                    variantName: item.variant?.variant_name?.en || item.variant?.variant_name || '',
                    image: fixImageUrl(item.variant?.image)
                })));
            }

            if (editData.freelancers && editData.freelancers.length > 0 && dispatch(setAllStaff)) {
                dispatch(setServicesEnabled(true));
                const mappedStaff = editData.freelancers.map(f => ({
                    id: f.freelancer_id,
                    contract_id: f.contract_id,
                    name: f.freelancer?.brand_name || f.freelancer?.user?.first_name || 'Freelancer',
                    role: f.freelancer?.provider_type || 'Freelancer',
                    status: 'available'
                }));
                dispatch(setAllStaff(mappedStaff));
            } else if (dispatch(setAllStaff)) {
                dispatch(setServicesEnabled(false));
                dispatch(setAllStaff([]));
            }

            if (editData.availabilities && editData.availabilities.length > 0 && dispatch(setScheduleDates)) {
                const sortedAvails = [...editData.availabilities].sort((a, b) => new Date(a.available_date) - new Date(b.available_date));
                const firstDate = dayjs(sortedAvails[0].available_date);
                const lastDate = dayjs(sortedAvails[sortedAvails.length - 1].available_date);

                const selectionMode = lastDate.isSame(firstDate, 'day') ? 'multiple' : 'range';
                const firstSlots = sortedAvails[0].slots || [];
                const isAllDay = firstSlots.length === 0 || (firstSlots.length === 1 && firstSlots[0].start_time.startsWith("00:00"));

                dispatch(setScheduleDates({
                    startDate: firstDate.format('YYYY-MM-DD'),
                    endDate: selectionMode === 'range' ? lastDate.format('YYYY-MM-DD') : null,
                    selectedDates: selectionMode === 'multiple' ? sortedAvails.map(a => dayjs(a.available_date).format('YYYY-MM-DD')) : [firstDate.format('YYYY-MM-DD')],
                    selectionMode: selectionMode,
                    isAllDay: isAllDay,
                    shiftRanges: isAllDay ? [] : firstSlots.map(s => ({
                        start: s.start_time.substring(0, 5),
                        end: s.end_time.substring(0, 5),
                        startLabel: dayjs(`2024-01-01T${s.start_time}`).format('hh:mm A'),
                        endLabel: dayjs(`2024-01-01T${s.end_time}`).format('hh:mm A')
                    }))
                }));
            }
        } else {
            if(dispatch(resetArrangementState)) dispatch(resetArrangementState());
            setSelectedProducts([]);
            setMediaFiles([]);
        }
    }, [editData, dispatch]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. رفع الصور الجديدة فقط (إذا قام المستخدم بتحديد صور من جهازه)
            const newImagesFiles = mediaFiles.filter(m => m.file);
            let newUploadedImages = [];

            for (const media of newImagesFiles) {
                const uploadRes = await additionService.uploadTempImage(media.file);
                const path = uploadRes.temp_path || uploadRes.path || uploadRes.url || '';
                if (path) {
                    let cleanPath = path.replace(/^https?:\/\/[^\/]+/, '');
                    cleanPath = cleanPath.replace(/^\/?(storage\/)?/, '');
                    newUploadedImages.push({ path: cleanPath }); // إرسال المسار للصور الجديدة
                }
            }

            // 💡 2. الحل الجذري: إرسال الـ ID الخاص بالصور القديمة ليحتفظ بها الباك إند ولا يمسحها!
            const retainedImages = mediaFiles
                .filter(m => !m.file && m.id)
                .map(m => ({ id: m.id })); // إرسال المعرّف (ID) فقط

            // 3. دمج الصور الجديدة والمحتفظ بها
            const finalImages = [...newUploadedImages, ...retainedImages];

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
                    dates.push(dayjs(scheduleDates.startDate).format('YYYY-MM-DD'));
                }

                availabilities = dates.map(d => {
                    const existingAvail = editData?.availabilities?.find(a => dayjs(a.available_date).format('YYYY-MM-DD') === d);

                    const slots = scheduleDates.isAllDay ? [] : (scheduleDates.shiftRanges || []).map(shift => {
                        const existingSlot = existingAvail?.slots?.find(es => es.start_time.startsWith(shift.start) && es.end_time.startsWith(shift.end));
                        const slotObj = {
                            start_time: shift.start,
                            end_time: shift.end,
                            // 💡 الباك إند بيطلب remaining_capacity بكل سلوت — افتراضياً 1 (حجز واحد بالوقت هاد)
                            remaining_capacity: existingSlot?.remaining_capacity ?? 1
                        };
                        if (existingSlot?.id) slotObj.id = existingSlot.id;
                        return slotObj;
                    });

                    const availObj = {
                        available_date: d,
                        // 💡 الباك إند بيطلب is_blocked بكل يوم توفر
                        is_blocked: existingAvail?.is_blocked ?? false,
                        slots: slots
                    };
                    if (existingAvail?.id) availObj.id = existingAvail.id;
                    return availObj;
                });
            }

            const itemsPayload = selectedProducts.map(p => {
                const existingItem = editData?.items?.find(i => (i.variant?.id || i.variant_id) === p.variantId);
                const itemObj = {
                    variant_id: p.variantId,
                    quantity: Number(p.qty)
                };
                if (existingItem?.id) itemObj.id = existingItem.id;
                return itemObj;
            });

            const freelancersPayload = !servicesEnabled ? [] : selectedStaff.map(s => {
                const existingFreelancer = editData?.freelancers?.find(f => f.freelancer_id === s.id);
                const fObj = {
                    freelancer_id: s.id,
                    contract_id: s.contract_id || "test_contract_id"
                };
                if (existingFreelancer?.id) fObj.id = existingFreelancer.id;
                return fObj;
            });

            const payload = {
                title: formData.title,
                description: formData.description,
                category_id: Number(formData.category_id),
                district_id: Number(formData.district_id),
                price: Number(formData.price),
                currency: formData.currency,
                price_type: formData.price_type,
                capacity: Number(formData.capacity),
                secondary_contact_number: formData.secondary_contact_number,
                cancel_before_acceptance: Boolean(formData.cancel_before_acceptance),
                cancel_after_acceptance: Boolean(formData.cancel_after_acceptance),
                cancel_before_payment: Boolean(formData.cancel_before_payment),

                // إرسال الصور بالشكل الذي ينتظكه الباك إند
                images: finalImages,

                availabilities: availabilities,
                items: itemsPayload,
                freelancers: freelancersPayload
            };

            // 🖨️ طباعة تفصيلية للبيانات قبل إرسالها للباك إند — لتتبع أي مشكلة بالـ payload
            console.log(
                `%c📤 [${isEditMode ? 'UPDATE' : 'CREATE'}] Sending Arrangement Payload to backend`,
                'color:#c5a059; font-weight:bold; font-size:12px;'
            );
            console.log('➡️ Endpoint:', isEditMode ? `updateArrangement(${editData?.id})` : 'createArrangement');
            console.log('📦 Full Payload:', payload);
            console.table({
                title: payload.title,
                category_id: payload.category_id,
                district_id: payload.district_id,
                price: payload.price,
                currency: payload.currency,
                capacity: payload.capacity,
                images_count: payload.images.length,
                availabilities_count: payload.availabilities.length,
                items_count: payload.items.length,
                freelancers_count: payload.freelancers.length,
            });
            console.log('🖼️ Images:', payload.images);
            console.log('📅 Availabilities:', payload.availabilities);
            console.log('📦 Items:', payload.items);
            console.log('👥 Freelancers:', payload.freelancers);

            if (isEditMode) {
                await additionService.updateArrangement(editData.id, payload);
                console.log('✅ Update request sent successfully');
                alert("تم تحديث التنسيق بنجاح!");
                if(onBack) onBack();
            } else {
                await additionService.createArrangement(payload);
                console.log('✅ Create request sent successfully');
                alert("تم إرسال التنسيق بنجاح!");
                if(onBack) onBack();
            }
        } catch (error) {
            console.error("❌ Submit Error:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(`فشل الإرسال بسبب الأخطاء التالية:\n${errorMessages}`);
            } else {
                alert("حدث خطأ غير متوقع أثناء الإرسال.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, ml: '-2%', mt: isEditMode ? 0 : -6, bgcolor: 'transparent', minHeight: '100vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, ml: '-3%' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>
                        Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: GOLD }}>{isEditMode ? 'Edit Arrangement' : 'Add Ready Arrangement'}</Box>
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : BROWN_TEXT, mt: 1, mb: 1, fontWeight: 500 }}>
                        {isEditMode ? 'Edit Arrangement' : 'Add Ready Arrangement'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 300 }}>
                        Curate your exclusive venue for the world's most discerning event organizers.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {isEditMode && (
                        <Button variant="outlined" onClick={onBack} sx={{ color: isDark ? '#fff' : BROWN_TEXT, borderColor: GOLD, '&:hover': { borderColor: GOLD } }}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ bgcolor: GOLD, color: '#140e0c', fontWeight: 'bold', px: 4, '&:hover': { bgcolor: '#b38c45' } }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update Arrangement' : 'Publish Arrangement')}
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4} sx={{ maxWidth: 'none', ml: '-3%' }}>
                <Grid item xs={12} md={5} lg={4} sx={{ flex: 0.5 }}>
                    <MediaPreview mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
                </Grid>

                <Grid item xs={12} md={7} lg={8} sx={{ flex: 1 }}>
                    <Box sx={{
                        background: isDark
                            ? 'linear-gradient(180deg, rgba(17, 22, 36, 0.88) 0%, rgba(16, 21, 31, 0.86) 100%)'
                            : LIGHT_CARD,
                        p: 4,
                        borderRadius: 2,
                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(197, 160, 89, 0.4)',
                        boxShadow: isDark ? '0 18px 40px rgba(0,0,0,0.22)' : '0 18px 40px rgba(130, 100, 40, 0.10)'
                    }}>
                        <GeneralInfoForm
                            formData={formData}
                            setFormData={setFormData}
                            categories={categories}
                            districts={districts}
                            editMode={isEditMode}
                            originalData={originalData}
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
                <AdditionalInfoSection
                    formData={formData}
                    setFormData={setFormData}
                    editMode={isEditMode}
                    originalData={originalData}
                />
            </Box>
        </Box>
    );
};

export default ArrangementPage;
