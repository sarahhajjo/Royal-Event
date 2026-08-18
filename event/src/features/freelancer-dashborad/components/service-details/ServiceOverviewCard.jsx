import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Sparkles, MapPin } from "lucide-react";
import ServiceGallery from "./ServiceGallery";
import GalleryLightbox from "./GalleryLightbox";

const getLocalizedText = (text) => {
    if (!text) return "";
    if (typeof text === "object") {
        return text.en || text.ar || "بدون عنوان";
    }
    return text;
};

export default function ServiceOverviewCard({
                                                title,
                                                description,
                                                images = [],
                                                category,
                                                location,
                                            }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [lightboxIndex, setLightboxIndex] = useState(null);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
                gap: 4,
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: isDark ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                p: { xs: 3, md: 4 }
            }}
        >
            {/* النص */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography sx={{ mb: 2, fontFamily: "'Cinzel', serif", fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 700, color: 'primary.main' }}>
                    {getLocalizedText(title)}
                </Typography>
                <Typography sx={{ mb: 3, fontSize: '0.9rem', lineHeight: 1.7, color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    {getLocalizedText(description)}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {category && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.6)',
                                px: 2,
                                py: 0.8,
                                fontSize: '0.75rem',
                                color: theme.palette.text.secondary
                            }}
                        >
                            <Sparkles size={14} color={theme.palette.primary.main} />
                            {getLocalizedText(category)}
                        </Box>
                    )}
                    {location && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.6)',
                                px: 2,
                                py: 0.8,
                                fontSize: '0.75rem',
                                color: theme.palette.text.secondary
                            }}
                        >
                            <MapPin size={14} color={theme.palette.primary.main} />
                            {getLocalizedText(location)}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* الصور */}
            <ServiceGallery images={images} alt={getLocalizedText(title)} onOpenLightbox={setLightboxIndex} />

            {lightboxIndex !== null && (
                <GalleryLightbox
                    images={images}
                    activeIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onChangeIndex={setLightboxIndex}
                />
            )}
        </Box>
    );
}