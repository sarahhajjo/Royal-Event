import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

function TopPerformingServices({ servicesData }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const defaultServices = servicesData || [
        { id: 1, title: 'The Grand Reserve', sub: 'Signature Ballroom', rating: '4.9 (128)', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300' },
        { id: 2, title: 'Sky Terrace Lounge', sub: 'Rooftop Experience', rating: '4.7 (89)', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=300' }
    ];

    return (
        <Paper elevation={0} sx={{
            p: 3,
            backgroundColor: isDark ? '#140e0c' : '#EFE4C9', // ☀️ قلب خلفية خدمات الأداء للعاج الملكي المشرق
            border: isDark ? '1px solid rgba(78, 70, 57, 0.15)' : '1px solid rgba(179, 140, 69, 0.2)',
            borderRadius: '16px',
            width: '100%',
            transition: 'background-color 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '18px', fontFamily: "'Playfair Display', serif" }}>
                    Top Performing Services
                </Typography>
                <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    VIEW ALL →
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
                {defaultServices.map((service) => (
                    <Box key={service.id} sx={{
                        display: 'flex',
                        gap: 2,
                        p: 1.5,
                        backgroundColor: isDark ? '#1c1512' : '#FAF0D5', // ☀️ قلب الصناديق الفردية للون البيج الرملي
                        border: isDark ? '1px solid rgba(78, 70, 57, 0.1)' : '1px solid rgba(179, 140, 69, 0.12)',
                        borderRadius: '12px',
                        alignItems: 'center',
                        textAlign: 'left'
                    }}>
                        <Box component="img" src={service.img} sx={{ width: 64, height: 64, borderRadius: '8px', objectFit: 'cover' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                            <Typography sx={{ color: isDark ? '#eee0da' : '#2B211E', fontSize: '14px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{service.title}</Typography>
                            <Typography sx={{ color: isDark ? '#8a7f70' : '#7A6F5E', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>{service.sub}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
                                <StarIcon sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '13px' }} />
                                <Typography sx={{ color: isDark ? '#c5a059' : '#b38c45', fontSize: '11px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{service.rating}</Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default TopPerformingServices;