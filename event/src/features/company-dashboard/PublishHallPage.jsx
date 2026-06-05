import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import HallFormSection from './add-components/addition-hall-component/HallFormSection';
import BookingDetailsBox from './add-components/addition-hall-component/BookingDetailsBox';
import MediaUploader from './add-components/addition-hall-component/MediaUploader';
import Button from '../../components/Button';

const PublishHallPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [hallData, setHallData] = useState({ name: '', governorate: '', capacity: '', description: '' });

    // استايل موحد للبوكسات (مع تقليل الـ Padding والـ Margin للمساحة الممتلئة)
    const cardStyle = {
        p: 3,
        backgroundColor: isDark ? '#1c1512' : '#EFE4C9',
        border: isDark ? '1px solid #261d19' : '1px solid rgba(179, 140, 69, 0.2)',
        borderRadius: '8px',
        mb: 2,
        textAlign: 'left'
    };

    return (
        // إزالة أي قيود عرض واستخدام width: '100%'
        <Box sx={{ width: '100%', px: 0 }}>
            {/* التايتل */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog • <Box component="span" sx={{ color: theme.palette.primary.main }}>Add New Hall</Box>
                </Typography>
                <Typography variant="h3" sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: theme.palette.text.primary,
                    mt: 0.5,
                    fontWeight: 400
                }}>
                    Publish New Hall
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: '14px', mt: 0.5 }}>
                    Curate your exclusive venue for the world's most discerning event organizers.
                </Typography>
            </Box>

            {/* تقليل الـ spacing إلى 2 لملء الفراغات بين الأعمدة */}
            <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 2 }}>
                        <HallFormSection data={hallData} setData={setHallData} />
                    </Box>
                    <Paper sx={cardStyle}>
                        <MediaUploader />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <BookingDetailsBox data={hallData} setData={setHallData} />

                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button text="PUBLISH HALL" sx={{ backgroundColor: '#c5a059', color: '#000', py: 1.5, fontWeight: 'bold' }} />
                        <Button text="SAVE AS DRAFT" variant="outlined" sx={{ border: '1px solid #c5a059', color: '#c5a059', py: 1.5 }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
export default PublishHallPage;