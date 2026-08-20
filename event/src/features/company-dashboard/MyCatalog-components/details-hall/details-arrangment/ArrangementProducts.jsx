import React from 'react';
import { Box, Typography, Divider, Paper, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

// 💡 استيراد ثوابت الألوان الفاخرة
import {
    GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_INPUT,
    LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_SURFACE_BG
} from '../../../../../utils/colorConstants';

// ── كرت المنتج (التصميم الجديد) ────────────────────────────────────────────────
function ProductCardHorizontal({ product }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER;

    const firstVariant = product.variants[0] || {};
    const image        = firstVariant.image || 'https://via.placeholder.com/150?text=No+Image';
    const price        = firstVariant.price || 0;
    const currency     = firstVariant.currency || '';
    const totalQty     = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return (
        <Box sx={{
            display: 'flex',
            minWidth: { xs: 280, sm: 330 },
            maxWidth: 350,
            flexShrink: 0,
            p: 1.5,
            bgcolor: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            border: `1px solid ${borderColor}`,
            borderRadius: 3,
            gap: 2,
            backdropFilter: 'blur(4px)',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: GOLD }
        }}>
            {/* 1. قسم الصورة */}
            <Box sx={{
                width: 90, height: 90, borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                overflow: 'hidden', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
                border: `1px solid ${borderColor}`
            }}>
                <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            </Box>

            {/* 2. قسم المعلومات */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', py: 0.5 }}>
                <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#1A120D', mb: 0.5, textTransform: 'capitalize' }}>
                        {product.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: GOLD }}>
                        {price} {currency}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.8 }}>
                        {product.variants.map((v, idx) => {
                            const cssColor = v.colorName ? v.colorName.toLowerCase().replace(/\s/g, '') : GOLD;
                            return (
                                <Tooltip key={idx} title={`${v.colorName} (Qty: ${v.stock})`} placement="top">
                                    <Box sx={{
                                        width: 16, height: 16, borderRadius: '50%', backgroundColor: cssColor,
                                        border: `2px solid ${isDark ? '#1c1512' : '#ffffff'}`,
                                        outline: `1px solid ${GOLD}`, boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                    }} />
                                </Tooltip>
                            );
                        })}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT }}>
                            QTY:
                        </Typography>
                        <Box sx={{
                            px: 1.5, py: 0.2, border: `1px solid ${GOLD}`, borderRadius: 1,
                            fontSize: '0.8rem', fontWeight: 700,
                            color: isDark ? '#ffffff' : '#1A120D',
                            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)'
                        }}>
                            {totalQty}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

// ── المكون الرئيسي ────────────────────────────────────────────────────────────
export default function ArrangementProducts({ products = [] }) {
    const theme  = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper elevation={0} sx={{
            bgcolor: isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            backdropFilter: 'blur(12px)',
            borderRadius: 3, p: { xs: 2.5, sm: 3 }, mb: 2,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CategoryOutlinedIcon sx={{ fontSize: 18, color: isDark ? GOLD : BROWN_TEXT }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textTransform: 'uppercase' }}>
                    Included Products
                </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : LIGHT_BORDER }} />

            {products.length === 0 ? (
                <Typography sx={{ fontSize: '0.85rem', color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, textAlign: 'center', py: 3, fontWeight: 500 }}>
                    No physical products linked to this arrangement.
                </Typography>
            ) : (
                <Box sx={{
                    display: 'flex', gap: 2, overflowX: 'auto', pb: 1,
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : alpha(BROWN_TEXT, 0.2),
                        borderRadius: '10px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: GOLD }
                }}>
                    {products.map((prod, i) => (
                        <ProductCardHorizontal key={i} product={prod} />
                    ))}
                </Box>
            )}
        </Paper>
    );
}