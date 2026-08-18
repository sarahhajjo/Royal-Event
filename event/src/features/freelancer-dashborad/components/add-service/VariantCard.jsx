import React from "react";
import { Paper, Box, Typography, TextField, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const VariantCard = ({ variant = {}, onChange, onDelete, isPlaceholder = false, onClick }) => {
    const theme = useTheme();

    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.8rem",
            color: theme.palette.text.primary,
            bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
            "& fieldset": { borderColor: theme.palette.divider },
        }
    };

    const handle = (field) => (e) => onChange?.({ ...variant, [field]: e.target.value });

    if (isPlaceholder) {
        return (
            <Paper
                elevation={0}
                onClick={onClick}
                sx={{
                    p: 2,
                    minHeight: 300,
                    border: "1px dashed",
                    borderColor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    bgcolor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main" }
                }}
            >
                <Box sx={{ color: "primary.main", fontSize: "2rem" }}>⊕</Box>
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>Add Variant Option</Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: "1px solid",
                borderColor: theme.palette.divider,
                bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.4)" : "rgba(250, 248, 245, 0.4)",
                position: "relative",
                borderRadius: 2
            }}
        >
            {onDelete && (
                <IconButton size="small" onClick={onDelete} sx={{ position: "absolute", top: 5, right: 5, color: theme.palette.text.secondary }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}

            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, mb: 1.5, color: "primary.main" }}>Variant Details</Typography>

            <TextField fullWidth size="small" placeholder="Name (e.g. Royal Black)" value={variant.variantName || ""} onChange={handle("variantName")} sx={{ ...fieldSx, mb: 1.5 }} />
            <TextField fullWidth size="small" placeholder="Price (SAR)" value={variant.price || ""} onChange={handle("price")} sx={{ ...fieldSx, mb: 1.5 }} />

            <Typography sx={{ fontSize: "0.65rem", color: theme.palette.text.secondary, mb: 0.5 }}>Availability</Typography>
            <Box sx={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        slotProps={{ actionBar: { actions: [] } }}
                        sx={{
                            bgcolor: "transparent",
                            '.MuiPickersToolbar-root': { display: 'none' },
                            '.MuiPickersLayout-root': { width: '100%' },
                            '.MuiPickersCalendarHeader-label': { color: theme.palette.text.primary },
                            '.MuiDayCalendar-weekDayLabel': { color: theme.palette.text.secondary },
                            '.MuiPickersDay-root': { color: theme.palette.text.primary }
                        }}
                    />
                </LocalizationProvider>
            </Box>
        </Paper>
    );
};

VariantCard.displayName = "VariantCard";
export default VariantCard;