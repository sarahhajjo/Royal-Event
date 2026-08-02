import React from "react";
import { Box, Typography } from "@mui/material";
import { T } from "../Theme";

const COLUMNS = [
    { key: "bookingId",   label: "Booking ID",      flex: 1.1 },
    { key: "customer",    label: "Customer Name",   flex: 1.6 },
    { key: "provider",    label: "Provider Name",   flex: 1.6 },
    { key: "amount",      label: "Expected Amount", flex: 1.1, align: "right" },
    { key: "receipt",     label: "Receipt",         flex: 1,   align: "center" },
    { key: "actions",     label: "Actions",         flex: 1.2, align: "right" },
];

export default function ReceiptsTableHead() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 1.5,
                borderTop: `1px solid ${T.border}`,
                borderBottom: `1px solid ${T.border}`,
            }}
        >
            {COLUMNS.map((col) => (
                <Typography
                    key={col.key}
                    sx={{
                        flex: col.flex,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: 1.3,
                        textTransform: "uppercase",
                        color: T.goldLabel,
                        textAlign: col.align || "left",
                    }}
                >
                    {col.label}
                </Typography>
            ))}
        </Box>
    );
}
