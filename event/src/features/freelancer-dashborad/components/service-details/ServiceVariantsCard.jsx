import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ServiceVariantItem from "./ServiceVariantItem";

export default function ServiceVariantsCard({ variants = [], materialComposition }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }}>
                Service Variants
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {variants.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: theme.palette.divider }}>
                        <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                            No variants added yet
                        </Typography>
                    </Box>
                ) : (
                    variants.map((variant) => (
                        <ServiceVariantItem
                            key={variant.id}
                            {...variant}
                            materialComposition={materialComposition}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}