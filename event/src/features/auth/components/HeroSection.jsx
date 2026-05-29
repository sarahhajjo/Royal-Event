import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function HeroSection() {
    return (
        <Box
            className="hidden md:flex"
            sx={{
                width: '50%',
                position: 'relative',
                height: '100%',
                padding: '48px',
                flexDirection: 'col',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 10,
                overflow: 'hidden',
                borderRight: '1px solid rgba(78, 70, 57, 0.3)'
            }}
        >
            {/* الخلفية السينمائية الملكية */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(to right, rgba(24, 18, 15, 0.4), rgba(24, 18, 15, 0.85)), url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 1s ease',
                    '&:hover': { transform: 'scale(1.05)' }
                }}
            />

            {/* الشعار المركزي */}
            <Box sx={{ position: 'relative', zIndex: 20 }}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 'bold', color: '#eee0da', letterSpacing: '0.05em' }}>
                    Royal Events
                </Typography>
                <Box sx={{ width: '48px', height: '2px', backgroundColor: '#c5a059', mt: 1 }} />
            </Box>

            {/* النصوص السفلية الفاخرة */}
            <Box sx={{ position: 'relative', zIndex: 20, maxWidth: '480px', mb: 4 }}>
                <Typography variant="caption" sx={{ display: 'block', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c5a059', fontWeight: 'bold', mb: 1.5 }}>
                    Heritage & Excellence
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", color: '#eee0da', lineHeight: 1.25, mb: 2, fontSize: { lg: '2.5rem', md: '2rem' } }}>
                    A portal to refined experiences and bespoke luxury.
                </Typography>
                <Typography variant="body2" sx={{ color: '#9a8f80', lineHeight: 1.6 }}>
                    Join an exclusive collective where meticulous craftsmanship meets timeless elegance.
                </Typography>
            </Box>
        </Box>
    );
}

export default HeroSection;