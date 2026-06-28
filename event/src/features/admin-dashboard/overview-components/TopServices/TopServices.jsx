import React from "react";
import { Box, Grid, Stack, Typography, Paper, Button } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ServiceCard from "./ServiceCard"; // تأكد من المسار

const ActionCard = ({ icon, label, onClick }) => (
    <Paper
        elevation={0} onClick={onClick}
        sx={{
            border: "1px dashed #C8BA90", borderRadius: 2, height: "100%", minHeight: 230,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", bgcolor: "#FFFFFF", transition: "all 0.2s",
            "&:hover": { borderColor: "#8a6f28", bgcolor: "#F3EDE0" },
        }}
    >
        <Box mb={1} sx={{ color: "#8a6f28" }}>{icon}</Box>
        <Typography variant="subtitle2" fontWeight={700} textAlign="center" color="#1C1712">
            {label}
        </Typography>
    </Paper>
);

const TopServices = () => {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1C1712" }}>
                    Top Performing Services
                </Typography>
                <Button sx={{ color: "#8a6f28", fontWeight: 700 }} endIcon={<span>→</span>}>VIEW ALL</Button>
            </Stack>

            <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} sm={6} md={3}>
                    <ServiceCard
                        image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"
                        badge="PREMIUM" title="The Grand Reserve" subtitle="Signature Ballroom" rating={4.9}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ServiceCard
                        image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"
                        badge={null} title="Sky Terrace Lounge" subtitle="Rooftop Experience" rating={4.7}
                    />
                </Grid>

            </Grid>
        </Box>
    );
};

export default TopServices;