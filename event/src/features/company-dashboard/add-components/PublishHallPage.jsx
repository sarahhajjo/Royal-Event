import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import HallFormSection from './addition-hall-component/HallFormSection.jsx';
import BookingDetailsBox from './addition-hall-component/BookingDetailsBox.jsx';
import MediaUploader from './addition-hall-component/MediaUploader.jsx';
import Button from '../../../components/Button.jsx';

const PublishHallPage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [hallData, setHallData] = useState({
        name: '',
        governorate: '',
        capacity: '',
        description: ''
    });

    // استايل موحد للبوكسات لضمان تطابق المظهر

    return (
        <Box sx={{ width: '100%', px: 0, mt: -4 }}>
            {/* تقليل المسافة هنا */}
            <Box sx={{ mb: 4, textAlign: 'left' ,ml:'-3%'}}>
                <Typography variant="caption" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Catalog &nbsp;•&nbsp; <Box component="span" sx={{ color: isDark ? '#c5a059' : '#b38c45' }}>Add New Hall</Box>
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: isDark ? '#ffffff' : '#2B211E', mt: 1, mb: 1, fontWeight: 500 }}>
                    Publish New Hall
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#9a8f80' : '#7A6F5E', fontWeight: 300 }}>
                    Curate your exclusive venue for the world's most discerning event organizers.
                </Typography>
            </Box>


            {/* تغيير التقسيم لزيادة عرض العمود الأيمن ومساحة الأيسر */}

            <Box sx={{
                p: 0,
                backgroundColor: 'transparent', // الآن ستختفي الخلفية تماماً
                border: 'none',
                boxShadow: 'none',
                borderRadius: '0px'
            }}>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'stretch', }}>

                    {/* العمود الأيمن (8 أجزاء من 12 - يعني حوالي 66%) */}
                    <Box sx={{ flex: 2 ,ml:'-3%'}}>
                        <HallFormSection data={hallData} setData={setHallData} />

                        <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', mb: 2 }}>
                            <MediaUploader />
                        </Paper>
                    </Box>

                    {/* العمود الأيسر (4 أجزاء من 12 - يعني حوالي 33%) */}
                    <Box sx={{ flex: 1.5 }}>
                        <BookingDetailsBox data={hallData} setData={setHallData} />

                        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                text="PUBLISH HALL"
                                sx={{ backgroundColor: '#c5a059', color: '#000', py: 1.5, fontWeight: 'bold' }}
                            />

                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
};

export default PublishHallPage;