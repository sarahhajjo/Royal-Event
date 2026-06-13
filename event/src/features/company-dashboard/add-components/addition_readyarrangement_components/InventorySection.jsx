import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByType } from '../addition_slices/arrangementSlice'; // تأكدي من المسار الصحيح
import ProductCard from './ProductCard';
import SelectedProductsSummary from './SelectedProductsSummary';

export default function InventorySection() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    // جلب المنتجات من الـ Redux Store
    const products = useSelector((state) => state.arrangement.products);

    useEffect(() => {
        dispatch(fetchProductsByType());
    }, [dispatch]);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleAddProduct = (productData) => {
        const newItem = {
            id: Math.random(),
            name: productData.name, // تأكدي من توافق المسميات مع رد الـ API (قد يكون title.en)
            image: productData.image,
            qty: productData.selectedQty || 1,
            variantName: productData.selectedColor || 'Default',
            variantColor: productData.selectedColor || '#ccc'
        };
        setSelectedItems(prev => [...prev, newItem]);
    };

    const handleRemoveItem = (id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id));
    };
    console.log("المنتجات القادمة من الريدكس:", products);
    return (
        <Box sx={{
            p: 4, mt: 4, width: 1020,
            bgcolor: isDark ? '#261d19' : '#E5D9B8',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2, boxSizing: 'border-box'
        }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontFamily: 'Playfair Display' ,fontSize: '1.2rem'}}>
                    Products Management
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Manage your inventory and live catalog selections in one place.
                </Typography>
            </Box>

                <Grid container spacing={12}>
                    <Grid item xs={12} md={6}>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>Saved Products</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {products
                                .filter(p => p.status === 'draft')
                                .map(product => {
                                    // فلترة المتغيرات: نأخذ فقط التي لها سعر أو بيانات صحيحة
                                    const validVariants = product.variants.filter(v => v.price > 0);

                                    // إذا كان المنتج لا يحتوي على متغيرات صحيحة، نتخطاه أو نعرض رسالة
                                    if (validVariants.length === 0) return null;

                                    return (
                                        <ProductCard
                                            key={product.id}
                                            product={{
                                                ...product,
                                                name: product.title?.en || 'Untitled',
                                                variants: validVariants // نمرر فقط المتغيرات الحقيقية
                                            }}
                                            onAdd={handleAddProduct}
                                        />
                                    );
                                })}
                        </Box>
                    </Grid>
                    <Grid item sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Divider orientation="vertical" flexItem />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>Published Products</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {products
                                .filter(p => p.status === 'approved')
                                .map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            name: product.title?.en || 'Untitled',
                                            price: product.variants?.[0]?.price || 0,
                                            qty: product.variants?.[0]?.stock || 0,
                                            image: product.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/75',

                                            // هنا التعديل: نأخذ الاسم (مثل 'red') ونضعه في مصفوفة الألوان
                                            colors: product.variants?.map(v => v.name?.en || 'gray') || ['gray'],
                                            availableDate: product.variants?.[0]?.availabilities?.[0]?.available_date || 'N/A'
                                        }}
                                        onAdd={handleAddProduct}
                                    />
                                ))}
                        </Box>
                    </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* تمرير القائمة الديناميكية ودوال التعديل */}
            <SelectedProductsSummary
                products={selectedItems}
                onClearAll={() => setSelectedItems([])}
                onRemoveItem={handleRemoveItem}
            />
        </Box>
    );
}