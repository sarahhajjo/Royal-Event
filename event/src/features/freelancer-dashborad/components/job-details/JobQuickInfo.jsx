import React from "react";
import { Calendar, Clock, Briefcase, FileText } from "lucide-react";

// 👑 دالة صغيرة لحساب ما إذا كان الموعد النهائي قريباً (3 أيام أو أقل)
const checkIsUrgent = (deadlineDate) => {
    if (!deadlineDate) return false;
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // إذا كان باقي 3 أيام أو أقل (وأكبر من 0 حتى لا يكون منتهياً)
    return diffDays > 0 && diffDays <= 3;
};

export default function JobQuickInfo({ startDate, deadline, experience, employmentType }) {
    const isUrgent = checkIsUrgent(deadline);

    const infoCards = [
        { label: "Start Date", value: startDate, icon: <Calendar size={18} /> },
        { label: "Deadline", value: deadline, icon: <Clock size={18} />, highlight: isUrgent }, // 👈 ربطناها بالدالة الذكية
        { label: "Experience Level", value: experience, icon: <Briefcase size={18} /> },
        { label: "Employment Type", value: employmentType, icon: <FileText size={18} /> },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infoCards.map((card, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-xl border border-border bg-bg-paper p-5 shadow-sm transition hover:border-primary/30">
                    <div className="flex items-center justify-between text-text-secondary">
                        {card.icon}

                        {/* الشارة تظهر فقط إذا كانت highlight تساوي true */}
                        {card.highlight && (
                            <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-500">
                                URGENT
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary">{card.label}</p>
                        <p className="mt-1 text-sm font-semibold text-text-primary">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}