import React from "react";
import { Box } from "@mui/material";
import ServiceVariantsCard from "./ServiceVariantsCard";
import AvailableDatesCard from "./AvailableDatesCard";

export default function ServiceBottomSection({ variants, dates, materialComposition, calendarProps }) {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
            <ServiceVariantsCard variants={variants} materialComposition={materialComposition} />
            <AvailableDatesCard dates={dates} {...calendarProps} />
        </Box>
    );
}