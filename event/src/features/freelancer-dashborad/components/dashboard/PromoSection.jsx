import React from "react";
import { Grid, Paper, Box, Typography, Button } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";

const ProTipCard = ({ tip = {} }) => {
    const {
        title = "Elevate your portfolio with 4K photography",
        description = "Premium imagery increases profile conversion by up to 40% in our exclusive tier.",
        bgImage = "",
    } = tip;

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                p: 3.5,
                height: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(26,20,16,0.97) 0%, rgba(26,20,16,0.7) 100%)",
                },
            }}
        >
            {/* Decorative golden diagonal line */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 40,
                    width: 1,
                    height: "100%",
                    background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.25), transparent)",
                    transform: "rotate(20deg)",
                }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                    variant="caption"
                    sx={{ color: "primary.main", mb: 1, display: "block", letterSpacing: "0.12em" }}
                >
                    Professional Tip
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ mb: 1, fontSize: "1.1rem", color: "text.primary", lineHeight: 1.4 }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
                    {description}
                </Typography>
            </Box>
        </Paper>
    );
};

const UpgradeCard = ({ onLearnMore }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3.5,
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 1.5,
            background: "linear-gradient(135deg, #221D17, #2A211A)",
        }}
    >
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "rgba(201,168,76,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(201,168,76,0.25)",
            }}
        >
            <DiamondIcon sx={{ color: "primary.main", fontSize: 22 }} />
        </Box>

        <Box>
            <Typography variant="h6" sx={{ fontSize: "1rem", mb: 0.5 }}>
                Upgrade to Royal Plus
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.78rem", maxWidth: 260 }}>
                Gain access to ultra-exclusive gala commissions and early bid visibility on high-profile events.
            </Typography>
        </Box>

        <Button
            variant="contained"
            onClick={onLearnMore}
            sx={{ mt: 0.5, px: 4, py: 0.9, fontSize: "0.75rem" }}
        >
            Learn More
        </Button>
    </Paper>
);

const PromoSection = ({ tip, onLearnMore }) => (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
            <ProTipCard tip={tip} />
        </Grid>
        <Grid item xs={12} md={6}>
            <UpgradeCard onLearnMore={onLearnMore} />
        </Grid>
    </Grid>
);

export default PromoSection;