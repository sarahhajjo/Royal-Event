import React from "react";
import { Star, Wrench } from "lucide-react";

export default function ServiceVariantItem({
                                               label = "Main Option",
                                               name,
                                               description,
                                               amount,
                                               currency = "SAR",
                                               badge = "BASE PRICE",
                                               materialComposition, // نص الأدوات/المواد المطلوبة القادم من الباك، ممكن يكون فاضي أو null
                                           }) {
    const hasSpecificTools = Boolean(materialComposition?.trim());

    return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-bg-default p-4">
            <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Star size={16} />
        </span>
                <div>
                    <p className="text-sm font-semibold text-text-primary">
                        {label}: {name}
                    </p>
                    <p className="text-xs text-text-secondary">{description}</p>

                    {hasSpecificTools && (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
              <Wrench size={11} />
                            {materialComposition}
            </span>
                    )}
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm font-bold text-primary">
                    {amount?.toLocaleString()} <span className="text-xs text-text-secondary">{currency}</span>
                </p>
                <p className="text-[10px] uppercase tracking-wide text-text-secondary">{badge}</p>
            </div>
        </div>
    );
}