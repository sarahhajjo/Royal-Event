import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Container, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ── Placeholder images (replace with real venue images from your API) ──────────
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=1200&q=80',
];

const SLIDE_INTERVAL = 3000;

// 💡 استبدال venue بـ data وتفكيك القيم القادمة من mapping. Herosection في الصفحة الرئيسية
export default function HeroSection({ data }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [activeIndex, setActiveIndex]   = useState(0);
    const [fadeIn,      setFadeIn]        = useState(true);

    // 💡 استخدام القيم الحقيقية من data
    const {
        badge       = 'Premium Package',
        name        = 'Untitled',
        description = 'Managed by Provider',
        // 💡 استخدام الصور المعالجة بـ fixImageUrl من الصفحة الرئيسية
        images      = HERO_IMAGES,
        onEdit,
        onPublish,
    } = data || {}; // 💡 التعامل مع احتمال أن data قد تكون null

    // التأكد من وجود صور قبل إعداد المؤقت
    const finalImages = images.length > 0 ? images : HERO_IMAGES;

    // ── Auto-rotate with cross-fade ─────────────────────────────────────────
    useEffect(() => {
        if (finalImages.length <= 1) return; // لا حاجة للدوران إذا كانت هناك صورة واحدة

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
                height: { xs: 320, sm: 400, md: 460 },
                overflow: 'hidden',
                borderRadius: 0,
                mb: 4
            }}
        >
            {/* ── Background Image ── */}
            <Box
                sx={{
                    position:   'absolute',
                    inset:      0,
                    // 💡 عرض الصورة الديناميكية
                    backgroundImage: `url(${finalImages[activeIndex]})`,
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                    opacity:    fadeIn ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                }}
            />

            {/* ── Gradient overlay ── */}
            <Box
                sx={{
                    position:   'absolute',
                    inset:      0,
                    background: `linear-gradient(to top, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.default, 0.8)} 15%, ${alpha(theme.palette.background.default, 0.3)} 50%, transparent 100%)`,
                }}
            />

            {/* ── Content Container ── */}
            <Container maxWidth="md" sx={{ height: '100%', position: 'relative', zIndex: 2 }}>
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        pb: 7,
                    }}
                >
                    {/* Badge */}
                    {/* 💡 عرض الـ Badge الحقيقي */}
                    <Chip
                        label={badge.toUpperCase()}
                        sx={{
                            mb:              2,
                            backgroundColor: isDark ? 'rgba(197,160,89,0.15)' : 'rgba(179,140,69,0.1)',
                            color:           isDark ? '#c5a059' : '#b38c45',
                            fontSize:        '0.65rem',
                            fontWeight:      700,
                            letterSpacing:   '0.1em',
                            height:          24,
                            width:           'fit-content',
                            borderRadius:    '4px'
                        }}
                    />

                    {/* Venue Name */}
                    {/* 💡 عرض الاسم الحقيقي للتنسيق */}
                    <Typography
                        sx={{
                            fontFamily:  "'Playfair Display', serif",
                            fontSize:    { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                            fontWeight:  500,
                            color:       isDark ? '#ffffff' : '#2B211E',
                            lineHeight:  1.1,
                            mb:          2,
                            maxWidth:    700,
                        }}
                    >
                        {name}
                    </Typography>

                    {/* Description */}
                    {/* 💡 عرض وصف التنسيق من الباك إند */}
                    <Typography
                        sx={{
                            fontSize:  '0.9rem',
                            color:     isDark ? 'rgba(255,255,255,0.85)' : 'rgba(43,33,30,0.85)',
                            maxWidth:  600,
                            mb:        4,
                            lineHeight: 1.6,
                            textShadow: isDark ? '0 1px 4px rgba(0,0,0,0.6)' : '0 1px 4px rgba(255,255,255,0.6)',
                        }}
                    >
                        {description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                            onClick={onEdit}
                            sx={{
                                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                                backdropFilter: 'blur(4px)',
                                color:           isDark ? '#fff' : '#2B211E',
                                border:          isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(43,33,30,0.2)',
                                fontSize:        '0.7rem',
                                fontWeight:      600,
                                letterSpacing:   '1px',
                                textTransform:   'uppercase',
                                px:              4,
                                py:              1.2,
                                borderRadius:    '6px',
                                '&:hover': { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)' },
                            }}
                        >
                            Edit Details
                        </Button>

                        <Button
                            onClick={onPublish}
                            sx={{
                                backgroundColor: isDark ? '#e5c07b' : '#b38c45',
                                color:           isDark ? '#140e0c' : '#ffffff',
                                fontSize:        '0.7rem',
                                fontWeight:      700,
                                letterSpacing:   '1px',
                                textTransform:   'uppercase',
                                px:              4,
                                py:              1.2,
                                borderRadius:    '6px',
                                '&:hover': { backgroundColor: isDark ? '#d4ae6a' : '#9a7638' },
                            }}
                        >
                            Publish Venue
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* ── Line Indicators ── */}
            {finalImages.length > 1 && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1.5,
                    zIndex: 2
                }}>
                    {finalImages.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            sx={{
                                width:           36,
                                height:          3,
                                borderRadius:    2,
                                backgroundColor: i === activeIndex
                                    ? (isDark ? '#e5c07b' : '#b38c45')
                                    : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(43,33,30,0.2)'),
                                cursor:          'pointer',
                                transition:      'all 0.3s ease',
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}