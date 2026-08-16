import React from "react";

/**
 * شارة صغيرة تعرض حالة الخدمة (مثال: PENDING APPROVAL)
 * قابلة لإعادة الاستخدام مع أي حالة ولون.
 */
const STATUS_STYLES = {
  pending: "bg-primary/10 text-primary border-primary/30",
  approved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
  rejected: "bg-red-400/10 text-red-400 border-red-400/30",
};

export default function StatusPill({ label = "Pending Approval", variant = "pending" }) {
  const styles = STATUS_STYLES[variant] ?? STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles}`}
    >
      {label}
    </span>
  );
}
