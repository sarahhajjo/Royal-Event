import React from "react";
import {
    Paper, Box, Typography, TextField,
    Checkbox, FormControlLabel, Radio, RadioGroup,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.85rem",
        color: "text.primary",
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

const Logistics = ({ data = {}, onChange }) => {
    const handle = (field) => (e) =>
        onChange?.({ ...data, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

    return (
        <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <LocalShippingOutlinedIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography sx={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "text.primary", fontWeight: 600 }}>
                    Logistics
                </Typography>
            </Box>

            {/* Geographic Area */}
            <Box sx={{ mb: 3 }}>
                <Typography sx={labelSx}>Geographic Area</Typography>
                <TextField
                    fullWidth
                    placeholder="Define coverage area..."
                    value={data.area || ""}
                    onChange={handle("area")}
                    size="small"
                    sx={fieldSx}
                />
            </Box>

            {/* Cancellation Policy */}
            <Box sx={{ mb: 3 }}>
                <Typography sx={labelSx}>Cancellation Policy</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                        { key: "freeCancel", label: "Free cancellation before acceptance" },
                        { key: "feeAfter", label: "50% fee after acceptance" },
                    ].map(({ key, label }) => (
                        <FormControlLabel
                            key={key}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={!!data[key]}
                                    onChange={handle(key)}
                                    sx={{
                                        color: "rgba(201,168,76,0.4)",
                                        "&.Mui-checked": { color: "primary.main" },
                                        p: 0.5,
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: "0.82rem", fontFamily: "'Raleway', sans-serif", color: "text.secondary" }}>
                                    {label}
                                </Typography>
                            }
                            sx={{ mx: 0, gap: 0.5 }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Service at client location */}
            <Box>
                <Typography sx={labelSx}>Service at client location?</Typography>
                <RadioGroup
                    row
                    value={data.clientLocation || "yes"}
                    onChange={handle("clientLocation")}
                    sx={{ gap: 2 }}
                >
                    {["Yes", "No"].map((opt) => (
                        <FormControlLabel
                            key={opt}
                            value={opt.toLowerCase()}
                            control={
                                <Radio
                                    size="small"
                                    sx={{ color: "rgba(201,168,76,0.4)", "&.Mui-checked": { color: "primary.main" }, p: 0.5 }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: "0.82rem", fontFamily: "'Raleway', sans-serif", color: "text.secondary" }}>
                                    {opt}
                                </Typography>
                            }
                            sx={{ mx: 0, gap: 0.5 }}
                        />
                    ))}
                </RadioGroup>
            </Box>
        </Paper>
    );
};

export default Logistics;