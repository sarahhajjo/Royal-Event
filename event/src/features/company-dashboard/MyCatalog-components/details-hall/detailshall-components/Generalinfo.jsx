import React from 'react';
import { Box, Typography, Divider, Paper, Avatar } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// 💡 استيراد ثوابت الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../../utils/colorConstants';

// ── Sub-component: Section Header ─────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
            <Typography
                sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT,
                    textTransform: 'uppercase',
                }}
            >
                {title}
            </Typography>
        </Box>
    );
}

// ── Sub-component: Info Row ───────────────────────────────────────────────────
function InfoItem({ label, value }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mb: 0.3, fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: isDark ? '#ffffff' : '#1A120D', fontWeight: 700 }}>
                {value || 'Not specified'}
            </Typography>
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GeneralInfo({ data }) {
    const theme   = useTheme();
    const isDark  = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    const {
        description    = 'No description provided.',
        management     = 'Managed by Provider',
        managementLogo = null,
        primaryContact = 'Not available',
        primaryPhone   = '',
        secondaryPhone = '',
        district       = 'Unknown Location',
        category       = 'Package',
    } = data || {};

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
                p: { xs: 2.5, sm: 3 },
                mb: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <SectionHeader icon={InfoOutlinedIcon} title="General Information" />
            <Divider sx={{ mb: 3, borderColor }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flexGrow: 1, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.8)' : '#1A120D', lineHeight: 1.75, fontWeight: 500 }}>
                    {description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={managementLogo}
                        sx={{
                            width: 36, height: 36,
                            bgcolor: isDark ? DARK_SURFACE_BG : alpha(BROWN_TEXT, 0.05),
                            fontSize: '0.85rem', fontWeight: 800,
                            color: isDark ? GOLD : BROWN_TEXT,
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : alpha(BROWN_TEXT, 0.2)}`,
                        }}
                    >
                        {management.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, fontWeight: 700 }}>
                            Management
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#ffffff' : '#1A120D' }}>
                            {management}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', gap: { xs: 3, sm: 5 }, mt: 1, p: 2.5 }}>
                    <InfoItem label="Primary Contact" value={primaryContact} />
                    <InfoItem label="Primary Phone"   value={primaryPhone} />
                    {secondaryPhone && <InfoItem label="Secondary Line" value={secondaryPhone} />}
                    <InfoItem label="Category"        value={category} />
                    <InfoItem label="District"        value={district} />
                </Box>
            </Box>
        </Paper>
    );
}