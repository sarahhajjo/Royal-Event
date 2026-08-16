import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import HallFormSection from './addition-hall-component/HallFormSection.jsx';
import DateAndTime from './addition-hall-component/DateAndTime.jsx';
import BookingDetailsBox from './addition-hall-component/BookingDetailsBox.jsx';
import MediaUploader from './addition-hall-component/MediaUploader.jsx';
import Button from '../../../components/Button.jsx';
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialData, publishHall, updateHall } from "./addition_slices/addhallSlice.js";
import dayjs from 'dayjs';

const PublishHallPage = ({ editData = null, onBack }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { isLoading } = useSelector((state) => state.addhall);
    const dispatch = useDispatch();

    const isEditMode = !!editData;

    useEffect(() => {
        dispatch(fetchInitialData());
    }, [dispatch]);

    const [hallData, setHallData] = useState({
        name: '', category_id: '', district_id: '', description: '', capacity: '',
        startDate: null, endDate: null, excludedDates: [], selectedDates: [], shiftRanges: [], isAllDay: false, selectionMode: 'range',
        secondary_contact_number: '',
        cancel_before_acceptance: false, cancel_after_acceptance: false, cancel_before_payment: false,
        priceType: 'fixed', price: '', currency: 'SAR',
        images: [],
        originalAvailabilities: []
    });

    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        if (editData) {
            const v = editData.variants?.[0] || {};

            let startDate = null; let endDate = null;
            let excludedDates = []; let shiftRanges = []; let selectedDates = [];
            let isAllDay = true; let selectionMode = 'range';

            if (v.availabilities && v.availabilities.length > 0) {
                const sortedAvails = [...v.availabilities].sort((a, b) => new Date(a.available_date) - new Date(b.available_date));
                const firstDate = dayjs(sortedAvails[0].available_date);
                const lastDate = dayjs(sortedAvails[sortedAvails.length - 1].available_date);

                startDate = firstDate;
                // 💡 تثبيت وضع النطاق دائماً لتجنب ارتباك مكوّن التواريخ
                endDate = lastDate;
                selectionMode = 'range';

                const availStrings = sortedAvails.map(a => dayjs(a.available_date).format('YYYY-MM-DD'));
                let curr = firstDate.add(1, 'day');
                while (curr.isBefore(lastDate, 'day')) {
                    const dStr = curr.format('YYYY-MM-DD');
                    if (!availStrings.includes(dStr)) excludedDates.push(dStr);
                    curr = curr.add(1, 'day');
                }

                const firstSlots = sortedAvails[0].slots || [];
                if (firstSlots.length > 0) {
                    if (firstSlots.length === 1 && firstSlots[0].start_time.startsWith("00:00") && firstSlots[0].end_time.startsWith("23:59")) {
                        isAllDay = true;
                    } else {
                        isAllDay = false;
                        shiftRanges = firstSlots.map(slot => ({
                            start: slot.start_time.substring(0, 5), end: slot.end_time.substring(0, 5),
                            startLabel: dayjs(`2024-01-01T${slot.start_time}`).format('hh:mm A'),
                            endLabel: dayjs(`2024-01-01T${slot.end_time}`).format('hh:mm A')
                        }));
                    }
                }
            }

            const mappedImages = editData.images?.map(img => ({ id: img.id, name: "Existing Image", url: img.url || img.path, tempPath: null })) || [];

            const mappedData = {
                name: editData.title?.en || editData.title || '',
                category_id: editData.category?.id ? Number(editData.category.id) : (editData.category_id ? Number(editData.category_id) : ''),
                district_id: editData.district?.id ? Number(editData.district.id) : (editData.district_id ? Number(editData.district_id) : ''),
                description: editData.description?.en || editData.description || '',
                secondary_contact_number: editData.secondary_contact_number || '',
                cancel_before_acceptance: !!editData.cancel_before_acceptance,
                cancel_after_acceptance: !!editData.cancel_after_acceptance,
                cancel_before_payment: !!editData.cancel_before_payment,

                capacity: v.stock_quantity || v.stock || v.capacity || '',
                price: v.price || '',
                currency: v.currency || 'SAR',
                priceType: v.price_type || 'fixed',

                startDate, endDate, excludedDates, selectedDates, shiftRanges, isAllDay, selectionMode,
                images: mappedImages,
                originalAvailabilities: v.availabilities || []
            };

            setHallData(mappedData);
            setOriginalData(mappedData);
        }
    }, [editData]);

    const handlePublish = async () => {
        const parsedPrice = parseFloat(hallData.price) || 0;
        const parsedCapacity = parseInt(hallData.capacity) || 1;

        let formattedSlots = [];
        if (hallData.isAllDay || !hallData.shiftRanges || hallData.shiftRanges.length === 0) {
            formattedSlots.push({
                slot_name: { en: "All Day", ar: "طوال اليوم" },
                start_time: "00:00",
                end_time: "23:59",
                remaining_capacity: parsedCapacity
            });
        } else {
            formattedSlots = hallData.shiftRanges.map((range, index) => ({
                slot_name: { en: `Shift ${index + 1}`, ar: `الفترة ${index + 1}` },
                start_time: range.start.substring(0, 5),
                end_time: range.end.substring(0, 5),
                remaining_capacity: parsedCapacity
            }));
        }

        const availabilities = [];
        let datesToProcess = [];

        if (hallData.selectionMode === 'multiple' && hallData.selectedDates.length > 0) {
            datesToProcess = hallData.selectedDates;
        } else if (hallData.startDate) {
            let current = dayjs(hallData.startDate);
            const end = hallData.endDate ? dayjs(hallData.endDate) : dayjs(hallData.startDate);
            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateString = current.format('YYYY-MM-DD');
                if (!hallData.excludedDates.includes(dateString)) datesToProcess.push(dateString);
                current = current.add(1, 'day');
            }
        }

        datesToProcess.forEach((dStr, index) => {
            // 💡 التعديل الجوهري هنا: استخراج الـ ID القديم بناءً على الترتيب وليس مطابقة النص
            // هذا يُجبر لارافيل على تحديث التاريخ القديم بدلاً من إضافة واحد جديد وتجاهل القديم
            const existingAvail = hallData.originalAvailabilities?.[index];

            const availObj = {
                available_date: dStr, is_blocked: false,
                slots: formattedSlots.map((s, slotIndex) => {
                    const slotObj = { ...s };
                    const existingSlot = existingAvail?.slots?.[slotIndex];
                    if (existingSlot?.id) slotObj.id = existingSlot.id;
                    return slotObj;
                })
            };
            if (existingAvail?.id) availObj.id = existingAvail.id;
            availabilities.push(availObj);
        });

        const payload = {
            title: { en: hallData.name || "Hall", ar: hallData.name || "صالة" },
            description: { en: hallData.description || "", ar: hallData.description || "" },
            listing_type: "service", // 💡 تم الإرجاع إلى service
            secondary_contact_number: hallData.secondary_contact_number || null,
            cancel_before_acceptance: hallData.cancel_before_acceptance,
            cancel_after_acceptance: hallData.cancel_after_acceptance,
            cancel_before_payment: hallData.cancel_before_payment,
            is_provider_location_based: true,
            moderation_status: "pending_approval",

            images: (hallData.images || []).map(img => {
                if (img.id) return { id: img.id };
                if (img.tempPath) return { path: img.tempPath };
                return null;
            }).filter(Boolean),

            variants: [{
                variant_name: { en: hallData.name || "Default", ar: hallData.name || "افتراضي" },
                price: parsedPrice, currency: hallData.currency || "SAR", price_type: hallData.priceType || "fixed",
                stock_quantity: parsedCapacity, capacity: parsedCapacity,
                availabilities: availabilities
            }]
        };

        if (hallData.category_id) payload.category_id = Number(hallData.category_id);
        if (hallData.district_id) payload.district_id = Number(hallData.district_id);

        if (isEditMode && editData.variants?.[0]?.id) {
            payload.variants[0].id = editData.variants[0].id;
        }

        try {
            if (isEditMode) {
                await dispatch(updateHall({ id: editData.id, payload })).unwrap();
                if (onBack) onBack();
            } else {
                await dispatch(publishHall(payload)).unwrap();
                if (onBack) onBack();
            }
        } catch (error) {
            console.error("Update/Publish failed:", error);

            let errorMsg = "حدث خطأ غير متوقع أثناء الحفظ.";

            if (error.response && error.response.data && error.response.data.errors) {
                errorMsg = Object.values(error.response.data.errors).flat().join('\n');
            } else if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            } else if (typeof error === 'string') {
                errorMsg = error;
            }

            alert(`السيرفر رفض التعديل للأسباب التالية:\n\n${errorMsg}`);
        }
    };

    return (
        <Box sx={{ width: '100%', px: 0, mt: isEditMode ? 0 : -4 }}>
            <Box sx={{ mb: 4, textAlign: 'left', ml: isEditMode ? 0 : '-3%' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>{isEditMode ? 'Edit Hall' : 'Add New Hall'}</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    {isEditMode ? 'Edit Hall Details' : 'Publish New Hall'}
                </Typography>
            </Box>

            <Box sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'stretch', mb: 3 }}>
                    <Box sx={{ flex: 2, ml: isEditMode ? 0 : '-3%' }}>
                        <HallFormSection data={hallData} setData={setHallData} editMode={isEditMode} originalData={originalData} />
                        <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }}>
                            <MediaUploader
                                data={hallData}
                                setData={setHallData}
                                editMode={isEditMode}
                                originalData={originalData}
                            />
                        </Paper>
                    </Box>
                    <Box sx={{ flex: 1.5, width: 50 }}>
                        <DateAndTime data={hallData} setData={setHallData} />
                    </Box>
                </Box>
                <Box sx={{ ml: isEditMode ? 0 : '-3%' }}>
                    <BookingDetailsBox data={hallData} setData={setHallData} editMode={isEditMode} originalData={originalData} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 3 }}>
                        <Button text={isEditMode ? "UPDATE HALL" : "PUBLISH HALL"} onClick={handlePublish} disabled={isLoading} sx={{ backgroundColor: '#c5a059', color: '#000', py: 1.5, px: 6, fontWeight: 'bold', minWidth: '250px' }} />
                        {isEditMode && (
                            <Button text="CANCEL" onClick={onBack} sx={{ backgroundColor: 'transparent', border: '1px solid #c5a059', color: isDark ? '#fff' : '#000', py: 1.5, px: 6, fontWeight: 'bold' }} />
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default PublishHallPage;