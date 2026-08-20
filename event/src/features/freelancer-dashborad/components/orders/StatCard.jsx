import React from 'react';
import { Box, Typography } from '@mui/material';

export default function StatCard({ label, value, valueSx = {} }) {
    return (
        <Box
            sx={{
                borderRadius: '12px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) => theme.palette.background.paper,
                p: 2,
                textAlign: 'left'
            }}
        >
            <Typography sx={{ fontSize: '0.75rem', color: (theme) => theme.palette.text.secondary }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    mt: 1,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: (theme) => theme.palette.text.primary,
                    ...valueSx
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}