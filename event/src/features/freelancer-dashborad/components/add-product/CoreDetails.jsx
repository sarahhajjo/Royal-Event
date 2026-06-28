import React from "react";
import {
    Paper, Box, Typography, TextField, Select, MenuItem,
    FormControl,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.85rem",
        color: "text.primary",
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

const CATEGORIES = [
    "Fashion & Couture", "Jewelry & Accessories", "Event Planning",
    "Photography", "Catering", "Floral Design", "Entertainment",
];

const CoreDetails = ({ data = {}, onChange }) => {
    const handle = (field) => (e) => onChange?.({ ...data, [field]: e.target.value });

    return (
        <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
            {/* Section Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <InventoryIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    Core Details
                </Typography>
            </Box>

            {/* Product Name */}
            <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1 }}>
                    Product / Service Name
                </Typography>
                <TextField
                    fullWidth
                    placeholder="e.g., Luxury Silk Evening Gown"
                    value={data.name || ""}
                    onChange={handle("name")}
                    size="small"
                    sx={fieldSx}
                />
            </Box>

            {/* Category + Material */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                <Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1 }}>
                        Category
                    </Typography>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                        <Select
                            value={data.category || "Fashion & Couture"}
                            onChange={handle("category")}
                            displayEmpty
                            sx={{ bgcolor: "transparent" }}
                            variant="outlined" /* 👈 تم تصحيح الخطأ هنا */
                        >
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c} value={c} sx={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem" }}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1 }}>
                        Material / Composition
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="e.g., 100% Natural Silk"
                        value={data.material || ""}
                        onChange={handle("material")}
                        size="small"
                        sx={fieldSx}
                    />
                </Box>
            </Box>

            {/* Description */}
            <Box>
                <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1 }}>
                    Detailed Description
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Describe the craftsmanship and beauty behind this work..."
                    value={data.description || ""}
                    onChange={handle("description")}
                    sx={{
                        ...fieldSx,
                        "& .MuiOutlinedInput-root": {
                            ...fieldSx["& .MuiOutlinedInput-root"],
                            alignItems: "flex-start",
                        },
                    }}
                />
            </Box>
        </Paper>
    );
};

export default CoreDetails;