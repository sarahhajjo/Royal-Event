import React from "react";
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputAdornment, useTheme } from "@mui/material";
import { Search } from "lucide-react";

function FilterSelect({ label, value, onChange, options }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                {label}
            </Typography>
            <FormControl fullWidth size="small">
                <Select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.85rem",
                        color: theme.palette.text.primary,
                        bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                        "& .MuiSelect-icon": { color: theme.palette.text.secondary }
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option} value={option} sx={{ fontSize: "0.85rem", fontFamily: "'Raleway', sans-serif" }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default function JobFiltersBar({ filters, onChange }) {
    const theme = useTheme();

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.palette.text.secondary, fontFamily: "'Raleway', sans-serif" }}>
                    Search Jobs
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Title or Keywords..."
                    value={filters.search}
                    onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={16} color={theme.palette.text.secondary} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: "0.85rem",
                            color: theme.palette.text.primary,
                            bgcolor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.6)",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: theme.palette.divider },
                            "&:hover fieldset": { borderColor: "primary.main" },
                            "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        }
                    }}
                />
            </Box>

            <FilterSelect
                label="Experience Level"
                value={filters.experience}
                onChange={(v) => onChange({ ...filters, experience: v })}
                options={["All Levels", "Junior", "Mid", "Senior"]}
            />
            <FilterSelect
                label="Event Type"
                value={filters.eventType}
                onChange={(v) => onChange({ ...filters, eventType: v })}
                options={["All Events", "Wedding", "Gala", "Corporate", "Private"]}
            />
            <FilterSelect
                label="Employment Type"
                value={filters.employmentType}
                onChange={(v) => onChange({ ...filters, employmentType: v })}
                options={["All Types", "Permanent", "Temporary", "Contract"]}
            />
        </Box>
    );
}