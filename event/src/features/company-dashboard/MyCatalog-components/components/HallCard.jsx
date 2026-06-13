import React from "react";
import {
    Box,
    Card,
    CardMedia,
    Typography,
    Chip,
    IconButton,
    Button,
    Stack,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useTheme } from "@mui/material/styles";

/**
 * HallCard
 *
 * Props:
 * hall: {
 * id, image, category, title, rating, reviewCount, price,
 * currency, location, date, timeFrom, timeTo, status
 * }
 * onEdit(id), onView(id), onDelete(id)
 */
export default function HallCard({ hall, onEdit, onView, onDelete }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // تعريف الألوان الديناميكية للحدود والشارات
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.3)';
    const badgeBg = isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(179, 140, 69, 0.15)';

    const {
        id,
        image,
        category,
        title,
        rating = 4.9,
        reviewCount,
        price,
        currency = "SAR",
        location,
        date,
        timeFrom,
        timeTo,
        status = "confirmed",
    } = hall;

    return (
        <Card
            elevation={0}
            sx={{
                display: "flex",
                bgcolor: isDark? '#261d19' : '#E5D9B8',
                border: `1px solid ${borderColor}`,
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: theme.palette.primary.main },
            }}
        >
            {/* Image */}
            <Box sx={{ position: "relative", flexShrink: 0, width: 180 }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{ width: 180, height: 180, minHeight: 160, objectFit: "cover" }}
                />
                {status && (
                    <Chip
                        label={status.toUpperCase()}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor: badgeBg,
                            color: theme.palette.primary.main,
                            border: `1px solid ${borderColor}`,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: 1,
                            height: 20,
                        }}
                    />
                )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Top row */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                                fontSize: "0.65rem",
                            }}
                        >
                            {category}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: "1rem", lineHeight: 1.3, mt: 0.3 }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    {/* Rating + Price */}
                    <Box sx={{ textAlign: "right", flexShrink: 0, ml: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                            <Box sx={{ color: theme.palette.primary.main, fontSize: "0.85rem" }}>★</Box>
                            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: "0.85rem" }}>{rating}</Typography>
                            {reviewCount && (
                                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.75rem" }}>({reviewCount})</Typography>
                            )}
                        </Box>
                        <Box
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.background.default,
                                fontWeight: 800,
                                fontSize: "0.9rem",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "6px",
                                mt: 0.5,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {price?.toLocaleString()} {currency}
                        </Box>
                    </Box>
                </Box>

                {/* Meta */}
                <Stack direction="row" spacing={3} sx={{ mt: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 13, color: theme.palette.text.secondary }} />
                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>{location}</Typography>
                    </Box>
                    {date && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: theme.palette.text.secondary }} />
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
                                {date} | {timeFrom} – {timeTo}
                            </Typography>
                        </Box>
                    )}
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1 }}>
                    <Button
                        size="small"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                        onClick={() => onEdit?.(id)}
                        sx={{
                            color: theme.palette.text.primary,
                            border: `1px solid ${borderColor}`,
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            px: 1.5,
                            textTransform: "none",
                            "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main, bgcolor: "transparent" },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                        onClick={() => onView?.(id)}
                        sx={{
                            color: theme.palette.text.primary,
                            border: `1px solid ${borderColor}`,
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            px: 1.5,
                            textTransform: "none",
                            "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main, bgcolor: "transparent" },
                        }}
                    >
                        View
                    </Button>
                    <IconButton
                        size="small"
                        onClick={() => onDelete?.(id)}
                        sx={{
                            color: "#c0392b",
                            border: `1px solid ${borderColor}`,
                            borderRadius: "6px",
                            p: 0.6,
                            "&:hover": { borderColor: "#c0392b", bgcolor: "#c0392b11" },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>
        </Card>
    );
}