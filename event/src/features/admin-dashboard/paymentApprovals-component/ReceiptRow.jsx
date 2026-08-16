import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Avatar, Button, IconButton, CircularProgress } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { T } from "../Theme";
import { formatCurrency, fetchPaymentProofUrl, selectProcessingIds } from "../paymentsSlice";

/**
 * ReceiptRow — one row in the payment receipts table
 *
 * item: { id, paymentId, bookingId, customerName, customerAvatar, providerName, expectedAmount, receiptUrl }
 */
export default function ReceiptRow({ item, isProcessing, onVerify, onReject }) {
    const dispatch = useDispatch();

    // جلب الـ IDs التي يتم معالجتها حالياً لمعرفة إذا كان ملف الـ PDF قيد التحميل
    const processingIds = useSelector(selectProcessingIds);
    const isFetchingPdf = processingIds.includes(item.paymentId);

    // الدالة المسؤولة عن فتح الـ PDF أو جلبه من السيرفر
    const handleViewPdf = () => {
        // بناء الرابط المباشر للملف باستخدام الـ paymentId
        const pdfUrl = `http://localhost:8000/api/admin/payments/${item.paymentId}/view`;

        // فتح الرابط بتاب جديد مباشرة
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 2.2,
                borderBottom: `1px solid ${T.border}`,
                "&:hover": { bgcolor: T.rowHover },
            }}
        >
            {/* Booking ID */}
            <Typography sx={{ flex: 1.1, fontWeight: 700, fontSize: "0.88rem", color: T.textPrimary }}>
                {item.bookingId}
            </Typography>

            {/* Customer */}
            <Box sx={{ flex: 1.6, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                    src={item.customerAvatar}
                    alt={item.customerName}
                    sx={{ width: 34, height: 34, bgcolor: T.avatarBg, color: T.gold, fontWeight: 700, fontSize: "0.8rem" }}
                >
                    {!item.customerAvatar && item.customerName?.[0]}
                </Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: T.textPrimary }}>
                    {item.customerName}
                </Typography>
            </Box>

            {/* Provider */}
            <Typography sx={{ flex: 1.6, color: T.textMuted, fontSize: "0.88rem" }}>
                {item.providerName}
            </Typography>

            {/* Amount */}
            <Typography sx={{ flex: 1.1, textAlign: "right", color: T.gold, fontWeight: 800, fontSize: "0.98rem" }}>
                {formatCurrency(item.expectedAmount)}
            </Typography>

            {/* Receipt */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={!isFetchingPdf && <InsertDriveFileOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={handleViewPdf}
                    disabled={isFetchingPdf}
                    sx={{
                        borderColor: T.inputBorder,
                        color: T.textPrimary,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 1.5,
                        "&:hover": { borderColor: T.gold, bgcolor: "transparent" },
                    }}
                >
                    {isFetchingPdf ? <CircularProgress size={14} sx={{ color: T.textPrimary, mr: 1 }} /> : null}
                    {isFetchingPdf ? "Loading..." : "View PDF"}
                </Button>
            </Box>

            {/* Actions */}
            <Box sx={{ flex: 1.2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                    variant="contained"
                    size="small"
                    disabled={isProcessing}
                    onClick={() => onVerify(item.paymentId)}
                    sx={{
                        bgcolor: T.gold,
                        color: T.btnText,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "none",
                        px: 2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: T.goldHover, boxShadow: "none" },
                    }}
                >
                    {isProcessing ? <CircularProgress size={16} sx={{ color: T.btnText }} /> : "Verify Payment"}
                </Button>

                <IconButton
                    disabled={isProcessing}
                    onClick={() => onReject(item)}
                    sx={{
                        color: "#C0392B",
                        border: "1.5px solid #E0B4AC",
                        width: 32,
                        height: 32,
                        "&:hover": { bgcolor: "transparent", borderColor: "#C0392B" },
                    }}
                >
                    <BlockOutlinedIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}