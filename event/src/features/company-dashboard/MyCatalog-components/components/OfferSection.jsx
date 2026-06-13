import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * OfferSection
 *
 * A generic section wrapper used across the MyCatalog page.
 * Renders the gold left-border title + optional header actions,
 * then renders children below.
 *
 * Props:
 * title        – section heading string
 * subtitle     – optional muted subtitle
 * headerRight  – optional React node rendered to the right of the title
 * children     – section body content
 * sx           – extra MUI sx overrides on the wrapper
 */
export default function OfferSection({ title, subtitle, headerRight, children, sx = {} }) {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 5, ...sx }}>
            {/* Section header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "stretch", gap: 1.5 }}>
                    {/* Gold accent bar */}
                    <Box
                        sx={{
                            width: 4,
                            borderRadius: 2,
                            bgcolor: theme.palette.primary.main,
                            flexShrink: 0,
                            alignSelf: "stretch",
                        }}
                    />
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 700,
                                fontSize: "1.15rem",
                                lineHeight: 1.2,
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.78rem", mt: 0.3 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Optional right-side controls (e.g. Published/Saved toggle) */}
                {headerRight && <Box sx={{ flexShrink: 0 }}>{headerRight}</Box>}
            </Box>

            {/* Section body */}
            <Stack spacing={2}>{children}</Stack>
        </Box>
    );
}