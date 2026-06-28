import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';

import { fetchInitialData, publishProduct } from './addition_slices/addProductSlice';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CustomInputField from './addition-product-components/CustomInputField.jsx';
import VariantCard from './addition-product-components/VariantCard.jsx';
import Button from '../../../components/Button.jsx';

function AddProductPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const { categories, districts } = useSelector((state) => state.addProduct);

    useEffect(() => {
        dispatch(fetchInitialData());
    }, [dispatch]);

    const [coreDetails, setCoreDetails] = useState({
        name: '', description: '', material: '', categoryId: '', districtId: ''
    });

    const [hasVariants, setHasVariants] = useState('yes');
    const [variantCount, setVariantCount] = useState(1);

    const [variants, setVariants] = useState([{
        color: '', price: '', stock: '', images: [], // Initialize images as an array
        startDate: null, endDate: null, excludedDates: [], shiftRanges: [], isAllDay: false
    }]);

    const [logisticData, setLogisticData] = useState({ secondaryPhone: '', publishingStatus: 'public' });
    const [policies, setPolicies] = useState({ beforeAccept: false, afterAccept: false, beforePayment: false });

    const handleCoreChange = (field, value) => {
        setCoreDetails(prev => ({ ...prev, [field]: value }));
    };

    const handlePublish = (status) => {
        const validVariants = variants.filter(v => v.price);

        // 💡 طباعة حالة الكروت قبل المعالجة لنتأكد من وجود الصور
        console.log("🛑 RAW VARIANTS STATE BEFORE PUBLISH:", JSON.parse(JSON.stringify(validVariants)));

        const payload = {
            category_id: coreDetails.categoryId,
            district_id: coreDetails.districtId,
            title: { en: coreDetails.name, ar: coreDetails.name },
            description: { en: coreDetails.description, ar: coreDetails.description },
            listing_type: "physical_product",
            material_composition: coreDetails.material,
            status: status,
            moderation_status: status,
            secondary_contact_number: logisticData.secondaryPhone || null,
            cancel_before_acceptance: policies.beforeAccept,
            cancel_after_acceptance: policies.afterAccept,
            cancel_before_payment: policies.beforePayment,
            is_provider_location_based: true,

            variants: validVariants.map(v => {
                const variantPayload = {
                    variant_name: { en: v.color || "Default", ar: v.color || "افتراضي" },
                    price: parseFloat(v.price) || 0,
                    stock_quantity: parseInt(v.stock) || 0,
                    images: Array.isArray(v.images) ? v.images.map(img => img.tempPath) : [],
                    dynamic_attributes: { color: v.color },
                    price_type: v.priceType || 'fixed',
                    currency: v.currency || 'USD',
                };

                if (v.startDate && typeof v.startDate.format === 'function') {
                    if (v.endDate) {
                        variantPayload.date_range = {
                            start_date: v.startDate.format('YYYY-MM-DD'),
                            end_date: v.endDate.format('YYYY-MM-DD'),
                            slots: v.shiftRanges?.map(s => ({
                                start_time: s.start.substring(0, 5),
                                end_time: s.end.substring(0, 5)
                            })) || []
                        };
                    } else {
                        variantPayload.availabilities = [{
                            available_date: v.startDate.format('YYYY-MM-DD'),
                            slots: v.shiftRanges?.map(s => ({
                                start_time: s.start.substring(0, 5),
                                end_time: s.end.substring(0, 5)
                            })) || []
                        }];
                    }
                }

                return variantPayload;
            })
        };

        // 💡 طباعة الـ Payload النهائي للتأكد من إرساله بشكل صحيح
        console.log("🚀 FINAL PAYLOAD SENT TO BACKEND:", JSON.parse(JSON.stringify(payload)));

        dispatch(publishProduct(payload));
    };

    const handleVariantToggle = (choice) => {
        setHasVariants(choice);
        if (choice === 'no') {
            setVariantCount(1);
            setVariants([{ color: '', price: '', stock: '', images: [], startDate: null, endDate: null, excludedDates: [], shiftRanges: [], isAllDay: false }]);
        }
    };

    const handleCountChange = (value) => {
        const num = parseInt(value, 10) || 1;
        const safeNum = Math.max(1, Math.min(num, 20)); // الحد الأقصى 20 والحد الأدنى 1
        setVariantCount(safeNum);

        setVariants(prev => {
            const newVariants = [...prev];

            if (safeNum > prev.length) {
                // إذا زاد العدد: نضيف كروت جديدة فارغة دون المساس بالقديمة
                const diff = safeNum - prev.length;
                for (let i = 0; i < diff; i++) {
                    newVariants.push({
                        color: '', price: '', stock: '', images: [],
                        startDate: null, endDate: null, excludedDates: [],
                        shiftRanges: [], isAllDay: false
                    });
                }
            } else if (safeNum < prev.length) {
                // إذا نقص العدد: نحذف الكروت الزائدة من الأخير
                newVariants.length = safeNum;
            }

            return newVariants;
        });
    };

    // دوال التحديث لتجنب فقدان البيانات (Stale Closure)
    const handleVariantUpdate = (index, field, value) => {
        setVariants((prevVariants) => {
            const newVariants = [...prevVariants];
            newVariants[index] = {
                ...newVariants[index],
                [field]: value
            };
            return newVariants;
        });
    };

    const handleUpdateFullObject = (index, updatedVariant) => {
        setVariants((prevVariants) => {
            const newVariants = [...prevVariants];
            newVariants[index] = updatedVariant;
            return newVariants;
        });
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add New Product</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    Add New Product
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                    Curate your next exclusive product offering for the Editorial Gala catalog.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Core Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', height: '100%', width: 490 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                            <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>🗂️</Typography>
                            <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold' }}>Core Details</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <CustomInputField label="Product Name" placeholder="e.g., Signature Silk Gala Gown" value={coreDetails.name} onChange={(e) => handleCoreChange('name', e.target.value)} />
                            <CustomInputField label="Detailed Description" placeholder="Describe the craftsmanship..." multiline rows={4} value={coreDetails.description} onChange={(e) => handleCoreChange('description', e.target.value)} />
                            <CustomInputField label="Material / Composition" placeholder="e.g., Mulberry Silk" value={coreDetails.material} onChange={(e) => handleCoreChange('material', e.target.value)} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Logistics & Details */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                            <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>📦</Typography>
                            <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold' }}>Logistics & Details</Typography>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>Category</Typography>
                                        <TextField select fullWidth value={coreDetails.categoryId || ''} onChange={(e) => handleCoreChange('categoryId', e.target.value)} variant="outlined" sx={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', borderRadius: 1, width: '240px', '& .MuiOutlinedInput-root': { height: '44px', color: isDark ? '#ffffff' : '#2B211E', '& fieldset': { borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }, '&:hover fieldset': { borderColor: isDark ? '#c5a059' : '#b38c45' }, }, '& .MuiInputBase-input': { paddingTop: '8px', paddingBottom: '8px' } }} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: isDark ? '#261d19' : '#fff' } } } }}>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id} sx={{ color: isDark ? '#fff' : '#000' }}>{cat.name_en}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 'bold', textTransform: 'uppercase', mb: 1, display: 'block' }}>District</Typography>
                                        <TextField select fullWidth value={coreDetails.districtId || ''} onChange={(e) => handleCoreChange('districtId', e.target.value)} variant="outlined" sx={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', borderRadius: 1, width: '240px', '& .MuiOutlinedInput-root': { height: '44px', color: isDark ? '#ffffff' : '#2B211E', '& fieldset': { borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }, '&:hover fieldset': { borderColor: isDark ? '#c5a059' : '#b38c45' }, }, '& .MuiInputBase-input': { paddingTop: '8px', paddingBottom: '8px' } }} SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: isDark ? '#261d19' : '#fff' } } } }}>
                                            {districts.map((dist) => (
                                                <MenuItem key={dist.id} value={dist.id} sx={{ color: isDark ? '#fff' : '#000' }}>{dist.name_en || dist.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>

                                    <Box sx={{ pt: 1 }}>
                                        <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 'bold' }}>Is it at your location?</Typography>
                                        <RadioGroup row defaultValue="yes">
                                            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ width: 235 }}>
                                        <CustomInputField label="Secondary Contact Number" placeholder="+963..." value={logisticData.secondaryPhone} onChange={(e) => setLogisticData({ ...logisticData, secondaryPhone: e.target.value })} />
                                    </Box>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontWeight: 'bold', mb: 1, fontSize: '0.75rem' }}>CANCELLATION POLICY</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {[ { label: 'Cancellation before acceptance', key: 'beforeAccept' }, { label: 'Cancellation after acceptance', key: 'afterAccept' }, { label: 'Cancellation before payment', key: 'beforePayment' } ].map((policy) => (
                                                <FormControlLabel key={policy.key} control={<Checkbox size="small" checked={policies[policy.key]} onChange={(e) => setPolicies(prev => ({ ...prev, [policy.key]: e.target.checked }))} />} label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{policy.label}</Typography>} />
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Variant Options Section */}
            <Paper sx={{ p: 4, backgroundColor: isDark ? '#1c1512' : '#EFE4C9', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', borderRadius: '6px', mb: 5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: isDark ? '1px solid rgba(154, 143, 128, 0.1)' : '1px solid rgba(179, 140, 69, 0.2)', pb: 1.5 }}>
                    <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '16px' }}>🎨</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDark ? '#ffffff' : '#2B211E', fontWeight: 'bold', letterSpacing: '0.02em' }}>Variant Options</Typography>
                </Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 1 }}>Add variants with different colors?</Typography>
                        <RadioGroup row value={hasVariants} onChange={(e) => handleVariantToggle(e.target.value)}>
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'yes' ? (isDark ? 'rgba(197, 160, 89, 0.08)' : '#FFE088') : (isDark ? '#140e0c' : '#FAF0D5'), border: '1px solid', borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }}>
                                    <FormControlLabel value="yes" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="Yes" sx={{ width: '100%', m: 0, px: 2, color: isDark ? '#ffffff' : '#2B211E' }} />
                                </Paper>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'no' ? (isDark ? 'rgba(197, 160, 89, 0.08)' : '#FFE088') : (isDark ? '#140e0c' : '#FAF0D5'), border: '1px solid', borderColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.2)' }}>
                                    <FormControlLabel value="no" control={<Radio sx={{ color: isDark ? '#c5a059' : '#b38c45', '&.Mui-checked': { color: isDark ? '#c5a059' : '#b38c45' } }} />} label="No" sx={{ width: '100%', m: 0, px: 2, color: isDark ? '#ffffff' : '#2B211E' }} />
                                </Paper>
                            </Box>
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {hasVariants === 'yes' && (
                            <CustomInputField label="How many colors?" placeholder="1" type="number" value={variantCount} onChange={(e) => handleCountChange(e.target.value)} />
                        )}
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 2, width: '100%' }}>
                    {variants.map((v, index) => (
                        <VariantCard
                            key={index}
                            index={index}
                            variantData={v}
                            hasVariants={hasVariants}
                            isSingle={variants.length === 1}
                            onUpdate={handleVariantUpdate}
                            onUpdateFullObject={handleUpdateFullObject}
                        />
                    ))}
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', borderTop: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)', pt: 4, pb: 4 }}>
                <Box sx={{ width: '240px' }} onClick={() => handlePublish('pending_approval')}>
                    <Button text="PUBLISH PRODUCT" icon={<ArrowForwardIcon fontSize="small" />} />
                </Box>
                <Box component="button" onClick={() => handlePublish('draft')} sx={{ fontFamily: 'Inter', px: 4, py: '12px', backgroundColor: 'transparent', border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.4)', color: isDark ? '#ffffff' : '#2B211E', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.05em', transition: 'all 0.3s', '&:hover': { backgroundColor: isDark ? '#261d19' : 'rgba(179, 140, 69, 0.05)' }, '&:active': { transform: 'scale(0.97)' } }}>
                    SAVE AS DRAFT
                </Box>
            </Box>
        </Box>
    );
}

export default AddProductPage;