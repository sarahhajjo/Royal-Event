import React from "react";
import { FileCheck, CheckCircle2 } from "lucide-react";

export default function JobRequirements({ description }) {
    // محاكاة تحويل النص إلى نقاط (يمكنك تعديلها حسب الباك إند لاحقاً)
    const points = description ? description.split('. ').filter(p => p.length > 0) : [];

    return (
        <div className="rounded-2xl border border-border bg-bg-paper p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <FileCheck className="text-primary" size={24} />
                <h2 className="font-serif text-xl font-bold text-text-primary">Requirements & Scope</h2>
            </div>

            <div className="flex flex-col gap-4">
                {points.length > 0 ? (
                    points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 flex-shrink-0 text-primary" size={18} />
                            <p className="text-sm leading-relaxed text-text-secondary">{point}.</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-text-secondary">No specific requirements provided.</p>
                )}
            </div>
        </div>
    );
}