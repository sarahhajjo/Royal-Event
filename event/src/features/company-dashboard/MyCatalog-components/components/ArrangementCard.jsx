import React from "react";
import { Box, Card, CardMedia, Typography, Chip, IconButton, Button, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

/**
 * ArrangementCard
 *
 * Props:
 *   arrangement: {
 *     id, image, category, title, rating, reviewCount, price,
 *     currency, availableFrom, availableTo, eventType, status
 *   }
 *   onEdit(id), onView(id), onDelete(id)
 */
export default function ArrangementCard({ arrangement, onEdit, onView, onDelete }) {
    const theme = useTheme();
    const gold = theme.palette.primary.main;
    const isDark = theme.palette.mode === "dark";

    const {
        id,
        image,
        category,
        title,
        rating = 4.9,
        reviewCount,
        price,
        currency = "SAR",
        availableFrom,
        availableTo,
        eventType,
        status = "confirmed",
    } = arrangement;

    return (
        <Card
            elevation={0}
            sx={{
                display: "flex",
                bgcolor: isDark? '#261d19' : '#E5D9B8',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: gold + "66" },
            }}
        >
            {/* Image */}
            <Box sx={{ position: "relative", flexShrink: 0, width: 200 }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{ width: 200, height: "100%", minHeight: 170, objectFit: "cover" }}
                />
                {status && (
                    <Chip
                        label={status.toUpperCase()}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor: isDark ? "rgba(30,24,14,0.85)" : "rgba(255,248,220,0.9)",
                            color: gold,
                            border: `1px solid ${gold}55`,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: 1,
                            height: 20,
                            backdropFilter: "blur(4px)",
                        }}
                    />
                )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, p: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Top row */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{ color: gold, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontSize: "0.65rem" }}
                        >
                            {category}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: "text.primary", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3, mt: 0.3 }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    {/* Rating + Price */}
                    <Box sx={{ textAlign: "right", flexShrink: 0, ml: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                            <Box sx={{ color: gold, fontSize: "0.85rem" }}>★</Box>
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.85rem" }}>{rating}</Typography>
                            {reviewCount && (
                                <Typography sx={{ color: "text.secondary", fontSize: "0.75rem" }}>({reviewCount})</Typography>
                            )}
                        </Box>
                        <Box
                            sx={{
                                bgcolor: gold,
                                color: isDark ? "#1a1610" : "#fff",
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
                <Stack direction="row" spacing={3} sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                        <Typography sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                            Available: {availableFrom} – {availableTo}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <EventOutlinedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                        <Typography sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                            Event Type: {eventType}
                        </Typography>
                    </Box>
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1.5 }}>
                    <Button
                        size="small"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                        onClick={() => onEdit?.(id)}
                        sx={{
                            color: "text.primary",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            px: 1.5,
                            textTransform: "none",
                            "&:hover": { borderColor: gold, color: gold, bgcolor: "transparent" },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                        onClick={() => onView?.(id)}
                        sx={{
                            color: "text.primary",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            px: 1.5,
                            textTransform: "none",
                            "&:hover": { borderColor: gold, color: gold, bgcolor: "transparent" },
                        }}
                    >
                        View
                    </Button>
                    <IconButton
                        size="small"
                        onClick={() => onDelete?.(id)}
                        sx={{
                            color: "#c0392b",
                            border: `1px solid ${theme.palette.divider}`,
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