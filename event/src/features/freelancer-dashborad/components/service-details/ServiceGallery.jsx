import React, { useState, useRef } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Maximize2 } from "lucide-react";

export default function ServiceGallery({ images = [], alt = "", onOpenLightbox }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  if (!images.length) return null;

  const handleMouseMove = (e) => {
    if (images.length <= 1) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - left;
    const segmentWidth = width / images.length;
    const index = Math.min(
        images.length - 1,
        Math.max(0, Math.floor(relativeX / segmentWidth))
    );
    setActiveIndex(index);
  };

  return (
      <Box
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setActiveIndex(0)}
          onClick={() => onOpenLightbox?.(activeIndex)}
          sx={{
            position: 'relative',
            height: { xs: 224, lg: '100%' },
            width: '100%',
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: theme.palette.divider,
          }}
      >
        <Box
            component="img"
            src={images[activeIndex]}
            alt={`${alt} ${activeIndex + 1}`}
            sx={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'opacity 0.15s ease' }}
        />

        {/* شريط تقدّم الصور */}
        {images.length > 1 && (
            <Box sx={{ position: 'absolute', insetX: 8, top: 8, display: 'flex', gap: 1 }}>
              {images.map((_, i) => (
                  <Box
                      key={i}
                      sx={{
                        height: 4,
                        flex: 1,
                        borderRadius: '999px',
                        bgcolor: i === activeIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'background-color 0.2s'
                      }}
                  />
              ))}
            </Box>
        )}

        {/* عداد الصور */}
        {images.length > 1 && (
            <Typography
                component="span"
                sx={{ position: 'absolute', bottom: 12, left: 12, borderRadius: '8px', bgcolor: 'rgba(0, 0, 0, 0.6)', px: 1.5, py: 0.5, fontSize: '0.7rem', fontWeight: 600, color: '#fff', backdropFilter: 'blur(4px)' }}
            >
              {activeIndex + 1} / {images.length}
            </Typography>
        )}

        <IconButton
            aria-label="عرض كل الصور"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox?.(activeIndex);
            }}
            sx={{
              position: 'absolute', bottom: 12, right: 12, width: 32, height: 32, borderRadius: '8px',
              bgcolor: 'rgba(0, 0, 0, 0.6)', color: '#fff', backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
            }}
        >
          <Maximize2 size={14} />
        </IconButton>
      </Box>
  );
}