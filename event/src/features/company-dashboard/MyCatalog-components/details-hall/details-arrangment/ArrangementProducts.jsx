import React from 'react';
import { Box, Typography, Divider, Paper, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

// ── كرت المنتج (التصميم الجديد) ────────────────────────────────────────────────
function ProductCardHorizontal({ product }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    // استخراج معلومات العرض من أول نسخة (Variant) للمنتج
    const firstVariant = product.variants[0] || {};
    const image        = firstVariant.image || 'https://via.placeholder.com/150?text=No+Image';
    const price        = firstVariant.price || 0;
    const currency     = firstVariant.currency || '';

    // حساب الكمية الإجمالية المرفقة من هذا المنتج بكل ألوانه
    const totalQty     = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return (
        <Box sx={{
            display: 'flex',
            minWidth: { xs: 280, sm: 330 }, // العرض الثابت للكرت ليعمل السكرول
            maxWidth: 350,
            flexShrink: 0, // 💡 يمنع الكرت من الانضغاط
            p: 1.5,
            backgroundColor: isDark ? '#1c1512' : '#fcf8f0',
            border: `1px solid ${border}`,
            borderRadius: 3,
            gap: 2,
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: theme.palette.primary.main }
        }}>
            {/* 1. قسم الصورة (مربع بخلفية بيضاء) */}
            <Box sx={{
                width: 90,
                height: 90,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1px solid ${border}`
            }}>
                <img
                    src={image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                />
            </Box>

            {/* 2. قسم المعلومات */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', py: 0.5 }}>

                {/* العنوان والسعر */}
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: theme.palette.text.primary, mb: 0.5, textTransform: 'capitalize' }}>
                        {product.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#c5a059' }}>
                        {price} {currency}
                    </Typography>
                </Box>

                {/* الألوان والكمية في الأسفل */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>

                    {/* دوائر الألوان (نعرض دائرة لكل نسخة/لون موجودة في البكج) */}
                    <Box sx={{ display: 'flex', gap: 0.8 }}>
                        {product.variants.map((v, idx) => {
                            // التعرف على اللون برمجياً (مثلاً red، pink)، وفي حال لم يتعرف عليه نضع لون افتراضي
                            const cssColor = v.colorName ? v.colorName.toLowerCase().replace(/\s/g, '') : '#c5a059';
                            return (
                                <Tooltip key={idx} title={`${v.colorName} (Qty: ${v.stock})`} placement="top">
                                    <Box sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '50%',
                                        backgroundColor: cssColor,
                                        border: `2px solid ${isDark ? '#1c1512' : '#fcf8f0'}`,
                                        outline: '1px solid #c5a059', // الإطار الذهبي الخارجي
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                    }} />
                                </Tooltip>
                            );
                        })}
                    </Box>

                    {/* مربع الكمية */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: theme.palette.text.primary }}>
                            QTY:
                        </Typography>
                        <Box sx={{
                            px: 1.5, py: 0.2,
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            backgroundColor: isDark ? '#140e0c' : '#ffffff'
                        }}>
                            {totalQty}
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}

// ── المكون الرئيسي ────────────────────────────────────────────────────────────
export default function ArrangementProducts({ products = [] }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    return (
        <Paper elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${border}`, borderRadius: 2, p: { xs: 2.5, sm: 3 }, mb: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CategoryOutlinedIcon sx={{ fontSize: 17, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                    Included Products
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: border }} />

            {products.length === 0 ? (
                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, textAlign: 'center', py: 3 }}>
                    No physical products linked to this arrangement.
                </Typography>
            ) : (
                // 💡 الكونتينر المسؤول عن السكرول العرضي
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 1, // فراغ صغير بالأسفل مشان السكرول بار
                    // ستايل مخصص للسكرول بار ليكون رفيع وأنيق
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: isDark ? '#4e4639' : '#d1c4a5',
                        borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#c5a059' }
                }}>
                    {products.map((prod, i) => (
                        <ProductCardHorizontal key={i} product={prod} />
                    ))}
                </Box>
            )}
        </Paper>
    );
}