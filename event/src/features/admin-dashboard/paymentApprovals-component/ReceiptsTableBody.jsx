import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ReceiptRow from "./ReceiptRow";
import { T } from "../Theme";

export default function ReceiptsTableBody({ items, status, processingIds, onViewReceipt, onVerify, onReject }) {
    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress sx={{ color: T.gold }} />
            </Box>
        );
    }

    if (status === "failed") {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ color: "#C0392B" }}>Couldn't load payment receipts. Please try again.</Typography>
            </Box>
        );
    }

    if (!items.length) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography sx={{ color: T.textMuted, fontSize: "0.9rem" }}>
                    No accepted bookings awaiting payment verification.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {items.map((item) => (
                <ReceiptRow
                    key={item.id}
                    item={item}
                    isProcessing={processingIds.includes(item.paymentId)}
                    onViewReceipt={onViewReceipt}
                    onVerify={onVerify}
                    onReject={onReject}
                />
            ))}
        </Box>
    );
}
