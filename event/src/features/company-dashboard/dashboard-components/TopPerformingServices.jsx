import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTheme, alpha } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

// 💡 استيراد الألوان الموحدة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_BORDER, LIGHT_INPUT,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG, DARK_SURFACE_BORDER, DARK_CARD_SHADOW
} from '../../../utils/colorConstants';

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
            background: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: '18px', width: '100%', transition: 'background-color 0.3s ease', backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : `0 18px 40px ${alpha(GOLD, 0.15)}`
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '18px', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em', fontWeight: 700 }}>
                    Top Performing Services
                </Typography>
                <Typography sx={{ color: GOLD, fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '0.04em' }}>
                    VIEW ALL →
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2.2 }}>
                {defaultServices.map((service) => (
                    <Box key={service.id} sx={{
                        display: 'flex', flexDirection: 'column', gap: 1.4, p: 1.2,
                        backgroundColor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                        border: isDark ? DARK_SURFACE_BORDER : `1px solid ${alpha(LIGHT_BORDER, 0.6)}`,
                        borderRadius: '16px', alignItems: 'stretch', textAlign: 'left', overflow: 'hidden'
                    }}>
                        <Box component="img" src={service.img} sx={{ width: '100%', height: 132, borderRadius: '12px', objectFit: 'cover' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.35, px: 0.4, pb: 0.3 }}>
                            <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontSize: '14px', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{service.title}</Typography>
                            <Typography sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{service.sub}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <StarIcon sx={{ color: GOLD, fontSize: '13px' }} />
                                <Typography sx={{ color: GOLD, fontSize: '11px', fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>{service.rating}</Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default TopPerformingServices;