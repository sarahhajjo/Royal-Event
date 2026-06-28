import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// 💡 استيراد أيقونات الدوائر
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Icon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: theme.palette.text.secondary, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

function StatBlock({ label, value, valueColor, sub, textTransform }) {
    const theme = useTheme();
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 0.2 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: { xs: '1.1rem', sm: '1.35rem' },
                    fontWeight: 800,
                    color: valueColor || theme.palette.primary.main,
                    lineHeight: 1,
                    textTransform: textTransform || 'none'
                }}
            >
                {value}
            </Typography>
            {sub && (
                <Typography sx={{ fontSize: '0.55rem', color: theme.palette.text.secondary, mt: 0.2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {sub}
                </Typography>
            )}
        </Box>
    );
}

export default function ProductOptionsPricing({
                                                  // 💡 استقبال السياسات ككائن
                                                  policies = { beforeAcceptance: false, afterAcceptance: false, beforePayment: false },
                                                  cancellationNote = 'Full refund if cancelled 48h before the event date after acceptance.',
                                                  variants = [],
                                                  selectedIndex = 0,
                                                  onColorSelect
                                              }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const border = isDark ? '#2e2318' : '#ddd0b0';

    const POLICY_OPTIONS = [
        { key: 'beforeAcceptance', label: 'Cancellation Before Acceptance' },
        { key: 'afterAcceptance',  label: 'Cancellation After Acceptance'  },
        { key: 'beforePayment',    label: 'Cancellation Before Payment'    },
    ];

    const activeVariant = variants[selectedIndex] || {};

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
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
            <Divider sx={{ mb: 1.5, borderColor: border }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>

                {/* 1. سياسة الإلغاء */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 1 }}>
                        Cancellation Policy
                    </Typography>

                    <Box sx={{ textAlign: 'left', width: 'fit-content' }}>
                        {/* 💡 خريطة لطباعة السياسات بدون RadioGroup */}
                        {POLICY_OPTIONS.map(({ key, label }) => {
                            const isChecked = policies[key];
                            return (
                                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: isChecked ? 1 : 0.5 }}>
                                    {isChecked ? (
                                        <RadioButtonCheckedIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: isDark ? '#4a3820' : '#c0a870' }} />
                                    )}
                                    <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.primary, fontWeight: 500 }}>
                                        {label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    <Typography sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, mt: 1, lineHeight: 1.4, fontStyle: 'italic', maxWidth: '85%' }}>
                        {cancellationNote}
                    </Typography>
                </Box>

                {/* 2. الألوان المتاحة */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 1 }}>
                        Available Colors
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                        {variants.map((variant, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <Box
                                    key={index}
                                    onClick={() => onColorSelect(index)}
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        backgroundColor: variant.colorHex,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isDark ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                                        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                        outline: isSelected ? `2px solid ${theme.palette.background.paper}` : 'none',
                                        outlineOffset: '-3px',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.1)' }
                                    }}
                                >
                                    {isSelected && <CheckCircleIcon sx={{ color: theme.palette.background.paper, fontSize: 16, opacity: 0.8 }} />}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* 3. الإحصائيات */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 2, sm: 3 }, mt: 2 }}>
                    <StatBlock label="Price" value={activeVariant.price} />
                    <StatBlock label="Currency" value={activeVariant.currency || 'SAR'} valueColor={theme.palette.text.primary} textTransform="uppercase" />
                    <StatBlock label="Quantity" value={activeVariant.quantity} valueColor={theme.palette.text.primary} sub="Units" />
                    <StatBlock label="Pay Type" value={activeVariant.paymentType} valueColor={theme.palette.text.secondary} textTransform="lowercase" />
                </Box>

            </Box>
        </Paper>
    );
}