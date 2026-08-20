import React, { useState } from 'react';
import { Box, Typography, Divider, Paper, Avatar, Chip, Collapse } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import KeyboardArrowDownIcon  from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon    from '@mui/icons-material/KeyboardArrowUp';
import PhoneIcon from '@mui/icons-material/Phone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// 💡 استيراد الألوان الموحدة
import { GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG } from'../../../../../utils/colorConstants';

const StaffCard = ({ name, role, phone, isSelected, isAvailable, availableDates }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            width: 250,
            bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            border: isSelected ? `2px solid ${GOLD}` : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER}`,
            borderRadius: 2, p: 1.5, position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.5,
            backdropFilter: 'blur(4px)',
            opacity: isAvailable ? 1 : 0.6,
            transition: 'all 0.3s ease',
            '&:hover': { borderColor: GOLD }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                    src="https://via.placeholder.com/48" alt={name}
                    sx={{ width: 48, height: 48, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.2)}`, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : alpha(BROWN_TEXT, 0.05), color: isDark ? GOLD : BROWN_TEXT, fontSize: '1rem', fontWeight: 700 }}
                >
                    {name?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ color: isDark ? '#ffffff' : '#1A120D', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                        {name}
                    </Typography>
                    <Typography noWrap sx={{ color: GOLD, fontSize: '0.75rem', fontWeight: 600 }}>
                        {role}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mt: 0.5 }}>
                {phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: '1.1rem' }} />
                        <Typography noWrap sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{phone}</Typography>
                    </Box>
                )}
                {availableDates && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1.1rem', mt: 0.2 }} />
                        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.02em', lineHeight: 1.4, fontWeight: 500 }}>
                            {availableDates}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                <FiberManualRecordIcon sx={{ fontSize: '0.7rem', color: isAvailable ? '#2e7d32' : '#d32f2f' }} />
                <Typography sx={{ color: isAvailable ? '#2e7d32' : '#d32f2f', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
                </Typography>
            </Box>
        </Box>
    );
};

function ServiceRow({ serviceName, providers, open, onToggle }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    return (
        <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <Box
                onClick={onToggle}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: { xs: 1.5, sm: 2 }, cursor: 'pointer',
                    backgroundColor: open ? (isDark ? 'rgba(255,255,255,0.03)' : alpha(BROWN_TEXT, 0.04)) : 'transparent',
                    transition: 'background 0.15s',
                    '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : alpha(BROWN_TEXT, 0.06) },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: isDark ? '#ffffff' : '#1A120D' }}>
                        {serviceName}
                    </Typography>
                    <Chip
                        label={`${providers.length} provider${providers.length !== 1 ? 's' : ''}`} size="small"
                        sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.06), color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, border: `1px solid ${borderColor}` }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {open ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT }} />}
                </Box>
            </Box>

            <Collapse in={open}>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Divider sx={{ mb: 2, borderColor }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {providers.map((p) => (
                            <StaffCard key={p.id} name={p.name} role={p.role} phone={p.phone} availableDates={p.availableDates} isSelected={false} isAvailable={p.status === 'available'} />
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}

export default function ServicesProviders({ services = [] }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [openIdx, setOpenIdx] = useState(0);
    const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

    const groupedServices = {};
    if (Array.isArray(services)) {
        services.forEach(item => {
            const roleName = item.role || 'General Services';
            if (!groupedServices[roleName]) { groupedServices[roleName] = []; }
            groupedServices[roleName].push(item);
        });
    }

    const serviceKeys = Object.keys(groupedServices);

    return (
        <Paper elevation={0} sx={{
            bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(12px)',
            borderRadius: 3, p: { xs: 2.5, sm: 3 }, mb: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                    Available Staff & Services
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER }} />

            {serviceKeys.length === 0 ? (
                <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textAlign: 'center', py: 3, fontWeight: 500 }}>
                    No services or staff linked to this arrangement.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {serviceKeys.map((serviceName, i) => (
                        <ServiceRow key={serviceName} serviceName={serviceName} providers={groupedServices[serviceName]} open={openIdx === i} onToggle={() => toggle(i)} />
                    ))}
                </Box>
            )}
        </Paper>
    );
}