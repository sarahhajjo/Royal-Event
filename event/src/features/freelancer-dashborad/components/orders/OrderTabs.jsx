import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

const TABS = [
    { key: "active", label: "Active requests" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "rejected", label: "Rejected" },
];

export default function OrderTabs({ activeTab, onChange, counts = {} }) {
    return (
        <Box sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, px: 0.5 }}>
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => onChange(newValue)}
                TabIndicatorProps={{
                    sx: { bgcolor: (theme) => theme.palette.primary.main, height: 2, borderRadius: '999px' }
                }}
                sx={{ minHeight: 'auto' }}
            >
                {TABS.map((tab) => (
                    <Tab
                        key={tab.key}
                        value={tab.key}
                        disableRipple
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                                <Typography component="span" sx={{ fontSize: '0.85rem' }}>
                                    {tab.label}
                                </Typography>
                                {typeof counts[tab.key] === 'number' && (
                                    <Typography
                                        component="span"
                                        sx={{ fontSize: '0.8rem', color: (theme) => theme.palette.text.secondary }}
                                    >
                                        ({counts[tab.key]})
                                    </Typography>
                                )}
                            </Box>
                        }
                        sx={{
                            textTransform: 'none',
                            minHeight: 'auto',
                            pb: 1.5,
                            color: (theme) => theme.palette.text.secondary,
                            '&:hover': { color: (theme) => theme.palette.text.primary },
                            '&.Mui-selected': { color: (theme) => theme.palette.primary.main }
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}