import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { T, searchFieldSx } from "../Theme";

/**
 * PaymentSearchBar — top search input ("Search approvals...")
 */
export default function PaymentSearchBar({ value, onChange }) {
    return (
        <TextField
            fullWidth
            size="small"
            placeholder="Search approvals..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: T.textMuted, fontSize: 20 }} />
                    </InputAdornment>
                ),
            }}
            sx={{ ...searchFieldSx, maxWidth: 420 }}
        />
    );
}
