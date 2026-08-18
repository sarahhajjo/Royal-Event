import React from 'react';
import { Chip } from '@mui/material';

const STATUS_STYLES = {
    active: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
    "under review": { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
    rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
    withdrawn: { bg: 'rgba(107, 114, 128, 0.1)', color: '#9ca3af', border: 'rgba(107, 114, 128, 0.2)' },
};

export default function OfferStatusBadge({ status }) {
    const s = status.toLowerCase();
    const style = STATUS_STYLES[s] || STATUS_STYLES.withdrawn;

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                borderRadius: '999px',
                textTransform: 'uppercase',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: 0.8,
                height: 22,
                px: 0.5,
                bgcolor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`
            }}
        />
    );
}