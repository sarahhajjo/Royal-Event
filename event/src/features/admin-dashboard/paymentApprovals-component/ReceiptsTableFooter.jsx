import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { T } from "../Theme";

/**
 * ReceiptsTableFooter — "Showing 1-3 of 12 payments" + page buttons
 *
 * pagination: { currentPage, lastPage, total }
 * pageSize   – items shown per page (for the "1-3" label)
 */
export default function ReceiptsTableFooter({ pagination, pageSize, onPageChange }) {
    const { currentPage, lastPage, total } = pagination;
    const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, total);

    const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
            }}
        >
            <Typography sx={{ color: T.textMuted, fontSize: "0.8rem" }}>
                Showing {rangeStart}-{rangeEnd} of {total} payments
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    size="small"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    sx={{ border: `1px solid ${T.border}`, borderRadius: "6px", width: 30, height: 30 }}
                >
                    <ChevronLeftIcon fontSize="small" />
                </IconButton>

                {pageNumbers.map((num) => (
                    <Box
                        key={num}
                        onClick={() => onPageChange(num)}
                        sx={{
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                            border: `1px solid ${num === currentPage ? T.gold : T.border}`,
                            bgcolor: num === currentPage ? T.activeBg : "transparent",
                            color: num === currentPage ? T.gold : T.textMuted,
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                        }}
                    >
                        {num}
                    </Box>
                ))}

                <IconButton
                    size="small"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                    sx={{ border: `1px solid ${T.border}`, borderRadius: "6px", width: 30, height: 30 }}
                >
                    <ChevronRightIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
