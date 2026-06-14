import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import MediaPreview from './addition_readyarrangement_components/MediaPreview';
import GeneralInfoForm from './addition_readyarrangement_components/GeneralInfoForm';
import InventorySection from "./addition_readyarrangement_components/InventorySection.jsx";
import ServicesSection from "./addition_readyarrangement_components/ServicesSection.jsx";
import AdditionalInfoSection from "./addition_readyarrangement_components/AdditionalInfoSection.jsx";
// 💡 استيراد قسم التاريخ الجديد
import ScheduleSection from "./addition_readyarrangement_components/ScheduleSection.jsx";

const ArrangementPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            p: 2,
            ml: '-2%',
            mt: -6,
            bgcolor: 'transparent',
            minHeight: '100vh',
            width: '100%',
        }}>
            {/* العنوان الرئيسي */}
            <Box sx={{ mb: 4, textAlign: 'left', ml: '-3%' }}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add Ready Arrangement</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    Add Ready Arrangement
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                    Curate your exclusive venue for the world's most discerning event organizers.
                </Typography>
            </Box>

            {/* Grid container الرئيسي */}
            <Grid container spacing={4} sx={{ maxWidth: 'none', ml: '-3%' }}>
                <Grid item xs={12} md={5} lg={4} sx={{ flex: 0.5 }}>
                    <MediaPreview />
                </Grid>

                <Grid item xs={12} md={7} lg={8} sx={{ flex: 1 }}>
                    <Box sx={{
                        bgcolor: isDark ? '#261d19' : '#E5D9B8',
                        p: 4,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <GeneralInfoForm />
                    </Box>
                </Grid>
            </Grid>

            {/* قسم المخزون */}
            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <InventorySection />
            </Box>

            {/* 💡 قسم التواريخ الجديد (فوق الخدمات) */}
            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <ScheduleSection />
            </Box>

            {/* قسم الخدمات */}
            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <ServicesSection />
            </Box>

            {/* قسم المعلومات الإضافية */}
            <Box sx={{ mt: 4, ml: '-3%', width: '100%' }}>
                <AdditionalInfoSection />
            </Box>
        </Box>
    );
};

export default ArrangementPage;