import React from 'react';
import { Chip } from '@mui/material';

// خرائط الألوان لكل حالة — مأخوذة من نفس المنطق الأصلي
const STATUS_STYLES = {
    pending: {
        bgcolor: (theme) => `${theme.palette.primary.main}26`, // ~ primary/15
        color: (theme) => theme.palette.primary.main,
        borderColor: (theme) => `${theme.palette.primary.main}4D`, // ~ primary/30
    },
    confirmed: {
        bgcolor: 'rgba(220, 252, 231, 1)',
        color: '#15803d',
        borderColor: 'rgba(187, 247, 208, 1)',
    },
    cancelled: {
        bgcolor: (theme) => theme.palette.action.hover,
        color: (theme) => theme.palette.text.secondary,
        borderColor: (theme) => theme.palette.divider,
    },
    rejected: {
        bgcolor: 'rgba(254, 226, 226, 1)',
        color: '#dc2626',
        borderColor: 'rgba(254, 202, 202, 1)',
    },
};

export default function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || {};

    return (
        <Chip
            label={status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
            size="small"
            sx={{
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 500,
                height: 24,
                bgcolor: style.bgcolor,
                color: style.color,
                border: (theme) => `1px solid ${
                    typeof style.borderColor === 'function' ? style.borderColor(theme) : style.borderColor
                }`
            }}
        />
    );
}