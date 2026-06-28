import React from "react";
import {
    Box, Typography, TextField, IconButton, Paper,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";


const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.8rem",
        color: "text.primary",
        "& fieldset": { borderColor: "rgba(201,168,76,0.15)" },
        "&:hover fieldset": { borderColor: "rgba(201,168,76,0.35)" },
        "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
    "& input": { py: 0.9 },
};

const labelSx = {
    fontSize: "0.65rem",
    color: "text.secondary",
    fontFamily: "'Raleway', sans-serif",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    mb: 0.5,
};

// Mini calendar display
const MiniCalendar = ({ month = "June 2024" }) => {
    const days = ["S","M","T","W","T","F","S"];
    const dates = [
        [null,null,null,null,null,1,2],
        [3,4,5,6,7,8,9],
        [10,11,12,13,14,15,16],
    ];
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                    Availability <Box component="span" sx={{ color: "primary.main" }}>{month}</Box>
                </Typography>
                <Box sx={{ fontSize: "0.65rem", color: "text.secondary", cursor: "pointer" }}>📅</Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.3 }}>
                {days.map((d, i) => (
                    <Typography key={i} sx={{ fontSize: "0.6rem", color: "text.secondary", textAlign: "center", fontFamily: "'Raleway', sans-serif" }}>{d}</Typography>
                ))}
                {dates.map((row, ri) =>
                    row.map((d, ci) => (
                        <Box
                            key={`${ri}-${ci}`}
                            sx={{
                                fontSize: "0.65rem",
                                color: d === 6 ? "#1A1410" : d ? "text.secondary" : "transparent",
                                textAlign: "center",
                                fontFamily: "'Raleway', sans-serif",
                                bgcolor: d === 6 ? "primary.main" : d === 10 ? "rgba(201,168,76,0.2)" : "transparent",
                                borderRadius: "50%",
                                width: 18, height: 18,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                mx: "auto",
                            }}
                        >
                            {d || ""}
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

const VariantCard = ({ variant = {}, onChange, onDelete, isPlaceholder = false }) => {
    const handle = (field) => (e) => onChange?.({ ...variant, [field]: e.target.value });

    if (isPlaceholder) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2, minHeight: 320,
                    border: "1px dashed rgba(201,168,76,0.25)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    cursor: "pointer",
                    bgcolor: "transparent",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "rgba(201,168,76,0.5)" },
                }}
            >
                <Box sx={{ color: "primary.main", fontSize: "2rem", lineHeight: 1 }}>⊕</Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: "'Raleway', sans-serif" }}>
                    Add New
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2, position: "relative" }}>
            {onDelete && (
                <IconButton
                    size="small"
                    onClick={onDelete}
                    sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary", p: 0.5, "&:hover": { color: "error.main" } }}
                >

                </IconButton>
            )}

            {/* Photo Upload */}
            <Box
                sx={{
                    border: "1px dashed rgba(201,168,76,0.25)",
                    borderRadius: 1,
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    "&:hover": { borderColor: "rgba(201,168,76,0.5)" },
                    bgcolor: variant.photo ? "transparent" : "rgba(201,168,76,0.02)",
                    backgroundImage: variant.photo ? `url(${variant.photo})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {!variant.photo && (
                    <>
                        <AddPhotoAlternateOutlinedIcon sx={{ color: "rgba(201,168,76,0.4)", fontSize: "1.5rem", mb: 0.5 }} />
                        <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", fontFamily: "'Raleway', sans-serif" }}>
                            Upload Professional Photo
                        </Typography>
                    </>
                )}
            </Box>

            {/* Price + Inventory */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 1.5 }}>
                <Box>
                    <Typography sx={labelSx}>Price (SAR)</Typography>
                    <TextField fullWidth placeholder="2,500" value={variant.price || ""} onChange={handle("price")} size="small" sx={fieldSx} />
                </Box>
                <Box>
                    <Typography sx={labelSx}>Inventory</Typography>
                    <TextField fullWidth placeholder="5" value={variant.inventory || ""} onChange={handle("inventory")} size="small" sx={fieldSx} />
                </Box>
            </Box>

            {/* Variant Name */}
            <Box sx={{ mb: 1.5 }}>
                <Typography sx={labelSx}>Color / Variant Name</Typography>
                <TextField fullWidth placeholder="e.g., Royal Black" value={variant.variantName || ""} onChange={handle("variantName")} size="small" sx={fieldSx} />
            </Box>

            {/* Calendar */}
            <MiniCalendar />
        </Paper>
    );
};

export default VariantCard;