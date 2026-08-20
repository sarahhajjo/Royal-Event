import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Star, Wrench } from "lucide-react";

export default function ServiceVariantItem({
                                               label = "Main Option",
                                               name,
                                               description,
                                               amount,
                                               currency = "SAR",
                                               badge = "BASE PRICE",
                                               materialComposition,
                                           }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const hasSpecificTools = Boolean(materialComposition?.trim());

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                p: 2.5,
                gap: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                <Box
                    sx={{
                        mt: 0.5,
                        display: 'flex',
                        height: 32,
                        width: 32,
                        flex: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        bgcolor: 'rgba(212, 175, 55, 0.15)',
                        color: 'primary.main'
                    }}
                >
                    <Star size={16} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary, fontFamily: "'Raleway', sans-serif" }}>
                        {label}: {name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif", mt: 0.3 }}>
                        {description}
                    </Typography>

                    {hasSpecificTools && (
                        <Box
                            component="span"
                            sx={{
                                mt: 1.5,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                borderRadius: '6px',
                                bgcolor: 'rgba(212, 175, 55, 0.1)',
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                color: 'primary.main'
                            }}
                        >
                            <Wrench size={12} />
                            {materialComposition}
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'primary.main', fontFamily: "'Cinzel', serif" }}>
                    {amount?.toLocaleString()}{" "}
                    <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                        {currency}
                    </Typography>
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif", mt: 0.2 }}>
                    {badge}
                </Typography>
            </Box>
        </Box>
    );
}