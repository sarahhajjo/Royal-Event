import React, { useState } from 'react';
import { Box, Typography, Divider, Paper, Avatar, Chip, Collapse } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import KeyboardArrowDownIcon  from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon    from '@mui/icons-material/KeyboardArrowUp';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ── Staff Card (البطاقة الجديدة) ──────────────────────────────────────────────────
const StaffCard = ({ name, role, phone, isSelected, isAvailable, availableDates }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            width: 250,
            bgcolor: theme.palette.background.paper,
            border: isSelected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
            borderRadius: 2,
            p: 1.5,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            boxShadow: theme.shadows[2],
            opacity: isAvailable ? 1 : 0.6,
            transition: 'all 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    src="https://via.placeholder.com/48"
                    alt={name}
                    sx={{ width: 48, height: 48, border: `1.5px solid ${isDark ? '#333' : '#ddd'}`, backgroundColor: isDark ? '#2e2318' : '#e8dcc0', color: theme.palette.primary.main, fontSize: '1rem', fontWeight: 700 }}
                >
                    {name?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ color: theme.palette.text.primary, fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>
                        {name}
                    </Typography>
                    <Typography noWrap sx={{ color: theme.palette.primary.main, fontSize: '0.75rem' }}>
                        {role}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: theme.palette.text.secondary, mt: 0.5 }}>
                {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography noWrap sx={{ fontSize: '0.8rem' }}>{phone}</Typography>
                    </Box>
                )}
                {availableDates && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1.1rem', mt: 0.2 }} />
                        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                            {availableDates}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: isAvailable ? '#2e7d32' : '#d32f2f' }} />
                <Typography sx={{ color: isAvailable ? '#2e7d32' : '#d32f2f', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
                </Typography>
            </Box>
        </Box>
    );
};

// ── Service accordion row ─────────────────────────────────────────────────────
function ServiceRow({ serviceName, providers, open, onToggle }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    return (
        <Box sx={{ border: `1px solid ${border}`, borderRadius: 2, overflow: 'hidden' }}>
            <Box
                onClick={onToggle}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: { xs: 1.5, sm: 2 }, cursor: 'pointer',
                    backgroundColor: open ? (isDark ? 'rgba(197,160,89,0.06)' : 'rgba(197,160,89,0.05)') : 'transparent',
                    transition: 'background 0.15s',
                    '&:hover': { backgroundColor: isDark ? 'rgba(197,160,89,0.05)' : 'rgba(197,160,89,0.04)' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.palette.text.primary }}>
                        {serviceName}
                    </Typography>
                    <Chip
                        label={`${providers.length} provider${providers.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, backgroundColor: isDark ? '#2e2318' : '#e8dcc0', color: theme.palette.text.secondary, border: `1px solid ${border}` }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {open ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />}
                </Box>
            </Box>

            {/* عرض البطاقات بشكل أفقي (Grid) */}
            <Collapse in={open}>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Divider sx={{ mb: 2, borderColor: border }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {providers.map((p) => (
                            <StaffCard
                                key={p.id}
                                name={p.name}
                                role={p.role}
                                phone={p.phone}
                                availableDates={p.availableDates}
                                isSelected={false}
                                isAvailable={p.status === 'available'}
                            />
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

    const groupedServices = {};
    if (Array.isArray(services)) {
        services.forEach(item => {
            const roleName = item.role || 'General Services';
            if (!groupedServices[roleName]) {
                groupedServices[roleName] = [];
            }
            groupedServices[roleName].push(item);
        });
    }

    const serviceKeys = Object.keys(groupedServices);

    return (
        <Paper elevation={0} sx={{
            backgroundColor: theme.palette.background.paper, border: `1px solid ${border}`,
            borderRadius: 2, p: { xs: 2.5, sm: 3 }, mb: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 17, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                    Available Staff & Services
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: border }} />

            {serviceKeys.length === 0 ? (
                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, textAlign: 'center', py: 3 }}>
                    No services or staff linked to this arrangement.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {serviceKeys.map((serviceName, i) => (
                        <ServiceRow
                            key={serviceName}
                            serviceName={serviceName}
                            providers={groupedServices[serviceName]}
                            open={openIdx === i}
                            onToggle={() => toggle(i)}
                        />
                    ))}
                </Box>
            )}
        </Paper>
    );
}