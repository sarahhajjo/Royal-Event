import React from "react";
import { Box, Typography } from "@mui/material";
import { T } from "../Theme";

export default function ReceiptsTableToolbar() {
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
        </Box>
    );
}