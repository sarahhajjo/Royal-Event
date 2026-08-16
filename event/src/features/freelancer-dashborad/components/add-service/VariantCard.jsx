import React from "react";
import { Paper, Box, Typography, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ── تنسيق الحقول الموحد ──
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.8rem",
        bgcolor: "rgba(201,168,76,0.02)",
        "& fieldset": { borderColor: "rgba(201,168,76,0.15)" },
    }
};

const VariantCard = ({ variant = {}, onChange, onDelete, isPlaceholder = false, onClick }) => {
    const handle = (field) => (e) => onChange?.({ ...variant, [field]: e.target.value });

    if (isPlaceholder) {
        return (
            <Paper elevation={0} onClick={onClick} sx={{ p: 2, minHeight: 300, border: "1px dashed rgba(201,168,76,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { borderColor: "primary.main" } }}>
                <Box sx={{ color: "primary.main", fontSize: "2rem" }}>⊕</Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>Add Variant Option</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 2, border: "1px solid rgba(201,168,76,0.15)", position: "relative" }}>
            {onDelete && (
                <IconButton size="small" onClick={onDelete} sx={{ position: "absolute", top: 5, right: 5 }}><CloseIcon fontSize="small" /></IconButton>
            )}

            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, mb: 1.5, color: "primary.main" }}>Variant Details</Typography>

            <TextField fullWidth size="small" placeholder="Name (e.g. Royal Black)" value={variant.variantName || ""} onChange={handle("variantName")} sx={{ ...fieldSx, mb: 1.5 }} />
            <TextField fullWidth size="small" placeholder="Price (SAR)" value={variant.price || ""} onChange={handle("price")} sx={{ ...fieldSx, mb: 1.5 }} />

            {/* 💡 هنا دمجنا تقنية الـ DateAndTime كروزنامة مصغرة للـ Variant */}
            <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", mb: 0.5 }}>Availability</Typography>
            <Box sx={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        slotProps={{ actionBar: { actions: [] } }}
                        sx={{ '.MuiPickersToolbar-root': { display: 'none' }, '.MuiPickersLayout-root': { width: '100%' } }}
                    />
                </LocalizationProvider>
            </Box>
        </Paper>
    );
};

export default VariantCard;