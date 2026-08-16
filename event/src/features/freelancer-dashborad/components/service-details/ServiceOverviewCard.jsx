import React, { useState } from "react";
import { Sparkles, MapPin } from "lucide-react";
import ServiceGallery from "./ServiceGallery";
import GalleryLightbox from "./GalleryLightbox";

// 🔥 دالة ذكية لاستخراج النص من الـ Object لتفادي خطأ الشاشة البيضاء
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
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-bg-paper p-6 lg:grid-cols-2">
        {/* النص */}
        <div className="flex flex-col justify-center">
          {/* استخدمنا الدالة هنا لضمان قراءة النص بشكل صحيح */}
          <h2 className="mb-3 text-3xl font-bold text-primary">{getLocalizedText(title)}</h2>
          <p className="mb-5 text-sm leading-relaxed text-text-secondary">{getLocalizedText(description)}</p>

          <div className="flex flex-wrap gap-3">
            {category && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-default px-3 py-1.5 text-xs text-text-secondary">
              <Sparkles size={14} className="text-primary" />
                  {/* واستخدمناها هنا أيضاً */}
                  {getLocalizedText(category)}
            </span>
            )}
            {location && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-default px-3 py-1.5 text-xs text-text-secondary">
              <MapPin size={14} className="text-primary" />
                  {getLocalizedText(location)}
            </span>
            )}
          </div>
        </div>

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
      </div>
  );
}