import React from "react";
import {
    Paper, Box, Typography, Button, TextField, Select, MenuItem,
    FormControl, Checkbox, FormControlLabel, Grid
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// ── التنسيقات المشتركة ──
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.85rem",
        color: "text.primary",
        bgcolor: "rgba(201,168,76,0.02)",
        "& fieldset": { borderColor: "rgba(201,168,76,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(201,168,76,0.4)" },
        "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
};

const labelSx = {
    fontSize: "0.72rem",
    color: "text.secondary",
    fontFamily: "'Raleway', sans-serif",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    mb: 1,
};

const CustomizationPricing = ({ data = {}, onChange }) => {
    const handleNormal = (field) => (e) => onChange?.({ ...data, [field]: e.target.value });
    const handleCheckbox = (field) => (e) => onChange?.({ ...data, [field]: e.target.checked });

    const primaryVariant = data.variants?.[0] || { variant_name: { ar: "", en: "" }, price: 0 };

    const handleVariantPrice = (e) => {
        const newVariants = [...(data.variants || [])];
        newVariants[0] = { ...newVariants[0], price: Number(e.target.value) || 0 };
        onChange?.({ ...data, variants: newVariants });
    };

    const handleVariantName = (lang) => (e) => {
        const newVariants = [...(data.variants || [])];
        newVariants[0] = {
            ...newVariants[0],
            variant_name: {
                ...(newVariants[0]?.variant_name || {}),
                [lang]: e.target.value
            }
        };
        onChange?.({ ...data, variants: newVariants });
    };

    // 👑 التعديل الأول: نقرأ القيمة بناءً على الـ price_type
    const pricingMode = data.price_type === "hourly" ? "HOURLY RATE" : "FIXED RATE";

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <LocalOfferIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    Booking Details & Pricing
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography sx={labelSx}>Pricing Structure</Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
                        {["FIXED RATE", "HOURLY RATE"].map((mode) => (
                            <Button
                                key={mode}
                                onClick={() => {
                                    // 👑 التعديل الثاني: نحول الاختيار لـ fixed أو hourly ونرسله للـ State
                                    const backendValue = mode === "FIXED RATE" ? "fixed" : "hourly";
                                    onChange?.({ ...data, price_type: backendValue });
                                }}
                                sx={{
                                    py: 1.5, border: "1px solid",
                                    borderColor: pricingMode === mode ? "primary.main" : "rgba(201,168,76,0.2)",
                                    bgcolor: pricingMode === mode ? "rgba(201,168,76,0.12)" : "transparent",
                                    color: pricingMode === mode ? "primary.main" : "text.secondary",
                                    fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
                                    "&:hover": { borderColor: "primary.main" }
                                }}
                            >
                                {mode}
                            </Button>
                        ))}
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={labelSx}>Package Name (EN)</Typography>
                            <TextField fullWidth placeholder="e.g. Basic Package" value={primaryVariant.variant_name?.en || ""} onChange={handleVariantName("en")} size="small" sx={fieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={labelSx}>اسم الباقة (AR)</Typography>
                            <TextField fullWidth dir="rtl" placeholder="مثال: الباقة الأساسية" value={primaryVariant.variant_name?.ar || ""} onChange={handleVariantName("ar")} size="small" sx={fieldSx} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={labelSx}>Price</Typography>
                            <TextField fullWidth type="number" placeholder={pricingMode === "HOURLY RATE" ? "e.g. 500" : "e.g. 5000"} value={primaryVariant.price || ""} onChange={handleVariantPrice} size="small" sx={fieldSx} />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography sx={labelSx}>Currency</Typography>
                            <FormControl fullWidth size="small" sx={fieldSx}>
                                <Select value={data.currency || "SAR"} onChange={handleNormal("currency")}>
                                    <MenuItem value="SAR">SAR</MenuItem>
                                    <MenuItem value="USD">USD</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5} sx={{ borderLeft: { md: "1px solid rgba(201,168,76,0.15)" }, pl: { md: 4 } }}>
                    <Typography sx={labelSx}>Cancellation Policy</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                        {[
                            { id: "cancel_before_acceptance", label: "Cancellation before acceptance" },
                            { id: "cancel_after_acceptance",  label: "Cancellation after acceptance" },
                            { id: "cancel_before_payment",    label: "Cancellation before payment" }
                        ].map((item) => (
                            <FormControlLabel
                                key={item.id}
                                control={
                                    <Checkbox checked={!!data[item.id]} onChange={handleCheckbox(item.id)} sx={{ color: "rgba(201,168,76,0.4)", "&.Mui-checked": { color: "primary.main" } }} />
                                }
                                label={<Typography sx={{ fontSize: "0.82rem", fontFamily: "'Raleway', sans-serif", color: "text.secondary" }}>{item.label}</Typography>}
                            />
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default CustomizationPricing;