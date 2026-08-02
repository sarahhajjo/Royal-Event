import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StatCard from "./StatCard";
import { T } from "../Theme";
import { formatCurrency } from "../paymentsSlice";

/**
 * PaymentStatsRow — 3 stat cards + "Generate Report" CTA
 *
 * summary: { pendingReview, awaitingClarification, totalVerifiedMTD }
 */
export default function PaymentStatsRow({ summary, loading, onGenerateReport }) {
    return (
        <Box sx={{ display: "flex", gap: 2.5, mb: 3.5, alignItems: "stretch" }}>
            <StatCard label="Pending Review" value={String(summary.pendingReview).padStart(2, "0")} />
            <StatCard label="Awaiting Clarification" value={String(summary.awaitingClarification).padStart(2, "0")} />
            <StatCard label="Total Verified (MTD)" value={formatCurrency(summary.totalVerifiedMTD)} />

            <Button
                onClick={onGenerateReport}
                disabled={loading}
                sx={{
                    flex: 1,
                    bgcolor: T.gold,
                    color: T.btnText,
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    px: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": { bgcolor: T.goldHover },
                }}
                endIcon={loading ? null : <ArrowForwardIcon />}
            >
                {loading ? <CircularProgress size={18} sx={{ color: T.btnText }} /> : "Generate Report"}
            </Button>
        </Box>
    );
}
