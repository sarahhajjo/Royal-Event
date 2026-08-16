import React from "react";
import { Box, Typography, Avatar, Chip, Button, IconButton, CircularProgress } from "@mui/material";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import BlockOutlinedIcon    from "@mui/icons-material/BlockOutlined";
import { T } from "../Theme";

/**
 * ApprovalCard — a single pending-approval row
 *
 * item shape: { id, title, badge, image, submittedBy, timeLabel }
 * actionStatus: undefined | "approving" | "rejecting"
 */
export default function ApprovalCard({ item, actionStatus, onViewDetails, onApprove, onReject }) {
    const isApproving = actionStatus === "approving";
    const isRejecting = actionStatus === "rejecting";
    const isBusy = isApproving || isRejecting;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 3,
                mb: 2.5,
                bgcolor: T.cardBg,
                border: `1px solid ${T.border}`,
                borderRadius: "12px",
            }}
        >
            <Avatar
                src={item.image}
                alt={item.title}
                variant="rounded"
                sx={{ width: 72, height: 72, bgcolor: T.avatarBg, borderRadius: "10px", filter: T.avatarFilter }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: T.textPrimary }}>
                        {item.title}
                    </Typography>
                    <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            color: T.goldLabel,
                            bgcolor: "transparent",
                            border: `1px solid ${T.infoBorder}`,
                        }}
                    />
                </Box>

                <Typography sx={{ color: T.textMuted, fontSize: "0.85rem", mt: 0.75 }}>
                    Submitted by:{" "}
                    <Box component="span" sx={{ color: T.textPrimary, fontWeight: 600 }}>
                        {item.submittedBy}
                    </Box>
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75, color: T.textMuted }}>
                    <ScheduleOutlinedIcon sx={{ fontSize: 15 }} />
                    <Typography sx={{ fontSize: "0.78rem" }}>{item.timeLabel}</Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                <Button
                    variant="outlined"
                    onClick={() => onViewDetails(item)}
                    sx={{
                        borderColor: T.inputBorder,
                        color: T.textPrimary,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        px: 2.2,
                        "&:hover": { borderColor: T.gold, bgcolor: "transparent" },
                    }}
                >
                    View Details
                </Button>

                <Button
                    variant="contained"
                    disabled={isBusy}
                    onClick={() => onApprove(item.id)}
                    sx={{
                        bgcolor: T.gold,
                        color: T.btnText,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        px: 2.2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: T.goldHover, boxShadow: "none" },
                    }}
                >
                    {isApproving ? <CircularProgress size={16} sx={{ color: T.btnText }} /> : "Approve"}
                </Button>

                <IconButton
                    disabled={isBusy}
                    onClick={() => onReject(item.id)}
                    sx={{
                        color: "#C0392B",
                        border: "1.5px solid #E0B4AC",
                        width: 36,
                        height: 36,
                        "&:hover": { bgcolor: "transparent", borderColor: "#C0392B" },
                    }}
                >
                    {isRejecting ? <CircularProgress size={16} sx={{ color: "#C0392B" }} /> : <BlockOutlinedIcon fontSize="small" />}
                </IconButton>
            </Box>
        </Box>
    );
}
