import React, { useState } from 'react';
import { Box, Grid, Typography, Divider, useTheme } from '@mui/material';
import ProductCard from './ProductCard';
import SelectedProductsSummary from './SelectedProductsSummary';

export default function InventorySection() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // 1. تعريف State للمنتجات المضافة لملخص الطلب
    const [selectedItems, setSelectedItems] = useState([]);

    const inventory = [
        { id: 1, name: 'Velvet Lounge Chair', price: '450.00', qty: 12, image: 'https://via.placeholder.com/75', status: 'saved', colors: ['#1E3A8A', '#4A2A19'], availableDate: '24/10/2026' },
        { id: 2, name: 'Crystal Chandelier', price: '850.00', qty: 4, image: 'https://via.placeholder.com/75', status: 'published', colors: ['#4A2A19'], availableDate: '24/10/2026' },
        { id: 3, name: 'Modern Sofa', price: '1200.00', qty: 2, image: 'https://via.placeholder.com/75', status: 'saved', colors: ['#1E3A8A', '#166534'], availableDate: '24/10/2026' },
    ];

    const handleAddProduct = (productData) => {
        // التحقق من أننا نستقبل كائناً يحتوي على القيم المحدثة
        const newItem = {
            id: Math.random(),
            name: productData.name,
            image: productData.image,
            // إذا لم تكن selectedQty موجودة، نستخدم الـ qty الأصلية
            qty: productData.selectedQty || productData.qty,
            // إذا لم يكن selectedColor موجوداً، نستخدم أول لون في المصفوفة
            variantName: productData.selectedColor || productData.colors?.[0] || 'Default',
            variantColor: productData.selectedColor || productData.colors?.[0] || '#ccc'
        };

        setSelectedItems(prev => [...prev, newItem]);
    };
    // 3. دالة الحذف
    const handleRemoveItem = (id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id));
    };

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
                            {inventory.filter(p => p.status === 'saved').map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddProduct} // مرري الدالة مباشرة
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Divider orientation="vertical" flexItem />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>Published Products</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {inventory.filter(p => p.status === 'published').map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddProduct} // مرري الدالة مباشرة
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