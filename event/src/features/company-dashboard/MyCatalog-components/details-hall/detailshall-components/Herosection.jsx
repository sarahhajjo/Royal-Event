import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT } from '../../../../../utils/colorConstants';

const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=1200&q=80',
];
const SLIDE_INTERVAL = 3000;

export default function HeroSection({ data }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [activeIndex, setActiveIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    const {
        badge       = 'Premium Package',
        name        = 'Untitled',
        description = 'Managed by Provider',
        images      = HERO_IMAGES,
        onEdit,
        onPublish,
    } = data || {};

    const finalImages = images.length > 0 ? images : HERO_IMAGES;

    useEffect(() => {
        if (finalImages.length <= 1) return;
        const timer = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % finalImages.length);
                setFadeIn(true);
            }, 400);
        }, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, [finalImages.length]);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                // 💡 جعل الصورة مستطيلاً منفصلاً:
                maxWidth: '1050px',
                mx: 'auto',
                mt: { xs: 2, md: 4 },
                height: { xs: 320, sm: 380, md: 420 },
                overflow: 'hidden',
                borderRadius: 4,
                boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(179, 140, 69, 0.15)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid rgba(179, 140, 69, 0.3)`,
                mb: 4
            }}
        >
            {/* ── Background Image ── */}
            <Box
                sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${finalImages[activeIndex]})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: fadeIn ? 1 : 0, transition: 'opacity 0.4s ease-in-out',
                }}
            />

            {/* 💡 تم إزالة طبقة التدرج اللوني (Gradient overlay) من هنا نهائياً */}

            {/* ── Content Container ── */}
            <Box sx={{ height: '100%', position: 'relative', zIndex: 2, px: { xs: 3, md: 5 } }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 5 }}>

                    <Chip
                        label={badge.toUpperCase()}
                        sx={{
                            mb: 2,
                            bgcolor: isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.1),
                            color: isDark ? GOLD : '#1A120D',
                            border: `1px solid ${isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3)}`,
                            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                            height: 24, width: 'fit-content', borderRadius: '4px',
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    <Typography
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3rem' },
                            fontWeight: 700,
                            color: isDark ? '#ffffff' : '#1A120D',
                            lineHeight: 1.1, mb: 1.5, maxWidth: 700,
                            // 💡 ظل خفيف لضمان قراءة النص فوق الصور الساطعة
                            textShadow: isDark ? '0 2px 6px rgba(0,0,0,0.8)' : '0 2px 6px rgba(255,255,255,0.9)',
                        }}
                    >
                        {name}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '0.9rem',
                            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(26, 18, 13, 0.95)',
                            maxWidth: 600, mb: 3.5, lineHeight: 1.6, fontWeight: 600,
                            textShadow: isDark ? '0 2px 6px rgba(0,0,0,0.8)' : '0 2px 6px rgba(255,255,255,0.9)',
                        }}
                    >
                        {description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                            onClick={onEdit}
                            sx={{
                                bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(4px)',
                                color: isDark ? '#fff' : '#1A120D',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : alpha(BROWN_TEXT, 0.2)}`,
                                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                                px: 4, py: 1.2, borderRadius: '6px',
                                '&:hover': { bgcolor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)' },
                            }}
                        >
                            Edit Details
                        </Button>

                        <Button
                            onClick={onPublish}
                            sx={{
                                bgcolor: GOLD,
                                color: '#131110',
                                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
                                px: 4, py: 1.2, borderRadius: '6px',
                                '&:hover': { bgcolor: '#d4b06a' },
                            }}
                        >
                            Publish Venue
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* ── Line Indicators ── */}
            {finalImages.length > 1 && (
                <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1.5, zIndex: 2 }}>
                    {finalImages.map((_, i) => (
                        <Box
                            key={i} onClick={() => setActiveIndex(i)}
                            sx={{
                                width: 36, height: 3, borderRadius: 2, cursor: 'pointer', transition: 'all 0.3s ease',
                                bgcolor: i === activeIndex ? GOLD : (isDark ? 'rgba(255,255,255,0.4)' : alpha(BROWN_TEXT, 0.2)),
                                boxShadow: i === activeIndex ? `0 0 8px ${GOLD}` : 'none',
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}