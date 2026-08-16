import React from "react";
import ServiceVariantsCard from "./ServiceVariantsCard";
import AvailableDatesCard from "./AvailableDatesCard";

export default function ServiceBottomSection({ variants, dates, materialComposition, calendarProps }) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ServiceVariantsCard variants={variants} materialComposition={materialComposition} />
            <AvailableDatesCard dates={dates} {...calendarProps} />
        </div>
    );
}