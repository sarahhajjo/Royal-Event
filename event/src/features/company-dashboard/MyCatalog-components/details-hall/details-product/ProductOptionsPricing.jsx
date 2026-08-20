import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';

// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG } from '../../../../../utils/colorConstants';

function SectionHeader({ icon: Icon, title }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Icon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );
}

function StatBlock({ label, value, valueColor, sub, textTransform }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mb: 0.2, fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography
                sx={{
                    fontSize: { xs: '1.1rem', sm: '1.35rem' }, fontWeight: 800,
                    color: valueColor || GOLD, lineHeight: 1, textTransform: textTransform || 'none'
                }}
            >
                {value}
            </Typography>
            {sub && (
                <Typography sx={{ fontSize: '0.55rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mt: 0.2, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {sub}
                </Typography>
            )}
        </Box>
    );
}

export default function ProductOptionsPricing({ policies = { beforeAcceptance: false, afterAcceptance: false, beforePayment: false }, cancellationNote = 'Full refund if cancelled 48h before the event date after acceptance.', variants = [], selectedIndex = 0, material = 'Not Specified', onColorSelect }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

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
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                backdropFilter: 'blur(12px)',
                borderRadius: 3, p: { xs: 2.5, sm: 3 }, mb: 0,
            }}
        >
            <SectionHeader icon={SellOutlinedIcon} title="Policies, Options & Pricing" />
            <Divider sx={{ mb: 1.5, borderColor }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1, fontWeight: 700 }}>
                        Cancellation Policy
                    </Typography>
                    <Box sx={{ textAlign: 'left', width: 'fit-content' }}>
                        {POLICY_OPTIONS.map(({ key, label }) => {
                            const isChecked = policies[key];
                            return (
                                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: isChecked ? 1 : 0.5 }}>
                                    {isChecked ? (
                                        <RadioButtonCheckedIcon sx={{ fontSize: 20, color: GOLD }} />
                                    ) : (
                                        <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: isDark ? 'rgba(255,255,255,0.3)' : alpha(BROWN_TEXT, 0.4) }} />
                                    )}
                                    <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#ffffff' : '#1A120D', fontWeight: 600 }}>
                                        {label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: isDark ? 'rgba(255,255,255,0.5)' : MUTED_TEXT, mt: 1, lineHeight: 1.4, fontStyle: 'italic', maxWidth: '85%', fontWeight: 500 }}>
                        {cancellationNote}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1, fontWeight: 700 }}>
                            Material
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT, backdropFilter: 'blur(4px)', px: 1.5, py: 0.5, borderRadius: 2, border: `1px solid ${borderColor}` }}>
                            <TextureOutlinedIcon sx={{ fontSize: 14, color: isDark ? GOLD : BROWN_TEXT }} />
                            <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#ffffff' : '#1A120D', fontWeight: 700, textTransform: 'capitalize' }}>
                                {material || 'Not Specified'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, mb: 1, fontWeight: 700 }}>
                            Available Colors
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                            {variants.map((variant, index) => {
                                const isSelected = index === selectedIndex;
                                return (
                                    <Box
                                        key={index} onClick={() => onColorSelect(index)}
                                        sx={{
                                            width: 28, height: 28, borderRadius: '50%', backgroundColor: variant.colorHex,
                                            cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: isDark ? 'inset 0 2px 4px rgba(0,0,0,0.5)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                                            border: isSelected ? `2px solid ${GOLD}` : '2px solid transparent',
                                            outline: isSelected ? `2px solid ${isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD}` : 'none',
                                            outlineOffset: '-3px', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    >
                                        {isSelected && <CheckCircleIcon sx={{ color: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD, fontSize: 16, opacity: 0.9 }} />}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 2, sm: 3 }, mt: 2 }}>
                    <StatBlock label="Price" value={activeVariant.price} />
                    <StatBlock label="Currency" value={activeVariant.currency || 'SAR'} valueColor={isDark ? '#ffffff' : '#1A120D'} textTransform="uppercase" />
                    <StatBlock label="Quantity" value={activeVariant.quantity} valueColor={isDark ? '#ffffff' : '#1A120D'} sub="Units" />
                    <StatBlock label="Pay Type" value={activeVariant.paymentType} valueColor={isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT} textTransform="lowercase" />
                </Box>
            </Box>
        </Paper>
    );
}