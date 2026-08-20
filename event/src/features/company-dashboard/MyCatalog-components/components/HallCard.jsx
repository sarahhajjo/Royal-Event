import React from "react";
import { Box, Card, CardMedia, Typography, Chip, IconButton, Button, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles"; // 💡 إضافة alpha
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import { fixImageUrl } from "../../../../utils/imageUrlHelper";
// 💡 استيراد ثوابت الألوان
import { GOLD, BROWN_TEXT, MUTED_TEXT, LIGHT_CARD, LIGHT_BORDER, DARK_CARD_BACKGROUND, DARK_CARD_BORDER } from "../../../../utils/colorConstants";

const getSafeText = (field, fallback = '') => {
    if (!field) return fallback;
    if (typeof field === 'string') return field;
    if (field.name) {
        if (typeof field.name === 'string') return field.name;
        return field.name.en || field.name.ar || fallback;
    }
    return field.en || field.ar || fallback;
};

export default function HallCard({ hall, onEdit, onView, onDelete }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        id, image, category, title, rating = 4.9, reviewCount, price,
        currency = "SYP", location, date, timeFrom, timeTo, status = "confirmed",
    } = hall;

    const displayCategory = getSafeText(category, 'Hall/Service');
    const displayTitle = getSafeText(title, 'Untitled');
    const displayLocation = getSafeText(location, 'Unknown Location');

    // 💡 الألوان الزجاجية الفاخرة
    const cardBg = isDark ? DARK_CARD_BACKGROUND : LIGHT_CARD;
    const cardBorder = isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`;
    const textPrimary = isDark ? '#ffffff' : '#1A120D';
    const textSecondary = isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT;
    const actionBorder = isDark ? 'rgba(255,255,255,0.15)' : alpha(BROWN_TEXT, 0.2);

    return (
        <Card
            elevation={0}
            sx={{
                display: "flex",
                bgcolor: cardBg,
                border: cardBorder,
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                backdropFilter: 'blur(12px)', // 💡 تأثير الزجاج
                transition: "all 0.3s ease",
                "&:hover": { borderColor: GOLD, boxShadow: isDark ? `0 8px 32px ${alpha(GOLD, 0.1)}` : `0 8px 32px ${alpha(BROWN_TEXT, 0.05)}` },
            }}
        >
            <Box sx={{ position: "relative", flexShrink: 0, width: 180 }}>
                <CardMedia
                    component="img"
                    image={fixImageUrl(image)}
                    alt={displayTitle}
                    sx={{ width: 180, height: 180, minHeight: 160, objectFit: "cover" }}
                />
                {status && (
                    <Chip
                        label={status.toUpperCase()}
                        size="small"
                        sx={{
                            position: "absolute", top: 10, left: 10,
                            bgcolor: isDark ? alpha(GOLD, 0.15) : alpha(BROWN_TEXT, 0.1),
                            color: isDark ? GOLD : '#1A120D',
                            border: `1px solid ${isDark ? alpha(GOLD, 0.4) : alpha(BROWN_TEXT, 0.3)}`,
                            fontSize: "0.6rem", fontWeight: 800, letterSpacing: 1,
                            height: 20, backdropFilter: "blur(4px)",
                        }}
                    />
                )}
            </Box>

            <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ color: isDark ? GOLD : BROWN_TEXT, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", fontSize: "0.65rem" }}
                        >
                            {displayCategory}
                        </Typography>
                        <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 700, fontSize: "1rem", lineHeight: 1.3, mt: 0.3 }}>
                            {displayTitle}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right", flexShrink: 0, ml: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                            <Box sx={{ color: GOLD, fontSize: "0.85rem" }}>★</Box>
                            <Typography sx={{ color: textPrimary, fontWeight: 700, fontSize: "0.85rem" }}>{rating}</Typography>
                            {reviewCount && (
                                <Typography sx={{ color: textSecondary, fontSize: "0.75rem" }}>({reviewCount})</Typography>
                            )}
                        </Box>
                        <Box
                            sx={{ bgcolor: GOLD, color: "#131110", fontWeight: 800, fontSize: "0.9rem", px: 1.5, py: 0.5, borderRadius: "6px", mt: 0.5, whiteSpace: "nowrap" }}
                        >
                            {price?.toLocaleString()} {currency}
                        </Box>
                    </Box>
                </Box>

                <Stack direction="row" spacing={3} sx={{ mt: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 13, color: textSecondary }} />
                        <Typography sx={{ color: textSecondary, fontSize: "0.72rem", fontWeight: 500 }}>
                            {displayLocation}
                        </Typography>
                    </Box>
                    {date && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: textSecondary }} />
                            <Typography sx={{ color: textSecondary, fontSize: "0.72rem", fontWeight: 500 }}>
                                {date} | {timeFrom} – {timeTo}
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1 }}>
                    <Button size="small" startIcon={<EditOutlinedIcon fontSize="small" />} onClick={() => onEdit?.(id)} sx={{ color: textPrimary, border: `1px solid ${actionBorder}`, borderRadius: "6px", fontSize: "0.72rem", px: 1.5, textTransform: "none", fontWeight: 600, "&:hover": { borderColor: GOLD, color: isDark ? GOLD : BROWN_TEXT, bgcolor: isDark ? alpha(GOLD, 0.05) : alpha(BROWN_TEXT, 0.05) } }}>Edit</Button>
                    <Button size="small" startIcon={<VisibilityOutlinedIcon fontSize="small" />} onClick={() => onView?.(id)} sx={{ color: textPrimary, border: `1px solid ${actionBorder}`, borderRadius: "6px", fontSize: "0.72rem", px: 1.5, textTransform: "none", fontWeight: 600, "&:hover": { borderColor: GOLD, color: isDark ? GOLD : BROWN_TEXT, bgcolor: isDark ? alpha(GOLD, 0.05) : alpha(BROWN_TEXT, 0.05) } }}>View</Button>
                    <IconButton size="small" onClick={() => onDelete?.(id)} sx={{ color: "#c0392b", border: `1px solid ${actionBorder}`, borderRadius: "6px", p: 0.6, "&:hover": { borderColor: "#c0392b", bgcolor: "#c0392b11" } }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>
        </Card>
    );
}