import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Radio, Checkbox, Grid, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { fetchInitialData, publishProduct, updateProduct } from './addition_slices/addProductSlice';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CustomInputField from './addition-product-components/CustomInputField.jsx';
import VariantCard from './addition-product-components/VariantCard.jsx';
import Button from '../../../components/Button.jsx';
import { fixImageUrl } from '../../../utils/imageUrlHelper';

import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG
} from '../../../utils/colorConstants';

export default function AddProductPage({ editData = null, onBack }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { categories, districts } = useSelector((state) => state.addProduct);
    const isEditMode = !!editData;

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [pendingStatusTarget, setPendingStatusTarget] = useState(null);

    useEffect(() => { dispatch(fetchInitialData()); }, [dispatch]);

    const [coreDetails, setCoreDetails] = useState({ name: '', description: '', material: '', categoryId: '', districtId: '' });
    const [originalData, setOriginalData] = useState(null);

    const [hasVariants, setHasVariants] = useState('yes');
    const [variantCount, setVariantCount] = useState(1);

    const [variants, setVariants] = useState([{ color: '', price: '', stock: '', images: [], startDate: null, endDate: null, excludedDates: [], shiftRanges: [], isAllDay: false, originalAvailabilities: [] }]);
    const [originalVariants, setOriginalVariants] = useState([]);

    const [logisticData, setLogisticData] = useState({ secondaryPhone: '', publishingStatus: 'public' });
    const [policies, setPolicies] = useState({ beforeAccept: false, afterAccept: false, beforePayment: false });

    useEffect(() => {
        if (editData) {
            const mappedCore = {
                name: editData.title?.en || editData.title || '',
                description: editData.description?.en || editData.description || '',
                material: editData.material_composition || '',
                categoryId: editData.category?.id || editData.category_id || '',
                districtId: editData.district?.id || editData.district_id || '',
                secondaryPhone: editData.secondary_contact_number || ''
            };
            setCoreDetails(mappedCore);
            setOriginalData(mappedCore);

            setLogisticData({
                secondaryPhone: editData.secondary_contact_number || '',
                publishingStatus: editData.moderation_status || 'public'
            });

            setPolicies({
                beforeAccept: !!editData.cancel_before_acceptance,
                afterAccept: !!editData.cancel_after_acceptance,
                beforePayment: !!editData.cancel_before_payment
            });

            if (editData.variants && editData.variants.length > 0) {
                const mappedVariants = editData.variants.map(v => {
                    const colorName = v.name?.en || v.name?.ar || v.name || v.variant_name?.en || v.variant_name?.ar || v.variant_name || '';
                    let startDate = null; let endDate = null;
                    let excludedDates = []; let shiftRanges = [];
                    let isAllDay = true; let selectionMode = 'range';

                    if (v.availabilities && v.availabilities.length > 0) {
                        const sortedAvails = [...v.availabilities].sort((a, b) => new Date(a.available_date) - new Date(b.available_date));
                        const firstDate = dayjs(sortedAvails[0].available_date);
                        const lastDate = dayjs(sortedAvails[sortedAvails.length - 1].available_date);

                        startDate = firstDate;
                        endDate = lastDate.isSame(firstDate, 'day') ? null : lastDate;
                        selectionMode = endDate ? 'range' : 'multiple';

                        if (endDate) {
                            const availableDateStrings = sortedAvails.map(a => dayjs(a.available_date).format('YYYY-MM-DD'));
                            let curr = firstDate.add(1, 'day');
                            while (curr.isBefore(lastDate, 'day')) {
                                const dStr = curr.format('YYYY-MM-DD');
                                if (!availableDateStrings.includes(dStr)) { excludedDates.push(dStr); }
                                curr = curr.add(1, 'day');
                            }
                        }

                        const firstSlots = sortedAvails[0].slots || [];
                        if (firstSlots.length > 0) {
                            isAllDay = false;
                            shiftRanges = firstSlots.map(slot => ({
                                start: slot.start_time.substring(0, 5),
                                end: slot.end_time.substring(0, 5),
                                startLabel: dayjs(`2024-01-01T${slot.start_time}`).format('hh:mm A'),
                                endLabel: dayjs(`2024-01-01T${slot.end_time}`).format('hh:mm A')
                            }));
                        }
                    }

                    return {
                        id: v.id, color: colorName, price: v.price || '',
                        stock: v.stock_quantity || v.stock || '', priceType: v.price_type || 'fixed', currency: v.currency || 'SYP',
                        images: v.images?.map(img => ({ id: img.id, preview: fixImageUrl(img), tempPath: null })) || [],
                        startDate, endDate, excludedDates, shiftRanges, isAllDay, selectionMode,
                        originalAvailabilities: v.availabilities || []
                    };
                });

                setVariants(mappedVariants);
                setOriginalVariants(mappedVariants);
                setVariantCount(mappedVariants.length);

                const firstColor = mappedVariants[0]?.color || '';
                const isDefaultOnly = mappedVariants.length === 1 &&
                    (firstColor === 'Default' || firstColor === 'default' || firstColor === 'افتراضي' || firstColor === '');

                setHasVariants(isDefaultOnly ? 'no' : 'yes');
            }
        }
    }, [editData]);

    const handleCoreChange = (field, value) => setCoreDetails(prev => ({ ...prev, [field]: value }));

    const handlePublishClick = (status) => {
        if (isEditMode) {
            setPendingStatusTarget(status);
            setOpenConfirmDialog(true);
        } else {
            executePublish(status);
        }
    };

    const executePublish = (status) => {
        setOpenConfirmDialog(false);
        const validVariants = variants.filter(v => v.price);

        const payload = {
            category_id: coreDetails.categoryId, district_id: coreDetails.districtId,
            title: { en: coreDetails.name, ar: coreDetails.name }, description: { en: coreDetails.description, ar: coreDetails.description },
            listing_type: "physical_product", material_composition: coreDetails.material,
            cancel_before_acceptance: policies.beforeAccept, cancel_after_acceptance: policies.afterAccept,
            cancel_before_payment: policies.beforePayment, secondary_contact_number: logisticData.secondaryPhone || null,
            is_provider_location_based: true,

            variants: validVariants.map(v => {
                const variantPayload = {
                    variant_name: { en: v.color || "Default", ar: v.color || "افتراضي" },
                    price: parseFloat(v.price) || 0, stock_quantity: parseInt(v.stock) || 0,
                    price_type: v.priceType || 'fixed', currency: v.currency || 'SYP',
                };

                if (v.id) variantPayload.id = v.id;

                if (v.images && v.images.length > 0) {
                    variantPayload.images = v.images.map(img => {
                        if (img.id) return { id: img.id };
                        if (img.tempPath) return { path: img.tempPath };
                        return null;
                    }).filter(Boolean);
                } else {
                    variantPayload.images = [];
                }

                if (v.startDate && typeof v.startDate.format === 'function') {
                    let dates = [];
                    let curr = dayjs(v.startDate);
                    const end = v.endDate ? dayjs(v.endDate) : curr;

                    while (curr.isBefore(end, 'day') || curr.isSame(end, 'day')) {
                        const dStr = curr.format('YYYY-MM-DD');
                        if (!(v.excludedDates || []).includes(dStr)) dates.push(dStr);
                        curr = curr.add(1, 'day');
                    }

                    variantPayload.availabilities = dates.map(dStr => {
                        const existingAvail = (v.originalAvailabilities || []).find(oa => dayjs(oa.available_date).format('YYYY-MM-DD') === dStr);

                        const availObj = {
                            available_date: dStr,
                            is_blocked: false,
                            slots: v.isAllDay ? [] : (v.shiftRanges || []).map(s => {
                                const existingSlot = existingAvail?.slots?.find(es => es.start_time.startsWith(s.start) && es.end_time.startsWith(s.end));
                                const slotObj = { start_time: s.start, end_time: s.end };
                                if (existingSlot?.id) slotObj.id = existingSlot.id;
                                return slotObj;
                            })
                        };
                        if (existingAvail?.id) availObj.id = existingAvail.id;
                        return availObj;
                    });
                } else {
                    variantPayload.availabilities = [];
                }
                return variantPayload;
            })
        };

        payload.status = status;
        payload.moderation_status = status;

        if (isEditMode) {
            dispatch(updateProduct({ id: editData.id, payload }));
            if (onBack) onBack();
        } else {
            dispatch(publishProduct(payload));
        }
    };

    const handleVariantToggle = (choice) => {
        setHasVariants(choice);
        if (choice === 'no') {
            setVariantCount(1);
            setVariants([{ color: '', price: '', stock: '', images: [], startDate: null, endDate: null, excludedDates: [], shiftRanges: [], isAllDay: false, originalAvailabilities: [] }]);
        }
    };

    const handleCountChange = (value) => {
        const numStr = value.replace(/[^0-9]/g, '');
        if (numStr === '') {
            setVariantCount('');
            return;
        }

        const safeNum = Math.min(parseInt(numStr, 10), 30);
        setVariantCount(safeNum);

        if(safeNum > 0) {
            setVariants(prev => {
                const newVariants = [...prev];
                if (safeNum > prev.length) {
                    for (let i = 0; i < safeNum - prev.length; i++) {
                        newVariants.push({ color: '', price: '', stock: '', images: [], startDate: null, endDate: null, excludedDates: [], shiftRanges: [], isAllDay: false, originalAvailabilities: [] });
                    }
                } else if (safeNum < prev.length) {
                    newVariants.length = safeNum;
                }
                return newVariants;
            });
        }
    };

    const handleVariantUpdate = (index, field, value) => setVariants((prev) => { const n = [...prev]; n[index] = { ...n[index], [field]: value }; return n; });
    const handleUpdateFullObject = (index, updatedVariant) => setVariants((prev) => { const n = [...prev]; n[index] = updatedVariant; return n; });

    const glassCardSx = {
        background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
        border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
        borderRadius: '18px',
        backdropFilter: 'blur(16px)',
        boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)'
    };

    // 💡 الحل الجذري لتلوين القوائم المنسدلة: استخدام !important لإلغاء ألوان MUI الافتراضية
    // 💡 الحل الجذري للقوائم المنسدلة (Select) لفرض التأثير الزجاجي وإلغاء خلفية MUI الصلبة
    // 💡 الحل الجذري للقوائم المنسدلة: جعل الـ MenuList شفافاً بالكامل
    const glassMenuProps = {
        PaperProps: {
            sx: {
                bgcolor: 'transparent !important',
                background: isDark ? `${DARK_CARD_BACKGROUND} !important` : `${LIGHT_CARD} !important`,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                color: isDark ? '#ffffff' : BROWN_TEXT,
                backdropFilter: 'blur(24px) !important',
                WebkitBackdropFilter: 'blur(24px) !important', // لدعم متصفح سفاري
                backgroundImage: 'none !important',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.15)',
            }
        },
        MenuListProps: {
            sx: {
                // 💡 هذا السطر هو الذي سيحل مشكلة اللون الصلب!
                backgroundColor: 'transparent !important',
                p: 1, // مسافة داخلية صغيرة لترتيب العناصر
                '& .MuiMenuItem-root': {
                    borderRadius: '6px', // جعل حواف الخيارات دائرية وأنيقة
                    mb: 0.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.25) !important' : 'rgba(197, 160, 89, 0.15) !important',
                        fontWeight: 'bold',
                        color: GOLD
                    },
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.1)',
                        transform: 'translateX(4px)' // تأثير حركة خفيف عند التمرير
                    }
                }
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: GOLD }}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : BROWN_TEXT, mt: 1, mb: 1, fontWeight: 500 }}>
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, ...glassCardSx, height: '100%', width: 490 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                            <Typography sx={{ color: GOLD, fontSize: '16px' }}>🗂️</Typography>
                            <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 700, letterSpacing: '0.03em' }}>Core Details</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <CustomInputField
                                label="Product Name" placeholder="e.g., Signature Silk Gala Gown" value={coreDetails.name} onChange={(e) => handleCoreChange('name', e.target.value)}
                                editMode={isEditMode} isModified={isEditMode && coreDetails.name !== originalData?.name}
                            />
                            <CustomInputField
                                label="Detailed Description" placeholder="Describe the craftsmanship..." multiline rows={4} value={coreDetails.description} onChange={(e) => handleCoreChange('description', e.target.value)}
                                editMode={isEditMode} isModified={isEditMode && coreDetails.description !== originalData?.description}
                            />
                            <CustomInputField
                                label="Material / Composition" placeholder="e.g., Mulberry Silk" value={coreDetails.material} onChange={(e) => handleCoreChange('material', e.target.value)}
                                editMode={isEditMode} isModified={isEditMode && coreDetails.material !== originalData?.material}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, ...glassCardSx, height: '100%' ,width:545 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                            <Typography sx={{ color: GOLD, fontSize: '16px' }}>📦</Typography>
                            <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 700, letterSpacing: '0.03em' }}>Logistics & Details</Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.08em' }}>Category</Typography>
                                        <TextField select fullWidth value={coreDetails.categoryId || ''} onChange={(e) => handleCoreChange('categoryId', e.target.value)} variant="outlined" sx={{ backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, borderRadius: 3, width: '240px', '& .MuiOutlinedInput-root': { height: '44px', color: isDark ? '#ffffff' : BROWN_TEXT, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'transparent' } } }} SelectProps={{ MenuProps: glassMenuProps }}>
                                            {categories.map((cat) => {
                                                const catName = typeof cat.name === 'object' ? (cat.name?.en || cat.name?.ar) : cat.name;
                                                return (
                                                    <MenuItem key={cat.id} value={cat.id}>
                                                        {catName || 'Unnamed Category'}
                                                    </MenuItem>
                                                );
                                            })}
                                        </TextField>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.08em' }}>District</Typography>
                                        <TextField select fullWidth value={coreDetails.districtId || ''} onChange={(e) => handleCoreChange('districtId', e.target.value)} variant="outlined" sx={{ backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, borderRadius: 3, width: '240px', '& .MuiOutlinedInput-root': { height: '44px', color: isDark ? '#ffffff' : BROWN_TEXT, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: 'transparent' }, '&.Mui-focused fieldset': { borderColor: 'transparent' } } }} SelectProps={{ MenuProps: glassMenuProps }}>
                                            {districts.map((dist) => {
                                                const distName = typeof dist.name === 'object' ? (dist.name?.en || dist.name?.ar) : dist.name;
                                                return (
                                                    <MenuItem key={dist.id} value={dist.id}>
                                                        {distName || 'Unnamed District'}
                                                    </MenuItem>
                                                );
                                            })}
                                        </TextField>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ width: 235 }}>
                                        <CustomInputField
                                            label="Secondary Contact Number" placeholder="+963..." value={logisticData.secondaryPhone} onChange={(e) => setLogisticData({ ...logisticData, secondaryPhone: e.target.value })}
                                            editMode={isEditMode} isModified={isEditMode && String(logisticData.secondaryPhone) !== String(originalData?.secondaryPhone || '')}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography sx={{ color: GOLD, fontWeight: 700, mb: 1, fontSize: '0.75rem', letterSpacing: '0.08em' }}>CANCELLATION POLICY</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {[ { label: 'Cancel before acceptance', key: 'beforeAccept' }, { label: 'Cancel after acceptance', key: 'afterAccept' }, { label: 'Cancel before payment', key: 'beforePayment' } ].map((policy) => (
                                                <FormControlLabel key={policy.key} control={<Checkbox size="small" checked={policies[policy.key]} onChange={(e) => setPolicies(prev => ({ ...prev, [policy.key]: e.target.checked }))} sx={{ color: GOLD, '&.Mui-checked': { color: GOLD } }} />} label={<Typography variant="body2" sx={{ fontSize: '0.85rem', color: isDark ? '#ffffff' : BROWN_TEXT, fontFamily: "'Inter', sans-serif" }}>{policy.label}</Typography>} />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 4, ...glassCardSx, mb: 5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pb: 1.5 }}>
                    <Typography sx={{ color: GOLD, fontSize: '16px' }}>🎨</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 700, letterSpacing: '0.03em' }}>Variant Options</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 4, mb: 5 }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: '0.08em' }}>
                            ADD VARIANTS WITH DIFFERENT COLORS?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Box onClick={() => handleVariantToggle('yes')} sx={{ px: 3, py: 1, borderRadius: 3, cursor: 'pointer', background: hasVariants === 'yes' ? 'rgba(197,160,89,0.12)' : (isDark ? DARK_SURFACE_BG : LIGHT_INPUT), border: hasVariants === 'yes' ? '1px solid rgba(197,160,89,0.35)' : (isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`), display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.2s' }}>
                                <Radio size="small" checked={hasVariants === 'yes'} sx={{ p: 0, color: GOLD, '&.Mui-checked': { color: GOLD } }} />
                                <Typography sx={{ fontSize: '14px', color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: hasVariants === 'yes' ? 700 : 500, fontFamily: "'Inter', sans-serif" }}>Yes</Typography>
                            </Box>
                            <Box onClick={() => handleVariantToggle('no')} sx={{ px: 3, py: 1, borderRadius: 3, cursor: 'pointer', background: hasVariants === 'no' ? 'rgba(197,160,89,0.12)' : (isDark ? DARK_SURFACE_BG : LIGHT_INPUT), border: hasVariants === 'no' ? '1px solid rgba(197,160,89,0.35)' : (isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`), display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.2s' }}>
                                <Radio size="small" checked={hasVariants === 'no'} sx={{ p: 0, color: GOLD, '&.Mui-checked': { color: GOLD } }} />
                                <Typography sx={{ fontSize: '14px', color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: hasVariants === 'no' ? 700 : 500, fontFamily: "'Inter', sans-serif" }}>No</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {hasVariants === 'yes' && (
                        <Box>
                            <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.58)' : MUTED_TEXT, fontWeight: 700, textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: '0.08em' }}>
                                HOW MANY COLORS?
                            </Typography>
                            <TextField
                                type="text"
                                size="small"
                                value={variantCount}
                                onChange={(e) => handleCountChange(e.target.value)}
                                sx={{
                                    width: '150px',
                                    '& .MuiOutlinedInput-root': {
                                        height: '42px',
                                        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                                        color: isDark ? '#ffffff' : BROWN_TEXT,
                                        '& fieldset': { borderColor: 'transparent' },
                                        '&:hover fieldset': { borderColor: 'transparent' },
                                        '&.Mui-focused fieldset': { borderColor: 'transparent' },
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 2, width: '100%' }}>
                    {variants.map((v, index) => (
                        <VariantCard
                            key={index}
                            index={index}
                            variantData={v}
                            originalVariant={originalVariants ? originalVariants[index] : null}
                            hasVariants={hasVariants}
                            isSingle={variants.length === 1}
                            onUpdate={handleVariantUpdate}
                            onUpdateFullObject={handleUpdateFullObject}
                            editMode={isEditMode}
                        />
                    ))}
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', borderTop: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, pt: 4, pb: 4 }}>
                <Box sx={{ width: '240px' }} onClick={() => handlePublishClick('pending_approval')}>
                    <Button text={isEditMode ? "UPDATE PRODUCT" : "PUBLISH PRODUCT"} icon={<ArrowForwardIcon fontSize="small" />} />
                </Box>
                {!isEditMode && (
                    <Box component="button" onClick={() => executePublish('draft')} sx={{ fontFamily: 'Inter', px: 4, py: '12px', background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`, color: isDark ? '#ffffff' : BROWN_TEXT, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }}>
                        SAVE AS DRAFT
                    </Box>
                )}
            </Box>

            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                PaperProps={{ sx: { ...glassCardSx, bgcolor: 'transparent', backgroundImage: 'none' } }}
            >
                <DialogTitle sx={{ color: GOLD, fontWeight: 700 }}>
                    Confirm Modifications
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: isDark ? '#ffffff' : BROWN_TEXT }}>
                        Are you sure you want to save these changes?
                        <br/><br/>
                        <b>Note:</b> Submitting these modifications will set the product status back to "Pending Approval" until an administrator reviews it.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button text="Cancel" onClick={() => setOpenConfirmDialog(false)} />
                    <Box onClick={() => executePublish(pendingStatusTarget)}><Button text="Confirm Update" /></Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
}