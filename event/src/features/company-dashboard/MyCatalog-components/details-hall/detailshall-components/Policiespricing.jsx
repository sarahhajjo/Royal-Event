import React from 'react';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// ── Sub-component: Section Header ─────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Icon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

// ── Sub-component: Stat Block ─────────────────────────────────────────────────
function StatBlock({ label, value, valueColor, sub, textTransform }) {
    const theme = useTheme();
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 0.5 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: { xs: '1.4rem', sm: '1.7rem' },
                    fontWeight: 800,
                    color: valueColor || theme.palette.primary.main,
                    lineHeight: 1,
                    textTransform: textTransform || 'none'
                }}
            >
                {value || '0'}
            </Typography>
            {sub && (
                <Typography sx={{ fontSize: '0.65rem', color: theme.palette.text.secondary, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const {
        priceAmount      = '0',
        capacity         = '0',
        currency         = 'USD',
        priceType        = 'FIXED',
        cancelPolicies   = {}, // 💡 استلام كائن السياسات المحدث
        cancellationNote = 'Full refund if cancelled 48h before the event date after acceptance.',
    } = data || {};

    // 💡 ترتيب السياسات لعرضها كقائمة
    const policiesList = [
        { label: 'Cancellation Before Acceptance', active: cancelPolicies.beforeAcceptance },
        { label: 'Cancellation After Acceptance',  active: cancelPolicies.afterAcceptance },
        { label: 'Cancellation Before Payment',    active: cancelPolicies.beforePayment },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${border}`,
                borderRadius: 2,
                p: { xs: 2.5, sm: 3 },
                mb: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <SectionHeader icon={SellOutlinedIcon} title="Policies, Options & Pricing" />
            <Divider sx={{ mb: 3, borderColor: border }} />

            <Grid container spacing={4} alignItems="center" sx={{ flexGrow: 1, justifyContent: 'center' }}>

                {/* 1. سياسة الإلغاء (القائمة المطابقة للتصميم) */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 2 }}>
                            Cancellation Policy
                        </Typography>

                        {/* 💡 عرض القائمة مع الأيقونات الذهبية */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', mx: 'auto', width: 'fit-content' }}>
                            {policiesList.map((policy, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {policy.active ? (
                                        <RadioButtonCheckedIcon sx={{ color: '#c5a059', fontSize: 20 }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ color: theme.palette.text.disabled, fontSize: 20, opacity: 0.5 }} />
                                    )}
                                    <Typography sx={{
                                        fontSize: '0.9rem',
                                        color: policy.active ? theme.palette.text.primary : theme.palette.text.disabled,
                                        fontWeight: 500
                                    }}>
                                        {policy.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary, mt: 3, lineHeight: 1.6, fontStyle: 'italic', maxWidth: '90%' }}>
                            {cancellationNote}
                        </Typography>
                    </Box>
                </Grid>

                {/* 2. الإحصائيات (في الأسفل) */}
                <Grid item xs={12}>
                    <Grid container spacing={3} justifyContent="center" alignItems="center">
                        <Grid item xs={4}>
                            <StatBlock label="Price Amount" value={`${priceAmount} ${currency}`} />
                        </Grid>
                        <Grid item xs={4}>
                            <StatBlock label="Capacity" value={capacity} valueColor={theme.palette.text.primary} sub="Max Guests" />
                        </Grid>
                        <Grid item xs={4}>
                            <StatBlock
                                label="Price Type"
                                value={priceType}
                                valueColor={theme.palette.text.secondary}
                                textTransform="lowercase"
                            />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Paper>
    );
}