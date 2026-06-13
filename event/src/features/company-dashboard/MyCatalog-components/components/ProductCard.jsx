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
    Avatar,
    Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useTheme } from "@mui/material/styles";

/**
 * ProductCard
 *
 * Props:
 * product: {
 * id, image, category, title, rating, reviewCount, price,
 * currency, colorOptions, availableFrom, availableTo,
 * status: "published" | "saved"
 * }
 * onEdit(id), onView(id), onDelete(id)
 */
export default function ProductCard({ product, onEdit, onView, onDelete }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // تعريف الألوان الديناميكية للحدود
    const borderColor = isDark ? 'rgba(78, 70, 57, 0.3)' : 'rgba(179, 140, 69, 0.3)';

    const {
        id,
        image,
        category,
        title,
        rating = 4.8,
        reviewCount,
        price,
        currency = "SAR",
        colorOptions = [],
        extraColors = 0,
        availableFrom,
        availableTo,
        status = "published",
    } = product;

    const isPublished = status === "published";

    // إعدادات الشارة (Chip) ديناميكياً لتناسب المود الداكن والفاتح
    const statusChipProps = isPublished
        ? {
            label: "PUBLISHED",
            bgcolor: isDark ? 'rgba(76, 175, 125, 0.15)' : 'rgba(76, 175, 125, 0.1)',
            color: '#4caf7d',
            chipBorderColor: 'rgba(76, 175, 125, 0.4)'
        }
        : {
            label: "SAVED",
            bgcolor: isDark ? 'rgba(197, 160, 89, 0.15)' : 'rgba(179, 140, 69, 0.15)',
            color: theme.palette.primary.main,
            chipBorderColor: borderColor
        };

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
                    sx={{ width: 180, height: "100%", minHeight: 160, objectFit: "cover" }}
                />
                <Chip
                    label={statusChipProps.label}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        bgcolor: statusChipProps.bgcolor,
                        color: statusChipProps.color,
                        border: `1px solid ${statusChipProps.chipBorderColor}`,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: 1,
                        height: 20,
                    }}
                />
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

                {/* Options row (تم تعديل المحاذاة هنا لليسار) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 0.5, flexWrap: "wrap" }}>
                    {/* Color swatches */}
                    {colorOptions.length > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem", mr: 0.5 }}>Options</Typography>
                            {colorOptions.slice(0, 3).map((color, i) => (
                                <Tooltip key={i} title={color}>
                                    <Avatar
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            bgcolor: color,
                                            border: `1px solid ${borderColor}`,
                                        }}
                                    >
                                        {" "}
                                    </Avatar>
                                </Tooltip>
                            ))}
                            {extraColors > 0 && (
                                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.7rem" }}>+{extraColors} Colors</Typography>
                            )}
                        </Box>
                    )}

                    {/* Availability */}
                    {availableFrom && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: theme.palette.text.secondary }} />
                            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.72rem" }}>
                                Availability: {availableFrom} – {availableTo}
                            </Typography>
                        </Box>
                    )}
                </Box>

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