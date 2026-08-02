import i18n from "./index";

/**
 * تختار من حقل ثنائي اللغة { en, ar } النص المطابق للغة التطبيق الحالية.
 * تُستخدم لأي بيانات قادمة من الـ API (title, description, اسم variant...).
 *
 * مثال: pickLocalized(service.title) -> "React" (لو اللغة en) أو "س" (لو اللغة ar)
 */
export function pickLocalized(field, fallback = "") {
  if (!field) return fallback;
  if (typeof field === "string") return field;

  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  return field[lang] || field.en || field.ar || fallback;
}
