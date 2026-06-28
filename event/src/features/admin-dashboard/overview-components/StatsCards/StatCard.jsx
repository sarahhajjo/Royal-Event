import React from "react";
import { Box, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import { T } from "../../Theme.jsx"; // تأكد من المسار

const StatCard = ({ label, icon, variant = "number", value, footer, trend }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3, flex: 1, minHeight: 170, position: "relative",
                border: `1px solid ${T.borderLight}`,
                borderRadius: 2,
                bgcolor: T.cardBg,
                overflow: "hidden",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography
                    variant="overline"
                    sx={{ color: T.textMuted, letterSpacing: 1, fontWeight: 600 }}
                >
                    {label}
                </Typography>
                <Box sx={{ color: T.gold }}>{icon}</Box>
            </Stack>

            <Typography
                variant="h3"
                sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1, color: T.textPrimary }}
            >
                {variant === "percentage" ? `${value}%` : value}
            </Typography>

            {variant === "percentage" && (
                <LinearProgress
                    variant="determinate"
                    value={Number(value)}
                    sx={{
                        height: 4, borderRadius: 2, mb: 1.5,
                        bgcolor: "rgba(0,0,0,0.08)",
                        "& .MuiLinearProgress-bar": { bgcolor: T.gold },
                    }}
                />
            )}

            <Typography
                variant="caption"
                sx={{
                    color: trend ? "#388E3C" : T.textMuted,
                    fontWeight: trend ? 600 : 400,
                }}
            >
                {footer}
            </Typography>
        </Paper>
    );
};

export default StatCard;