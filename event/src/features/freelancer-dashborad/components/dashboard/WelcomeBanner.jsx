import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const WelcomeBanner = ({ userName = "Marcus Thorne", subtitle = "", onAddService }) => {
    const displaySubtitle =
        subtitle ||
        "Curating unforgettable moments through design. Your portfolio is currently viewed by 12 exclusive planners.";

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                mb: 2.5,
                background: "linear-gradient(135deg, #2A211A 0%, #1E1810 60%, #251F15 100%)",
                border: "1px solid",
                borderColor: "divider",
                minHeight: 180,
            }}
        >
            {/* Right side decorative image area */}
            <Box
                sx={{
                    position: "absolute",
                    right: 0, top: 0, bottom: 0,
                    width: { xs: 0, md: "35%" },
                    backgroundImage: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to right, #1E1810 0%, rgba(30,24,16,0.4) 100%)",
                    },
                }}
            />

            <Box sx={{ position: "relative", zIndex: 1, maxWidth: { md: "60%" } }}>
                <Typography
                    sx={{
                        mb: 1.5,
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 400,
                        color: "text.primary",
                        lineHeight: 1.3,
                        fontSize: { xs: "1.6rem", md: "2rem" },
                    }}
                >
                    Welcome back,{" "}
                    <Box component="span" sx={{ color: "primary.main", fontStyle: "italic" }}>
                        {userName}
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        mb: 3,
                        color: "text.secondary",
                        fontSize: "0.88rem",
                        fontFamily: "'Raleway', sans-serif",
                        lineHeight: 1.75,
                        maxWidth: 460,
                    }}
                >
                    {displaySubtitle}
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: "1rem !important" }} />}
                    onClick={onAddService}
                    sx={{ px: 3, py: 1, fontSize: "0.75rem", letterSpacing: "0.06em" }}
                >
                    Add New Service
                </Button>
            </Box>
        </Paper>
    );
};

export default WelcomeBanner;