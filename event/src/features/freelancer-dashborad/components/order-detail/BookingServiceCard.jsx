import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function BookingServiceCard({ listing, variant, price, currency, image }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                gridColumn: { md: 'span 2' },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: isDark ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', md: '41.666%' },
                    height: { xs: 256, md: 'auto' },
                    position: 'relative'
                }}
            >
                <Box
                    component="img"
                    src={image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed"}
                    alt="Service"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            </Box>

            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    >
                        Service
                    </Typography>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: theme.palette.text.primary, mt: 0.5 }}>
                        {listing?.title || "خدمة بدون عنوان"}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5, fontSize: '0.85rem' }}>
                        {variant?.name || "الباقة الأساسية"}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: 3,
                        pt: 2.5,
                        borderTop: '1px solid',
                        borderColor: theme.palette.divider,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                            Total Price
                        </Typography>
                        <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: 'primary.main', mt: 0.2 }}>
                            {price ? `${parseFloat(price).toLocaleString()} ${currency || 'SYP'}` : "0"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}