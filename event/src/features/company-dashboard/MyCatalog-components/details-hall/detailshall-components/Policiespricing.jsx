import React from 'react';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// 💡 استيراد ثوابت الألوان
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER
} from'../../../../../utils/colorConstants';

// ── Sub-component: Section Header ─────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

// ── Sub-component: Stat Block ─────────────────────────────────────────────────
function StatBlock({ label, value, valueColor, sub, textTransform }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mb: 0.5, fontWeight: 700 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: { xs: '1.4rem', sm: '1.7rem' }, fontWeight: 800,
                    color: valueColor || GOLD, lineHeight: 1, textTransform: textTransform || 'none'
                }}
            >
                {value || '0'}
            </Typography>
            {sub && (
                <Typography sx={{ fontSize: '0.65rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {sub}
                </Typography>
            )}
        </Box>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PoliciesPricing({ data }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    const {
        priceAmount      = '0',
        capacity         = '0',
        currency         = 'USD',
        priceType        = 'FIXED',
        cancelPolicies   = {},
        cancellationNote = 'Full refund if cancelled 48h before the event date after acceptance.',
    } = data || {};

    const policiesList = [
        { label: 'Cancellation Before Acceptance', active: cancelPolicies.beforeAcceptance },
        { label: 'Cancellation After Acceptance',  active: cancelPolicies.afterAcceptance },
        { label: 'Cancellation Before Payment',    active: cancelPolicies.beforePayment },
    ];

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
                flexDirection: 'column'
            }}
        >
            <SectionHeader icon={SellOutlinedIcon} title="Policies, Options & Pricing" />
            <Divider sx={{ mb: 3, borderColor }} />

            <Grid container spacing={4} alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center' }}>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 2, fontWeight: 700 }}>
                            Cancellation Policy
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', mx: 'auto', width: 'fit-content' }}>
                            {policiesList.map((policy, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {policy.active ? (
                                        <RadioButtonCheckedIcon sx={{ color: GOLD, fontSize: 20 }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ color: isDark ? 'rgba(255,255,255,0.3)' : alpha(BROWN_TEXT, 0.4), fontSize: 20 }} />
                                    )}
                                    <Typography sx={{
                                        fontSize: '0.9rem',
                                        color: policy.active ? (isDark ? '#ffffff' : '#1A120D') : (isDark ? 'rgba(255,255,255,0.4)' : alpha(BROWN_TEXT, 0.6)),
                                        fontWeight: 600
                                    }}>
                                        {policy.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Typography sx={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mt: 3, lineHeight: 1.6, fontStyle: 'italic', maxWidth: '90%', fontWeight: 500 }}>
                            {cancellationNote}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                        <Grid item xs={4}>
                            <StatBlock label="Price Amount" value={`${priceAmount} ${currency}`} />
                        </Grid>
                        <Grid item xs={4}>
                            <StatBlock label="Capacity" value={capacity} valueColor={isDark ? '#ffffff' : '#1A120D'} sub="Max Guests" />
                        </Grid>
                        <Grid item xs={4}>
                            <StatBlock
                                label="Price Type"
                                value={priceType}
                                valueColor={isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT}
                                textTransform="lowercase"
                            />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Paper>
    );
}