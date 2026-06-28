import React, { useState } from "react";
import {
    Paper, Box, Typography, Button, Grid,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import VariantCard from "./VariantCard";

const CustomizationPricing = ({ variants = [], onVariantsChange }) => {
    const [mode, setMode] = useState("variants"); // "variants" | "fixed"

    const handleVariantChange = (index, updated) => {
        const next = [...variants];
        next[index] = updated;
        onVariantsChange?.(next);
    };

    const handleAddVariant = () => {
        onVariantsChange?.([...variants, { price: "", inventory: "", variantName: "" }]);
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            {/* Header row */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <TuneIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                    <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                        Customization & Pricing
                    </Typography>
                </Box>

                {/* Mode toggle */}
                <Box sx={{ display: "flex", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 1, overflow: "hidden" }}>
                    {["variants", "fixed"].map((m) => (
                        <Button
                            key={m}
                            onClick={() => setMode(m)}
                            size="small"
                            sx={{
                                px: 2, py: 0.7,
                                borderRadius: 0,
                                fontSize: "0.72rem",
                                fontFamily: "'Raleway', sans-serif",
                                letterSpacing: "0.06em",
                                bgcolor: mode === m ? "primary.main" : "transparent",
                                color: mode === m ? "#1A1410" : "text.secondary",
                                fontWeight: mode === m ? 700 : 400,
                                "&:hover": { bgcolor: mode === m ? "primary.light" : "rgba(201,168,76,0.08)" },
                            }}
                        >
                            {m === "variants" ? "Enable Variants" : "Fixed Price"}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Variant cards grid */}
            <Grid container spacing={2}>
                {variants.map((variant, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <VariantCard
                            variant={variant}
                            onChange={(updated) => handleVariantChange(i, updated)}
                            onDelete={variants.length > 1 ? () => {
                                const next = variants.filter((_, idx) => idx !== i);
                                onVariantsChange?.(next);
                            } : undefined}
                        />
                    </Grid>
                ))}

                {/* Placeholder "Add New" card */}
                <Grid item xs={12} sm={6} md={4}>
                    <VariantCard isPlaceholder onClick={handleAddVariant} />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CustomizationPricing;