import React, { useEffect, useCallback } from "react";
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

  // التحكم بلوحة المفاتيح: Escape للإغلاق، الأسهم للتنقل
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
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* الشريط العلوي */}
      <div
        className="flex items-center justify-between px-6 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-white/70">
          {activeIndex + 1} / {images.length}
        </span>
        <button
          aria-label="إغلاق"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* الصورة الرئيسية + أسهم التنقل */}
      <div
        className="relative flex flex-1 items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            aria-label="الصورة السابقة"
            onClick={goPrev}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <img
          src={images[activeIndex]}
          alt={`صورة ${activeIndex + 1}`}
          className="max-h-[75vh] max-w-full rounded-lg object-contain"
        />

        {images.length > 1 && (
          <button
            aria-label="الصورة التالية"
            onClick={goNext}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* شريط المصغرات */}
      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-6 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => onChangeIndex(i)}
              className={`h-14 w-20 flex-none overflow-hidden rounded-lg border-2 transition ${
                i === activeIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
