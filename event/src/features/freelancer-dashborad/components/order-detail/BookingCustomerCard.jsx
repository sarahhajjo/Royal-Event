import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const UserIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default function BookingCustomerCard({ customer }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                gridColumn: '1 / -1',
                bgcolor: isDark ? 'rgba(15, 15, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: theme.palette.divider,
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
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <UserIcon width={22} height={22} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
                        Customer Details
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                        {customer ? `${customer.name} (${customer.phone || 'No phone'})` : "Guest Account (Pending Information)"}
                    </Typography>
                </Box>
            </Box>

            <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary, maxWidth: 380, textAlign: 'right' }}>
                {customer ? "Verified client account details." : "This booking is not linked to a fully registered user account. Details are restricted."}
            </Typography>
        </Box>
    );
}