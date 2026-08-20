import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function InfoCard({ icon: Icon, title, children }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                bgcolor: isDark ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', fontSize: '0.9rem', fontWeight: 700 }}>
                {Icon && <Icon size={18} />}
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'primary.main', fontFamily: "'Cinzel', serif" }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {children}
            </Box>
        </Box>
    );
}