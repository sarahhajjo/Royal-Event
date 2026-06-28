import React, { useState } from 'react';
import {
    Box, Typography, Divider, Paper, Avatar,
    Chip, Collapse,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import KeyboardArrowDownIcon  from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon    from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// ── Provider card ─────────────────────────────────────────────────────────────
function ProviderCard({ provider }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    return (
        <Box sx={{
            display:         'flex',
            alignItems:      'center',
            gap:             1.5,
            p:               1.5,
            border:          `1px solid ${border}`,
            borderRadius:    1.5,
            transition:      'background 0.15s',
            '&:hover':       { backgroundColor: isDark ? 'rgba(197,160,89,0.04)' : 'rgba(197,160,89,0.05)' },
        }}>
            <Avatar
                src={provider.avatar}
                sx={{
                    width:           38,
                    height:          38,
                    flexShrink:      0,
                    backgroundColor: isDark ? '#2e2318' : '#e8dcc0',
                    color:           theme.palette.primary.main,
                    fontSize:        '0.82rem',
                    fontWeight:      700,
                    border:          `1px solid ${border}`,
                }}
            >
                {provider.name?.charAt(0)}
            </Avatar>

            {/* Name + Title */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.84rem', fontWeight: 600, color: theme.palette.text.primary }}>
                    {provider.name}
                </Typography>
                <Typography noWrap sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary }}>
                    {provider.title}
                </Typography>
            </Box>

            {/* Rating */}
            {provider.rating != null && (
                <Typography sx={{ fontSize: '0.74rem', color: theme.palette.primary.main, fontWeight: 700, flexShrink: 0 }}>
                    ★ {provider.rating}
                </Typography>
            )}

            {/* Available badge */}
            <Chip
                icon={
                    provider.available
                        ? <CheckCircleOutlinedIcon sx={{ fontSize: '0.82rem !important' }} />
                        : <RadioButtonUncheckedIcon sx={{ fontSize: '0.82rem !important' }} />
                }
                label={provider.available ? 'Available' : 'Busy'}
                size="small"
                sx={{
                    height:          22,
                    fontSize:        '0.6rem',
                    fontWeight:      600,
                    flexShrink:      0,
                    backgroundColor: provider.available
                        ? (isDark ? 'rgba(95,160,107,0.12)' : 'rgba(95,160,107,0.08)')
                        : (isDark ? 'rgba(176,80,80,0.12)'  : 'rgba(176,80,80,0.08)'),
                    color:           provider.available ? '#5fa06b' : '#b05050',
                    border:          `1px solid ${provider.available ? 'rgba(95,160,107,0.3)' : 'rgba(176,80,80,0.3)'}`,
                }}
            />
        </Box>
    );
}

// ── Service accordion row ─────────────────────────────────────────────────────
function ServiceRow({ service, open, onToggle }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    return (
        <Box sx={{ border: `1px solid ${border}`, borderRadius: 2, overflow: 'hidden' }}>

            {/* Header */}
            <Box
                onClick={onToggle}
                sx={{
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'space-between',
                    p:               { xs: 1.5, sm: 2 },
                    cursor:          'pointer',
                    backgroundColor: open
                        ? (isDark ? 'rgba(197,160,89,0.06)' : 'rgba(197,160,89,0.05)')
                        : 'transparent',
                    transition:      'background 0.15s',
                    '&:hover':       { backgroundColor: isDark ? 'rgba(197,160,89,0.05)' : 'rgba(197,160,89,0.04)' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.palette.text.primary }}>
                        {service.name}
                    </Typography>
                    <Chip
                        label={`${service.providers.length} provider${service.providers.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                            height:          20,
                            fontSize:        '0.6rem',
                            fontWeight:      600,
                            backgroundColor: isDark ? '#2e2318' : '#e8dcc0',
                            color:           theme.palette.text.secondary,
                            border:          `1px solid ${border}`,
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {service.priceRange && (
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: theme.palette.primary.main }}>
                            {service.priceRange}
                        </Typography>
                    )}
                    {open
                        ? <KeyboardArrowUpIcon   sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                        : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                    }
                </Box>
            </Box>

            {/* Providers */}
            <Collapse in={open}>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Divider sx={{ mb: 2, borderColor: border }} />
                    {service.description && (
                        <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, lineHeight: 1.65, mb: 2 }}>
                            {service.description}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {service.providers.map((p) => (
                            <ProviderCard key={p.id} provider={p} />
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ServicesProviders({ services = [] }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const [openIdx, setOpenIdx] = useState(0);
    const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

    return (
        <Paper elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border:          `1px solid ${border}`,
            borderRadius:    2,
            p:               { xs: 2.5, sm: 3 },
            mb:              2,
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 17, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                    Available Services
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: border }} />

            {services.length === 0 ? (
                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, textAlign: 'center', py: 3 }}>
                    No services linked to this arrangement.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {services.map((svc, i) => (
                        <ServiceRow
                            key={svc.id}
                            service={svc}
                            open={openIdx === i}
                            onToggle={() => toggle(i)}
                        />
                    ))}
                </Box>
            )}
        </Paper>
    );
}