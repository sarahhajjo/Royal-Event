import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';

// استيراد الأيقونات والأزرار العامة
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CustomInputField from './addition-components/CustomInputField';
import VariantCard from './addition-components/VariantCard'; // 🚀 استيراد الكومبوننت المخصص الجديد
import Button from '../../components/Button';

function AddProductPage() {
    const [coreDetails, setCoreDetails] = useState({ name: '', description: '', material: '' });
    const [hasVariants, setHasVariants] = useState('yes');
    const [variantCount, setVariantCount] = useState(1);

    const [variants, setVariants] = useState([{}]);
    const [logisticData, setLogisticData] = useState({ secondaryPhone: '', publishingStatus: 'public' });

    const handleCoreChange = (field, value) => {
        setCoreDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleVariantToggle = (choice) => {
        setHasVariants(choice);
        if (choice === 'no') {
            setVariantCount(1);
            setVariants([{}]);
        }
    };

    const handleCountChange = (value) => {
        const num = parseInt(value, 10) || 1;
        const safeNum = Math.max(1, Math.min(num, 20));
        setVariantCount(safeNum);
        setVariants(Array.from({ length: safeNum }, () => ({})));
    };

    return (
        // الحاوية الأب لضمان البقاء داخل مساحة شاشة العرض دون أي تمدد خارجي عشوائي
        <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>

            {/* الترويسة الفاخرة ومسار التنقل الملكي */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: '#9a8f80', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: '#c5a059' }}>Add New Product</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#ffffff', mt: 1, mb: 1, fontWeight: 500 }}>
                    Add New Product
                </Typography>
                <Typography variant="body2" sx={{ color: '#9a8f80', fontWeight: 300 }}>
                    Curate your next exclusive product offering for the Editorial Gala catalog.
                </Typography>
            </Box>

            {/* 1️⃣ القسم الأول: التفاصيل الجوهرية (Core Details) */}
            <Paper sx={{ p: 4, backgroundColor: '#1c1512', border: '1px solid #261d19', borderRadius: '6px', mb: 4, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid rgba(154, 143, 128, 0.1)', pb: 1.5 }}>
                    <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>🗂️</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', letterSpacing: '0.02em' }}>Core Details</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <CustomInputField label="Product Name" placeholder="e.g., Signature Silk Gala Gown" value={coreDetails.name} onChange={(e) => handleCoreChange('name', e.target.value)} />
                    <CustomInputField label="Detailed Description" placeholder="Describe the craftsmanship and narrative behind this piece..." multiline rows={4} value={coreDetails.description} onChange={(e) => handleCoreChange('description', e.target.value)} />
                    <CustomInputField label="Material / Composition" placeholder="e.g., 100% Mulberry Silk, 24k Gold Threading" value={coreDetails.material} onChange={(e) => handleCoreChange('material', e.target.value)} />
                </Box>
            </Paper>

            {/* 2️⃣ القسم الثاني المحمي من التمدد: خيارات الألوان والمتغيرات (Variant Options) */}
            <Paper sx={{
                p: 4,
                backgroundColor: '#1c1512',
                border: '1px solid #261d19',
                borderRadius: '6px',
                mb: 4,
                textAlign: 'left',
                // 🛑 الحماية البرمجية الصارمة لمنع خروج الـ Paper عن حافة شاشة المتصفح 🛑
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid rgba(154, 143, 128, 0.1)', pb: 1.5 }}>
                    <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>🎨</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', letterSpacing: '0.02em' }}>Variant Options</Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: '#9a8f80', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Add variants with different colors?
                        </Typography>
                        <RadioGroup row value={hasVariants} onChange={(e) => handleVariantToggle(e.target.value)}>
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'yes' ? 'rgba(197, 160, 89, 0.08)' : '#140e0c', border: hasVariants === 'yes' ? '1px solid #c5a059' : '1px solid #261d19', borderRadius: '4px' }}>
                                    <FormControlLabel value="yes" control={<Radio sx={{ color: '#c5a059', '&.Mui-checked': { color: '#c5a059' } }} />} label="Yes" sx={{ width: '100%', m: 0, px: 2, color: '#ffffff' }} />
                                </Paper>
                                <Paper sx={{ flex: 1, backgroundColor: hasVariants === 'no' ? 'rgba(197, 160, 89, 0.08)' : '#140e0c', border: hasVariants === 'no' ? '1px solid #c5a059' : '1px solid #261d19', borderRadius: '4px' }}>
                                    <FormControlLabel value="no" control={<Radio sx={{ color: '#c5a059', '&.Mui-checked': { color: '#c5a059' } }} />} label="No" sx={{ width: '100%', m: 0, px: 2, color: '#ffffff' }} />
                                </Paper>
                            </Box>
                        </RadioGroup>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        {hasVariants === 'yes' && (
                            <CustomInputField label="How many colors would you like to add?" placeholder="1" type="number" value={variantCount} onChange={(e) => handleCountChange(e.target.value)} />
                        )}
                    </Grid>
                </Grid>

                {/* 🔄 حاوية التمرير الأفقي الآمنة والمعزولة داخلياً بنسبة 100% */}
                <Box sx={{
                    display: 'flex',
                    gap: 2.5,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    pb: 2,
                    width: '100%',
                    maxWidth: '100%', // إجبار الحاوية على الانضغاط الداخلي دون دفع الأب للخارج
                    boxSizing: 'border-box',
                    WebkitOverflowScrolling: 'touch',

                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#140e0c', borderRadius: '10px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(197, 160, 89, 0.4)', borderRadius: '10px', '&:hover': { backgroundColor: '#c5a059' } }
                }}>
                    {variants.map((_, index) => (
                        // 🚀 استدعاء المكون المستقل الفاخر لكل كرت متغير
                        <VariantCard key={index} index={index} hasVariants={hasVariants} />
                    ))}
                </Box>
            </Paper>

            {/* 3️⃣ القسم الثالث: الخدمات اللوجستية والرؤية (Logistic & Visibility) */}
            <Paper sx={{ p: 4, backgroundColor: '#1c1512', border: '1px solid #261d19', borderRadius: '6px', mb: 5, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: '1px solid rgba(154, 143, 128, 0.1)', pb: 1.5 }}>
                    <Typography sx={{ color: '#c5a059', fontSize: '16px' }}>📦</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', letterSpacing: '0.02em' }}>Logistic & Visibility</Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <CustomInputField label="Secondary Contact Number (Optional)" placeholder="+963 (555) 000-0000" />
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#9a8f80', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 1 }}>Publishing Status</Typography>
                            <RadioGroup row value={logisticData.publishingStatus} onChange={(e) => setLogisticData(prev => ({ ...prev, publishingStatus: e.target.value }))}>
                                <FormControlLabel value="public" control={<Radio sx={{ color: '#c5a059', '&.Mui-checked': { color: '#c5a059' } }} />} label="Display to public" sx={{ color: '#ffffff', mr: 4 }} />
                                <FormControlLabel value="draft" control={<Radio sx={{ color: '#c5a059', '&.Mui-checked': { color: '#c5a059' } }} />} label="Save as private draft" sx={{ color: '#ffffff' }} />
                            </RadioGroup>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: '#9a8f80', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', mb: 1.5 }}>Cancellation Policy</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FormControlLabel control={<Checkbox sx={{ color: '#261d19', '&.Mui-checked': { color: '#c5a059' } }} />} label="Cancellation before acceptance" sx={{ color: '#eee0da' }} />
                            <FormControlLabel control={<Checkbox sx={{ color: '#261d19', '&.Mui-checked': { color: '#c5a059' } }} />} label="Cancellation after acceptance" sx={{ color: '#eee0da' }} />
                            <FormControlLabel control={<Checkbox sx={{ color: '#261d19', '&.Mui-checked': { color: '#c5a059' } }} />} label="Cancellation before payment" sx={{ color: '#eee0da' }} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* أزرار الإجراءات السفلية النهائية */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', borderTop: '1px solid #261d19', pt: 4, pb: 4 }}>
                <Box sx={{ width: '240px' }}>
                    <Button text="PUBLISH PRODUCT" icon={<ArrowForwardIcon fontSize="small" />} />
                </Box>
                <Box component="button" sx={{ px: 4, py: '12px', backgroundColor: 'transparent', border: '1px solid #261d19', color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'all 0.3s', '&:hover': { backgroundColor: '#261d19' } }}>
                    SAVE FOR LATER
                </Box>
            </Box>

        </Box>
    );
}

export default AddProductPage;