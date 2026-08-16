import React from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { T } from "../Theme";

const actionBtnSx = {
    borderColor: T.inputBorder,
    color: T.textPrimary,
    fontSize: "0.78rem",
    fontWeight: 600,
    textTransform: "none",
    px: 2,
    "&:hover": { borderColor: T.gold, bgcolor: "transparent" },
};

export default function ReceiptsTableToolbar({ onFilter, onExport }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2.5,
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: T.textPrimary,
                }}
            >
                Recent Receipts
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button variant="outlined" startIcon={<FilterListIcon />} onClick={onFilter} sx={actionBtnSx}>
                    Filter
                </Button>
                <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={onExport} sx={actionBtnSx}>
                    Export
                </Button>
            </Box>
        </Box>
    );
}
