import React, { useState } from 'react';
import { Box, Typography, Button, TextField, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ProductCard = ({ product, onAdd }) => {
    const theme = useTheme();

    // حالة للتحكم باللون المختار والكمية
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(selectedVariant.stock || 0);

    const handleColorClick = (variant) => {
        setSelectedVariant(variant);
        setQuantity(variant.stock); // تحديث الكمية القصوى عند تغيير اللون
    };
    // دالة التعامل مع تغيير الكمية مع التحقق
    const handleQtyChange = (e) => {
        const val = parseInt(e.target.value);
        // التحقق: لا يتجاوز الحد الأقصى (product.qty) ولا يقل عن 1
        if (val > product.qty) {
            setQuantity(product.qty);
        } else if (val < 1 || isNaN(val)) {
            setQuantity(1);
        } else {
            setQuantity(val);
        }
    };
    // دالة بسيطة للتأكد من أن النص لون صحيح، وإلا نرجع لون افتراضي
    const getColorCode = (color) => {
        const c = color.toLowerCase();
        const colorMap = {
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'white': '#FFFFFF',
            'black': '#000000',
            'yellow': '#FFFF00',
            'purple': '#800080',
            'orange': '#FFA500',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'gray': '#808080'
        };
        return colorMap[c] || c; // إذا لم يجد الاسم، سيعتبره كود Hex مباشر
    };
    return (
        <Box sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 2.5,
            width: 700,
            maxWidth: 380,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
        }}>

            <Box sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',

            }}>
                {/* الصورة */}
                <Box sx={{ width: 75, height: 90, borderRadius: 1.2, bgcolor: theme.palette.action.hover, flexShrink: 0 }}>
                    <img src={product.image} alt={product.name} style={{ width: 75, height: 90, objectFit: 'cover', borderRadius: 'inherit' }} />
                </Box>

                {/* التفاصيل */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {product.title?.en || product.name}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                const data = {
                                    ...product,
                                    selectedColor: selectedVariant.name.en, // استخدمي القيمة الصحيحة
                                    selectedQty: quantity     // القيمة من الـ State في الكرت
                                };
                                onAdd(data); // هنا نستدعي الدالة التي مررناها من الأب
                            }}
                            startIcon={<AddIcon sx={{ fontSize: '0.7rem', ml: -0.5 }} />}
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.background.default, fontSize: '0.6rem',
                                px: 1, py: 0, minWidth: 'auto', borderRadius: 1,
                                '&:hover': { bgcolor: theme.palette.primary.dark },
                                ml: '28%'
                            }}
                        >
                            ADD
                        </Button>
                    </Box>

                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '0.8rem' }}>
                        $ {selectedVariant.price}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
                        Available from: {selectedVariant.availabilities?.[0]?.available_date ? selectedVariant.availabilities[0].available_date.split('T')[0] : 'N/A'}
                    </Typography>

                    {/* الألوان والكمية */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.8 }}>
                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                            {product.variants.map((v, i) => (
                                <Box
                                    key={i}
                                    onClick={() => handleColorClick(v)}
                                    sx={{
                                        width: 16, height: 16, borderRadius: '50%',
                                        bgcolor: getColorCode(v.name.en),
                                        border: selectedVariant.id === v.id ? '2px solid gold' : '1px solid #555'
                                    }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ color: theme.palette.text.primary, fontSize: '0.7rem', fontWeight: 'bold' }}>QTY:</Typography>
                            <TextField
                                type="number"
                                size="small"
                                value={quantity}
                                onChange={handleQtyChange}
                                inputProps={{ max: selectedVariant.stock }} // السقف هو كمية هذا اللون فقط
                                sx={{
                                    width: 40,
                                    '& .MuiInputBase-input': { p: 0.2, textAlign: 'center', fontSize: '0.75rem', color: theme.palette.text.primary },
                                    '& .MuiOutlinedInput-root': { borderRadius: 0.8, '& fieldset': { borderColor: theme.palette.primary.main } }
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductCard;