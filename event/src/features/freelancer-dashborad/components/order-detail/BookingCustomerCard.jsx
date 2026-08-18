import React from 'react';
import { Box, Typography } from '@mui/material';

// أيقونة مستخدم كـ SVG مباشر (بدون الاعتماد على @mui/icons-material)
const UserIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default function BookingCustomerCard({ customer }) {
    return (
        <Box
            sx={{
                gridColumn: '1 / -1', // ~ col-span-full
                bgcolor: '#1a1714',
                borderRadius: '16px',
                border: (theme) => `1px dashed ${theme.palette.divider}`,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: (theme) => theme.palette.background.default,
                        color: (theme) => theme.palette.text.secondary,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <UserIcon width={24} height={24} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: (theme) => theme.palette.text.primary }}>
                        Customer Details
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: (theme) => theme.palette.text.secondary }}>
                        {customer ? `${customer.name} (${customer.phone || 'No phone'})` : "Guest Account (Pending Information)"}
                    </Typography>
                </Box>
            </Box>

            <Typography sx={{ fontSize: '0.72rem', color: (theme) => theme.palette.text.secondary, maxWidth: 380, textAlign: 'right' }}>
                {customer ? "Verified client account details." : "This booking is not linked to a fully registered user account. Details are restricted."}
            </Typography>
        </Box>
    );
}