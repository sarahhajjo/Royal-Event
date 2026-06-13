import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import HallFormSection from './addition-hall-component/HallFormSection.jsx';
import DateAndTime from './addition-hall-component/DateAndTime.jsx';
import BookingDetailsBox from './addition-hall-component/BookingDetailsBox.jsx';
import MediaUploader from './addition-hall-component/MediaUploader.jsx';
import Button from '../../../components/Button.jsx';
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialData, publishHall } from "./addition_slices/addhallSlice.js";
import dayjs from 'dayjs';

const PublishHallPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { isLoading } = useSelector((state) => state.addhall);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInitialData());
    }, [dispatch]);

    const [hallData, setHallData] = useState({
        name: '', category_id: '', district_id: '', description: '', capacity: '',
        startDate: null, endDate: null, excludedDates: [], shiftRanges: [],
        secondary_contact_number: '',
        cancel_before_acceptance: false, cancel_after_acceptance: false, cancel_before_payment: false,
        priceType: 'fixed', price: '',currency: 'SAR',
        temp_images: [],
    });

    const parsedPrice = parseFloat(hallData.price) || 0;
    const parsedCapacity = parseInt(hallData.capacity) || 1;

    const handlePublish = () => {
        // ─── 1. تجهيز الشفتات (Slots) بالتنسيق الصحيح H:i بدون ثواني ───
        let formattedSlots = [];

        if (hallData.isAllDay || hallData.shiftRanges.length === 0) {
            formattedSlots.push({
                slot_name: { en: "All Day", ar: "يوم كامل" },
                start_time: "00:00",
                end_time: "23:59",
                remaining_capacity: parsedCapacity
            });
        } else {
            formattedSlots = hallData.shiftRanges.map((range, index) => ({
                slot_name: { en: `Shift ${index + 1}`, ar: `شفت ${index + 1}` },
                start_time: range.start,
                end_time: range.end,
                remaining_capacity: parsedCapacity
            }));
        }

        // ─── 2. توليد مصفوفة الأيام بدقة (مع تخطي الأيام المستثناة) ───
        const availabilities = [];
        if (hallData.startDate) {
            let current = dayjs(hallData.startDate);
            const end = hallData.endDate ? dayjs(hallData.endDate) : dayjs(hallData.startDate);

            while (current.isBefore(end) || current.isSame(end, 'day')) {
                const dateString = current.format('YYYY-MM-DD');

                if (!hallData.excludedDates.includes(dateString)) {
                    availabilities.push({
                        available_date: dateString,
                        is_blocked: false,
                        slots: formattedSlots
                    });
                }
                current = current.add(1, 'day');
            }
        }

        // ─── 3. بناء الـ Payload النهائي ───
        const payload = {
            category_id: hallData.category_id,
            district_id: hallData.district_id,
            title: { en: hallData.name, ar: hallData.name },
            description: { en: hallData.description, ar: hallData.description },
            listing_type: "service",
            secondary_contact_number: hallData.secondary_contact_number,
            cancel_before_acceptance: hallData.cancel_before_acceptance,
            cancel_after_acceptance: hallData.cancel_after_acceptance,
            cancel_before_payment: hallData.cancel_before_payment,
            is_provider_location_based: true,

            // 👈 التعديل هنا: أضفنا حالة المراجعة لتذهب كطلب بانتظار موافقة الإدارة
            moderation_status: "pending_approval",

            images: hallData.temp_images,
            variants: [{
                variant_name: { en: hallData.name || "Default", ar: hallData.name || "افتراضي" },
                price: parsedPrice,
                currency: hallData.currency || "SAR",
                price_type: hallData.priceType || "fixed",
                stock_quantity: parsedCapacity,
                dynamic_attributes: { capacity: parsedCapacity },
                availabilities: availabilities
            }]
        };

        console.log("Final Payload being sent:", payload);
        dispatch(publishHall(payload));
    };

    return (
        <Box sx={{ width: '100%', px: 0, mt: -4 }}>
            <Box sx={{ mb: 4, textAlign: 'left', ml: '-3%' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add New Hall</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    Publish New Hall
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                    Curate your exclusive venue for the world's most discerning event organizers.
                </Typography>
            </Box>

            <Box sx={{ p: 0, backgroundColor: 'transparent', border: 'none', boxShadow: 'none', borderRadius: '0px' }}>

                <Box sx={{ display: 'flex', gap: 4, alignItems: 'stretch', mb: 3 }}>
                    <Box sx={{ flex: 2, ml: '-3%' }}>
                        <HallFormSection data={hallData} setData={setHallData} />
                        <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }}>
                            <MediaUploader data={hallData} setData={setHallData} />
                        </Paper>
                    </Box>

                    <Box sx={{ flex: 1.5 ,width:50}}>
                        <DateAndTime data={hallData} setData={setHallData} />
                    </Box>
                </Box>

                <Box sx={{ ml: '-3%' }}>
                    <BookingDetailsBox data={hallData} setData={setHallData} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            text={isLoading ? "PUBLISHING..." : "PUBLISH HALL"}
                            onClick={handlePublish}
                            disabled={isLoading}
                            sx={{ backgroundColor: '#c5a059', color: '#000', py: 1.5, px: 6, fontWeight: 'bold', minWidth: '250px' }}
                        />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default PublishHallPage;