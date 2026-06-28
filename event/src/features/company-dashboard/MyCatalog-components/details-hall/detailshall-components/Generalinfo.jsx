import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';

// ── Sub-component: Section Header ─────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography
                sx={{
                    fontSize:      '0.65rem',
                    fontWeight:    700,
                    letterSpacing: '0.14em',
                    color:         theme.palette.text.secondary,
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
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 0.3 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: theme.palette.text.primary, fontWeight: 500 }}>
                {value || 'Not specified'} {/* 💡 استخدام قيمة افتراضية */}
            </Typography>
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
// 💡 استبدال venue بـ data وتفكيك القيم القادمة من mappedArrangement.generalInfo
export default function GeneralInfo({ data }) {
    const theme   = useTheme();
    const isDark  = theme.palette.mode === 'dark';
    const border  = isDark ? '#2e2318' : '#ddd0b0';

    // 💡 استخدام القيم القادمة من data ووضع قيم افتراضية في حال كانت undefined
    const {
        description    = 'No description provided.',
        management     = 'Managed by Provider',
        managementLogo = null,
        primaryContact = 'Not available',
        primaryPhone   = '',
        secondaryPhone = '',
        district       = 'Unknown Location',
        category       = 'Package',
    } = data || {}; // 💡 التعامل مع احتمال أن data قد تكون null

    return (
        <Paper
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                border:          `1px solid ${border}`,
                borderRadius:    2,
                p:               { xs: 2.5, sm: 3 },
                mb:              0,
                height:          '100%',
                display:         'flex',
                flexDirection:   'column',
            }}
        >
            <SectionHeader icon={InfoOutlinedIcon} title="General Information" />
            <Divider sx={{ mb: 3, borderColor: border }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flexGrow: 1, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, lineHeight: 1.75 }}>
                    {/* 💡 عرض الوصف الحقيقي */}
                    {description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={managementLogo}
                        sx={{
                            width:           36,
                            height:          36,
                            backgroundColor: isDark ? '#2e2318' : '#e8dcc0',
                            fontSize:        '0.75rem',
                            fontWeight:      700,
                            color:           theme.palette.primary.main,
                            border:          `1px solid ${border}`,
                        }}
                    >
                        {management.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary }}>
                            Management
                        </Typography>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary }}>
                            {management}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', width: '100%', gap: { xs: 3, sm: 5 }, mt: 1, p: 2.5 }}>
                    {/* 💡 عرض القيم الديناميكية */}
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