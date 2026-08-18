import React, { useState, useEffect } from "react";
import {
    Paper, Box, Typography, TextField, Select, MenuItem,
    FormControl, Checkbox, FormControlLabel, Grid, useTheme
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService.js";

const CoreDetails = ({ data = {}, onChange }) => {
    const theme = useTheme();
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.85rem",
            color: theme.palette.text.primary,
            bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
            "& fieldset": { borderColor: "primary.main", opacity: 0.3 },
            "&:hover fieldset": { borderColor: "primary.main", opacity: 0.6 },
            "&.Mui-focused fieldset": { borderColor: "primary.main", opacity: 1 },
        },
        "& .MuiInputLabel-root": {
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.8rem",
            color: theme.palette.text.secondary,
            "&.Mui-focused": { color: theme.palette.primary.main },
        },
        "& .MuiSelect-icon": { color: theme.palette.text.secondary },
    };

    const labelSx = {
        fontSize: "0.72rem",
        color: theme.palette.text.secondary,
        fontFamily: "'Raleway', sans-serif",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        mb: 1,
    };

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [categoriesData, districtsData] = await Promise.all([
                    freelancerOfferService.getCategories(),
                    freelancerOfferService.getDistricts()
                ]);

                setCategories(categoriesData.data || categoriesData);
                setDistricts(districtsData.data || districtsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    const handleNormalField = (field) => (e) => {
        onChange?.({ ...data, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
    };

    const handleTranslationField = (field, lang) => (e) => {
        onChange?.({
            ...data,
            [field]: {
                ...data[field],
                [lang]: e.target.value
            }
        });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                mb: 3,
                background: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.65)" : "rgba(250, 248, 245, 0.6)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid",
                borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                borderRadius: "16px",
                boxShadow: theme.palette.mode === 'dark' ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)" : "0 8px 32px 0 rgba(130, 120, 110, 0.08)",
                color: theme.palette.text.primary
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <InventoryIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", color: theme.palette.text.primary, fontWeight: 600 }}>
                    Core Service Details
                </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>Service Title (English)</Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g., Luxury Wedding DJ Setup"
                        value={data.title?.en || ""}
                        onChange={handleTranslationField("title", "en")}
                        size="small"
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>اسم الخدمة (عربي)</Typography>
                    <TextField
                        fullWidth
                        dir="rtl"
                        placeholder="مثال: تجهيز دي جي لحفلات الزفاف"
                        value={data.title?.ar || ""}
                        onChange={handleTranslationField("title", "ar")}
                        size="small"
                        sx={fieldSx}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>Category</Typography>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                        <Select
                            value={data.category_id || ""}
                            onChange={handleNormalField("category_id")}
                            displayEmpty
                            disabled={isLoading}
                        >
                            <MenuItem value="" disabled>
                                {isLoading ? "Loading Categories..." : "Select Category"}
                            </MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name?.en || cat.name?.ar || cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>District</Typography>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                        <Select
                            value={data.district_id || ""}
                            onChange={handleNormalField("district_id")}
                            displayEmpty
                            disabled={isLoading}
                        >
                            <MenuItem value="" disabled>
                                {isLoading ? "Loading Districts..." : "Select District"}
                            </MenuItem>
                            {districts.map((district) => (
                                <MenuItem key={district.id} value={district.id}>
                                    {district.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>Detailed Description (English)</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe the exclusive experience..."
                    value={data.description?.en || ""}
                    onChange={handleTranslationField("description", "en")}
                    sx={fieldSx}
                />
            </Box>

            <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>الوصف التفصيلي (عربي)</Typography>
                <TextField
                    fullWidth
                    multiline
                    dir="rtl"
                    rows={3}
                    placeholder="وصف تفصيلي للخدمة..."
                    value={data.description?.ar || ""}
                    onChange={handleTranslationField("description", "ar")}
                    sx={fieldSx}
                />
            </Box>

            <Box sx={{ p: 2, border: "1px solid", borderColor: theme.palette.mode === 'dark' ? "rgba(212,175,55,0.2)" : "rgba(0,0,0,0.1)", borderRadius: 1, bgcolor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.3)" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!data.includesTools}
                            onChange={handleNormalField("includesTools")}
                            sx={{ color: "primary.main" }}
                        />
                    }
                    label={<Typography sx={{ color: theme.palette.text.primary, fontSize: "0.85rem" }}>Does this service include specific tools/equipment?</Typography>}
                />
                {data.includesTools && (
                    <Box sx={{ mt: 1.5 }}>
                        <Typography sx={{ ...labelSx, fontSize: "0.68rem" }}>List Equipment</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g., Pioneer DJ Controller..."
                            value={data.material_composition || ""}
                            onChange={handleNormalField("material_composition")}
                            size="small"
                            sx={fieldSx}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

CoreDetails.displayName = "CoreDetails";
export default CoreDetails;