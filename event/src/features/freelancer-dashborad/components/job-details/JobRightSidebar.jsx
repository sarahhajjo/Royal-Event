import React from "react";
import { Mail, ArrowRight, Package } from "lucide-react";

export default function JobRightSidebar({ salary, paymentSystem, contactEmail, equipmentProvided }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Financial & Perks Card */}
            <div className="rounded-2xl border border-border bg-bg-paper p-6 md:p-8 shadow-xl">
                <h3 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
                    Financial & Perks
                </h3>

                <div className="mb-6">
                    <p className="text-sm text-text-secondary">Proposed Salary</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-serif text-4xl font-bold text-primary">{salary}</span>
                        {/* تم تثبيت عملة SAR هنا، ويتم جلب نظام الدفع ديناميكياً */}
                        <span className="text-xs text-text-secondary">SAR {paymentSystem}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {/* هذا العنصر سيظهر فقط إذا كان الباك إند يرسل قيمة 1 أو true */}
                    {equipmentProvided && (
                        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-bg-default p-4 transition-colors hover:border-primary/30">
                            <Package size={18} className="text-primary" />
                            <span className="text-sm font-medium text-text-primary">Company Equipment Provided</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Inquiries Card */}
            <div className="rounded-2xl border border-border bg-bg-paper p-6 md:p-8 shadow-xl">
                <h3 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
                    Inquiries
                </h3>

                <a
                    href={`mailto:${contactEmail}`}
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-bg-default p-4 transition hover:border-primary/50"
                >
                    <div className="flex flex-col gap-1.5">
                        <Mail size={20} className="text-primary" />
                        <p className="mt-1 text-xs text-text-secondary">Contact HR</p>
                        <p className="text-sm font-semibold text-text-primary">{contactEmail}</p>
                    </div>
                    <ArrowRight
                        size={20}
                        className="text-text-secondary transition group-hover:translate-x-1 group-hover:text-primary"
                    />
                </a>
            </div>
        </div>
    );
}