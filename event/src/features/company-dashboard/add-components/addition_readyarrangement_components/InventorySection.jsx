import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { fetchProductsByType } from '../addition_slices/arrangementSlice';
import ProductCard from './ProductCard';
import SelectedProductsSummary from './SelectedProductsSummary';

export default function InventorySection({ selectedItems, setSelectedItems }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const dispatch = useDispatch();

    const products = useSelector((state) => state.arrangement.products);
    const scheduleDates = useSelector((state) => state.arrangement.scheduleDates);

    useEffect(() => {
        dispatch(fetchProductsByType());
    }, [dispatch]);


    const handleAddProduct = (productData) => {
        const newItem = {
            id: Math.random(),
            variantId: productData.selectedVariantId,
            name: productData.name,
            image: productData.image || productData.variants?.[0]?.images?.[0] || 'https://via.placeholder.com/75',
            qty: productData.selectedQty || 1,
            variantName: productData.selectedColor || 'Default',
            variantColor: productData.selectedColor || '#ccc'
        };
        setSelectedItems(prev => [...prev, newItem]);
    };

    const handleRemoveItem = (id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id));
    };

    // 💡 الفلترة المطورة لتتطابق مع شكل بيانات الباك-إند (مصفوفة أيام)
    const getFilteredProducts = () => {
        // 1. إذا لم يختر أي تاريخ، نعرض الجميع
        if (!scheduleDates || (!scheduleDates.startDate && (!scheduleDates.selectedDates || scheduleDates.selectedDates.length === 0))) {
            return products;
        }

        // 2. تجميع كل الأيام التي اختارها/يحتاجها المستخدم في مصفوفة واحدة
        let requiredDates = [];

        if (scheduleDates.selectedDates && scheduleDates.selectedDates.length > 0) {
            // حالة الأيام المتفرقة (Multiple Days)
            requiredDates = scheduleDates.selectedDates.map(d => dayjs(d).format('YYYY-MM-DD'));
        } else if (scheduleDates.startDate && scheduleDates.endDate) {
            // حالة النطاق (Date Range): نولد كل الأيام بين البداية والنهاية
            let curr = dayjs(scheduleDates.startDate);
            const end = dayjs(scheduleDates.endDate);
            while (curr.isBefore(end, 'day') || curr.isSame(end, 'day')) {
                requiredDates.push(curr.format('YYYY-MM-DD'));
                curr = curr.add(1, 'day');
            }
        } else if (scheduleDates.startDate) {
            // اختار يوماً واحداً فقط كنطاق
            requiredDates.push(dayjs(scheduleDates.startDate).format('YYYY-MM-DD'));
        }

        if (requiredDates.length === 0) return products;

        // 3. فلترة المنتجات
        return products.filter(product => {
            const validVariants = product.variants?.filter(v => v.price > 0) || [];
            if (validVariants.length === 0) return false;

            // يكفي أن يكون هناك Variant واحد متاح لتغطية طلب المستخدم
            return validVariants.some(variant => {
                const availabilities = variant.availabilities || [];

                // إذا لم يرسل الباك-إند مصفوفة توفر، نفترض أن المنتج متاح دائماً
                if (availabilities.length === 0) return true;

                // تحويل تواريخ توفر المنتج إلى مصفوفة نصوص (YYYY-MM-DD) لسهولة المقارنة
                const productAvailableDates = availabilities.map(a => dayjs(a.available_date).format('YYYY-MM-DD'));

                // 💡 السر هنا: نتحقق أن **كل** يوم يطلبه المستخدم، موجود داخل أيام توفر المنتج
                return requiredDates.every(reqDate => productAvailableDates.includes(reqDate));
            });
        });
    };

    const filteredProducts = getFilteredProducts();

    return (
        <Box sx={{
            p: 4, mt: 4, width: 1020,
            bgcolor: isDark ? '#261d19' : '#E5D9B8',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2, boxSizing: 'border-box'
        }}>

        <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>
                    Products Management
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Manage your inventory and live catalog selections in one place.
                </Typography>
            </Box>

            <Grid container spacing={12} alignItems="stretch">

                {/* قسم Saved Products */}
                {/* قسم Saved Products */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>Saved Products</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredProducts
                            .filter(p => p.status === 'draft') // 💡 فلترة المسودات فقط
                            .map(product => {
                                const validVariants = product.variants?.filter(v => v.price > 0) || [];
                                if (validVariants.length === 0) return null;
                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            name: product.title?.en || 'Untitled',
                                            variants: validVariants,
                                            image: validVariants[0]?.images?.[0] || 'https://via.placeholder.com/75'
                                        }}
                                        onAdd={handleAddProduct}
                                    />
                                );
                            })}
                        {filteredProducts.filter(p => p.status === 'draft').length === 0 && (
                            <Typography sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', fontSize: '0.85rem' }}>
                                No saved products available for the selected dates.
                            </Typography>
                        )}
                    </Box>
                </Grid>

                {/* الفاصل العمودي */}
                <Grid item md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                    <Divider orientation="vertical" flexItem />
                </Grid>

                {/* قسم Published Products */}
                <Grid item xs={12} md={6}>
                    <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>Published Products</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredProducts
                            .filter(p => p.status === 'approved') // 💡 فلترة المنشورة فقط
                            .map(product => {
                                const validVariants = product.variants?.filter(v => v.price > 0) || [];
                                if (validVariants.length === 0) return null;
                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            name: product.title?.en || 'Untitled',
                                            variants: validVariants,
                                            image: validVariants[0]?.images?.[0] || 'https://via.placeholder.com/75'
                                        }}
                                        onAdd={handleAddProduct}
                                    />
                                );
                            })}
                        {filteredProducts.filter(p => p.status === 'approved').length === 0 && (
                            <Typography sx={{ color: theme.palette.text.secondary, fontStyle: 'italic', fontSize: '0.85rem' }}>
                                No published products available for the selected dates.
                            </Typography>
                        )}
                    </Box>
                </Grid>

            </Grid>

            <Divider sx={{ my: 4 }} />

            <SelectedProductsSummary
                products={selectedItems}
                onClearAll={() => setSelectedItems([])}
                onRemoveItem={handleRemoveItem}
            />
        </Box>
    );
}