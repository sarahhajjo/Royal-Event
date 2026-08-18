import React, { useEffect, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryLightbox({
                                          images = [],
                                          activeIndex = 0,
                                          onClose,
                                          onChangeIndex,
                                        }) {
  const goNext = useCallback(
      () => onChangeIndex((activeIndex + 1) % images.length),
      [activeIndex, images.length, onChangeIndex]
  );
  const goPrev = useCallback(
      () => onChangeIndex((activeIndex - 1 + images.length) % images.length),
      [activeIndex, images.length, onChangeIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  if (!images.length) return null;

  return (
      <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
      >
        {/* الشريط العلوي */}
        <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, py: 3 }}
            onClick={(e) => e.stopPropagation()}
        >
          <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: "'Raleway', sans-serif" }}>
            {activeIndex + 1} / {images.length}
          </Typography>
          <IconButton
              aria-label="إغلاق"
              onClick={onClose}
              sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <X size={22} />
          </IconButton>
        </Box>

        {/* الصورة الرئيسية + أسهم التنقل */}
        <Box
            sx={{ position: 'relative', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', px: 4 }}
            onClick={(e) => e.stopPropagation()}
        >
          {images.length > 1 && (
              <IconButton
                  aria-label="الصورة السابقة"
                  onClick={goPrev}
                  sx={{ position: 'absolute', left: 24, color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
              >
                <ChevronLeft size={22} />
              </IconButton>
          )}

          <Box
              component="img"
              src={images[activeIndex]}
              alt={`صورة ${activeIndex + 1}`}
              sx={{ maxHeight: '75vh', maxWidth: '100%', borderRadius: '12px', objectFit: 'contain' }}
          />

          {images.length > 1 && (
              <IconButton
                  aria-label="الصورة التالية"
                  onClick={goNext}
                  sx={{ position: 'absolute', right: 24, color: '#fff', bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
              >
                <ChevronRight size={22} />
              </IconButton>
          )}
        </Box>

        {/* شريط المصغرات */}
        {images.length > 1 && (
            <Box
                sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, overflowX: 'auto', px: 4, py: 3 }}
                onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                  <Box
                      component="button"
                      key={i}
                      onClick={() => onChangeIndex(i)}
                      sx={{
                        height: 56,
                        width: 80,
                        flex: 'none',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: i === activeIndex ? 'primary.main' : 'transparent',
                        opacity: i === activeIndex ? 1 : 0.6,
                        cursor: 'pointer',
                        bgcolor: 'transparent',
                        p: 0,
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 1 }
                      }}
                  >
                    <Box component="img" src={src} alt="" sx={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }} />
                  </Box>
              ))}
            </Box>
        )}
      </Box>
  );
}