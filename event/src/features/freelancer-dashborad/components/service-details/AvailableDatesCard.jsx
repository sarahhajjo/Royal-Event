import React from "react";
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AvailableDatesCard({
                                               monthLabel = "July 2026",
                                               dates = [],
                                               onPrevMonth,
                                               onNextMonth,
                                               onViewAll,
                                           }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: theme.palette.text.primary }}>
                    Available Dates
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>{monthLabel}</Typography>
                    <IconButton
                        onClick={onPrevMonth}
                        size="small"
                        aria-label="الشهر السابق"
                        sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover', color: theme.palette.text.primary } }}
                    >
                        <ChevronLeft size={16} />
                    </IconButton>
                    <IconButton
                        onClick={onNextMonth}
                        size="small"
                        aria-label="الشهر التالي"
                        sx={{ color: theme.palette.text.secondary, '&:hover': { bgcolor: 'action.hover', color: theme.palette.text.primary } }}
                    >
                        <ChevronRight size={16} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dates.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', borderRadius: '12px', border: '1px dashed', borderColor: theme.palette.divider }}>
                        <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                            No available dates yet
                        </Typography>
                    </Box>
                ) : (
                    dates.map((date) => (
                        <Box
                            key={date.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.5)',
                                p: 2,
                                gap: 2
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary }}>{date.dayLabel}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 0.5 }}>
                                    {date.variantName ? `${date.variantName} · ` : ""}
                                    {date.remainingCapacity != null
                                        ? `${date.remainingCapacity} spot${date.remainingCapacity === 1 ? "" : "s"} left`
                                        : "Available all day"}
                                </Typography>
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    borderRadius: '8px',
                                    bgcolor: 'primary.main',
                                    color: isDark ? '#000' : '#fff',
                                    px: 1.5,
                                    py: 0.6,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {date.timeRange}
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            <Button
                onClick={onViewAll}
                variant="outlined"
                fullWidth
                sx={{
                    mt: 2,
                    borderRadius: '10px',
                    borderColor: theme.palette.divider,
                    py: 1,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(212, 175, 55, 0.1)', color: 'primary.main' }
                }}
            >
                View all schedules
            </Button>
        </Box>
    );
}