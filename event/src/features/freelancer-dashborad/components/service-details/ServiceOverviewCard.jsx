import React, { useState } from "react";
import { Sparkles, MapPin } from "lucide-react";
import ServiceGallery from "./ServiceGallery";
import GalleryLightbox from "./GalleryLightbox";

export default function ServiceOverviewCard({
  title,
  description,
  images = [],
  category,
  location,
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-bg-paper p-6 lg:grid-cols-2">
      {/* النص */}
      <div className="flex flex-col justify-center">
        <h2 className="mb-3 text-3xl font-bold text-primary">{title}</h2>
        <p className="mb-5 text-sm leading-relaxed text-text-secondary">{description}</p>

        <div className="flex flex-wrap gap-3">
          {category && (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-default px-3 py-1.5 text-xs text-text-secondary">
              <Sparkles size={14} className="text-primary" />
              {category}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-default px-3 py-1.5 text-xs text-text-secondary">
              <MapPin size={14} className="text-primary" />
              {location}
            </span>
          )}
        </div>
      </div>

      {/* الصور */}
      <ServiceGallery images={images} alt={title} onOpenLightbox={setLightboxIndex} />

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </div>
  );
}
