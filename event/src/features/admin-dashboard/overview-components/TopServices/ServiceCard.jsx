import React from "react";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ServiceCard = ({ image, badge, title, subtitle, rating }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid #E0D5BC",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#FFFFFF",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box sx={{ position: "relative", height: 150 }}>
                <Box component="img" src={image} alt={title} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {badge && (
                    <Chip
                        label={badge}
                        size="small"
                        sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(255,255,255,0.9)", color: "#1C1712", fontWeight: 700, fontSize: 10 }}
                    />
                )}
            </Box>

            <Box p={2} flexGrow={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="subtitle1" fontWeight={700} color="#1C1712">
                        {title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <StarIcon sx={{ fontSize: 16, color: "#8a6f28" }} />
                        <Typography variant="body2" fontWeight={700} color="#1C1712">
                            {rating}
                        </Typography>
                    </Stack>
                </Stack>
                <Typography variant="body2" color="#7A6F5E" mt={0.5}>
                    {subtitle}
                </Typography>
            </Box>
        </Paper>
    );
};

export default ServiceCard;