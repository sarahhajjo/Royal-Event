import React, { useState, useRef } from "react";
import { Maximize2 } from "lucide-react";

/**
 * معرض صور بأسلوب Airbnb: شريط تقدّم مقسّم حسب عدد الصور فوق الصورة،
 * تحريك الماوس يمين/يسار فوق الصورة ينقل المؤشر بين الصور،
 * والضغط في أي مكان يفتح Lightbox فيه كل الصور.
 */
export default function ServiceGallery({ images = [], alt = "", onOpenLightbox }) {
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveIndex(0)}
      onClick={() => onOpenLightbox?.(activeIndex)}
      className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-xl lg:h-full"
    >
      <img
        src={images[activeIndex]}
        alt={`${alt} ${activeIndex + 1}`}
        className="h-full w-full object-cover transition-opacity duration-150"
      />

      {/* شريط تقدّم الصور */}
      {images.length > 1 && (
        <div className="absolute inset-x-2 top-2 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i === activeIndex ? "bg-primary" : "bg-bg-default/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* عداد الصور */}
      {images.length > 1 && (
        <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
          {activeIndex + 1} / {images.length}
        </span>
      )}

      <button
        aria-label="عرض كل الصور"
        onClick={(e) => {
          e.stopPropagation();
          onOpenLightbox?.(activeIndex);
        }}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
}
