import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const TABS = [
    { key: "active",    label: "Active" },    // الحالة: approved
    { key: "pending",   label: "Pending" },   // الحالة: pending_approval
    { key: "draft",     label: "Draft" },     // الحالة: draft
    { key: "cancelled", label: "Cancelled" }, // الحالة: cancelled
    { key: "rejected",  label: "Rejected" },  // الحالة: rejected
];

export default function OfferTabs({ activeTab, onChange, counts = {} }) {
    return (
        <Box sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, px: 0.5, mb: 4 }}>
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
                        label={`${tab.label} (${counts[tab.key] || 0})`}
                        sx={{
                            textTransform: 'none',
                            minHeight: 'auto',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            pb: 2,
                            mr: 2,
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