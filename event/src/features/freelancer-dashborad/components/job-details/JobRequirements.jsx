import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { FileCheck, CheckCircle2 } from "lucide-react";

export default function JobRequirements({ description }) {
    const theme = useTheme();
    const points = description ? description.split('. ').filter(p => p.length > 0) : [];

    return (
        <Box sx={{
            borderRadius: '16px',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.35)',
            p: { xs: 3, md: 4 }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <FileCheck color={theme.palette.primary.main} size={24} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', fontWeight: 700, color: theme.palette.text.primary }}>
                    Requirements & Scope
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {points.length > 0 ? (
                    points.map((point, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <CheckCircle2 color={theme.palette.primary.main} size={18} style={{ marginTop: '3px', flexShrink: 0 }} />
                            <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.6, color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                                {point}.
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                        No specific requirements provided.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}