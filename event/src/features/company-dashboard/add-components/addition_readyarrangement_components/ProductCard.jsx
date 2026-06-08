import React, { useState } from 'react';
import { Box, Typography, Button, TextField, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ProductCard = ({ product, onAdd }) => {
    const theme = useTheme();

    // حالة للتحكم باللون المختار والكمية
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#ccc');
    const [quantity, setQuantity] = useState(product.qty);

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
                            {product.name}
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                const data = {
                                    ...product,
                                    selectedColor: selectedColor, // القيمة من الـ State في الكرت
                                    selectedQty: quantity         // القيمة من الـ State في الكرت
                                };
                                console.log("البيانات المرسلة للتو:", data);
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
                        $ {product.price}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
                        Available from: {product.availableDate}
                    </Typography>

                    {/* الألوان والكمية */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.8 }}>
                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                            {product.colors?.map((color, i) => (
                                <Box
                                    key={i}
                                    onClick={() => setSelectedColor(color)}
                                    sx={{
                                        width: 14, height: 14, borderRadius: '50%', bgcolor: color, cursor: 'pointer',
                                        border: selectedColor === color ? `1.5px solid ${theme.palette.primary.main}` : '1px solid #555'
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