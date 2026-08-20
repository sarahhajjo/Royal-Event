import React from "react";
import { Paper, Box, Typography, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material/styles';

// ── تنسيق الحقول الموحد ──
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.8rem",
        bgcolor: "rgba(201,168,76,0.02)",
        "& fieldset": { borderColor: "rgba(201,168,76,0.15)" },
    }
};

const DARK_CARD_BACKGROUND = 'linear-gradient(180deg, rgba(28, 21, 34, 0.86) 0%, rgba(20, 26, 42, 0.72) 100%)';
const DARK_CARD_BORDER = '1px solid rgba(255,255,255,0.06)';
const DARK_CARD_SHADOW = '0 18px 40px rgba(0,0,0,0.16)';
const DARK_CARD_HOVER_SHADOW = '0 20px 44px rgba(0,0,0,0.24)';
const DARK_SURFACE_BG = 'rgba(255,255,255,0.05)';
const DARK_SURFACE_BORDER = '1px solid rgba(255,255,255,0.06)';

const VariantCard = ({ variant = {}, onChange, onDelete, isPlaceholder = false, onClick }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const handle = (field) => (e) => onChange?.({ ...variant, [field]: e.target.value });

    if (isPlaceholder) {
        return (
            <Paper elevation={0} onClick={onClick} sx={{
                p: 2,
                minHeight: 300,
                background: isDark ? DARK_CARD_BACKGROUND : 'linear-gradient(180deg, rgba(255, 248, 232, 0.60) 0%, rgba(225, 190, 115, 0.25) 100%)',
                border: isDark ? DARK_CARD_BORDER : "1px dashed rgba(201,168,76,0.25)",
                borderRadius: '18px',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: 'blur(16px)',
                boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                    borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'primary.main'
                },
                '&:active': { transform: 'scale(0.98) translateY(-2px)', transition: 'all 0.05s ease' }
            }}>
                <Box sx={{ color: "primary.main", fontSize: "2rem" }}>⊕</Box>
                <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>Add Variant Option</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={0} sx={{
            p: 2,
            background: isDark ? DARK_CARD_BACKGROUND : 'linear-gradient(180deg, rgba(255, 248, 232, 0.60) 0%, rgba(225, 190, 115, 0.25) 100%)',
            border: isDark ? DARK_CARD_BORDER : "1px solid rgba(201,168,76,0.15)",
            borderRadius: '18px',
            position: "relative",
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? DARK_CARD_SHADOW : '0 18px 40px rgba(130, 100, 40, 0.10)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isDark ? DARK_CARD_HOVER_SHADOW : '0 20px 44px rgba(130, 100, 40, 0.2)',
                borderColor: isDark ? 'rgba(197, 160, 89, 0.22)' : 'rgba(201,168,76,0.35)'
            }
        }}>
            {onDelete && (
                <IconButton size="small" onClick={onDelete} sx={{ position: "absolute", top: 5, right: 5 }}><CloseIcon fontSize="small" /></IconButton>
            )}

            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, mb: 1.5, color: isDark ? '#c5a059' : "primary.main", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Variant Details</Typography>

            <TextField fullWidth size="small" placeholder="Name (e.g. Royal Black)" value={variant.variantName || ""} onChange={handle("variantName")} sx={{ ...fieldSx, mb: 1.5 }} />
            <TextField fullWidth size="small" placeholder="Price (SAR)" value={variant.price || ""} onChange={handle("price")} sx={{ ...fieldSx, mb: 1.5 }} />

            {/* 💡 هنا دمجنا تقنية الـ DateAndTime كروزنامة مصغرة للـ Variant */}
            <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", mb: 0.5 }}>Availability</Typography>
            <Box sx={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%", borderRadius: '14px', bgcolor: isDark ? DARK_SURFACE_BG : 'rgba(255,248,232,0.55)', border: isDark ? DARK_SURFACE_BORDER : '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>
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