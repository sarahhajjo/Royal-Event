import React from 'react';
import { Box, Typography } from '@mui/material';

export default function BookingServiceCard({ listing, variant, price, currency, image }) {
    return (
        <Box
            sx={{
                gridColumn: { md: 'span 2' }, // ~ col-span-2 على الشاشات المتوسطة فأكبر
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: '#1a1714',
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
            }}
        >
            {/* صورة الخدمة */}
            <Box
                sx={{
                    width: { xs: '100%', md: '41.666%' }, // ~ md:w-5/12
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

            {/* تفاصيل الخدمة والسعر */}
            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                            color: (theme) => theme.palette.primary.main,
                            fontWeight: 600
                        }}
                    >
                        Service
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: (theme) => theme.palette.text.primary, mt: 0.5 }}>
                        {listing?.title || "خدمة بدون عنوان"}
                    </Typography>
                    <Typography sx={{ color: (theme) => theme.palette.text.secondary, mt: 0.5 }}>
                        {variant?.name || "الباقة الأساسية"}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>
                            Total Price
                        </Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: (theme) => theme.palette.primary.main, mt: 0.3 }}>
                            {price ? `${parseFloat(price).toLocaleString()} ${currency || 'SYP'}` : "0"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}