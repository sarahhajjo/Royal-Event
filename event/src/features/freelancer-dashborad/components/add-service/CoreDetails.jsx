import React, { useState, useEffect } from "react";

import {
    Paper, Box, Typography, TextField, Select, MenuItem,
    FormControl, Checkbox, FormControlLabel, Grid, CircularProgress
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import freelancerOfferService from "../../../../services/freelancerService/freelancerOfferService.js";
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
    "& .MuiInputLabel-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.8rem",
        color: "text.secondary",
        "&.Mui-focused": { color: "primary.main" },
    },
    "& .MuiSelect-icon": { color: "text.secondary" },
};

const labelSx = {
    fontSize: "0.72rem",
    color: "text.secondary",
    fontFamily: "'Raleway', sans-serif",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    mb: 1,
};
const CoreDetails = ({ data = {}, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // 👑 استخدام الدوال من الـ Service مباشرة
                const [categoriesData, districtsData] = await Promise.all([
                    freelancerOfferService.getCategories(),
                    freelancerOfferService.getDistricts()
                ]);

                // تأكدي من هيكل البيانات القادم (إذا كان في data أو لا)
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

    // دوال التحديث
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
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <InventoryIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    Core Service Details
                </Typography>
            </Box>

            {/* العنوان (إنجليزي وعربي) */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>Service Title (English) </Typography>
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
                    <Typography sx={labelSx}>اسم الخدمة (عربي) </Typography>
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

            {/* 👑 3. الفئة والمحافظة (مربوطة بالـ States الجديدة) */}
            <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>Category </Typography>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                        <Select
                            value={data.category_id || ""}
                            onChange={handleNormalField("category_id")}
                            displayEmpty
                            disabled={isLoading} // تعطيل القائمة أثناء التحميل
                        >
                            <MenuItem value="" disabled>
                                {isLoading ? "Loading Categories..." : "Select Category"}
                            </MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {/* 👈 تعديل هنا ليأخذ الاسم حسب اللغة، مثلاً الإنجليزية أو العربية */}
                                    {cat.name?.en || cat.name?.ar || cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>District </Typography>
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
                                    {district.name} {/* 👈 تأكدي أنه يقرأ district.name */}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* الوصف (إنجليزي) */}
            <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>Detailed Description (English) </Typography>
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

            {/* الوصف (عربي) */}
            <Box sx={{ mb: 2.5 }}>
                <Typography sx={labelSx}>الوصف التفصيلي (عربي) </Typography>
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

            {/* حقل الأدوات */}
            <Box sx={{ p: 2, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 1, bgcolor: "rgba(201,168,76,0.01)" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!data.includesTools}
                            onChange={handleNormalField("includesTools")}
                            sx={{ color: "primary.main" }}
                        />
                    }
                    label="Does this service include specific tools/equipment?"
                />
                {data.includesTools && (
                    <Box sx={{ mt: 1.5 }}>
                        <Typography sx={{ ...labelSx, fontSize: "0.68rem" }}>List Equipment </Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g., Pioneer DJ Controller..."
                            // 👑 هنا الربط باسم العمود الفعلي في قاعدة البيانات
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

export default CoreDetails;