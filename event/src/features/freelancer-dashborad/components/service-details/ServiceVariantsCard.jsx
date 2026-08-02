import React from "react";
import ServiceVariantItem from "./ServiceVariantItem";

export default function ServiceVariantsCard({ variants = [], materialComposition }) {
    return (
        <div className="rounded-2xl border border-border bg-bg-paper p-5">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Service Variants</h3>
            <div className="flex flex-col gap-3">
                {variants.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-secondary">
                        No variants added yet
                    </p>
                ) : (
                    variants.map((variant) => (
                        <ServiceVariantItem
                            key={variant.id}
                            {...variant}
                            materialComposition={materialComposition}
                        />
                    ))
                )}
            </div>
        </div>
    );
}