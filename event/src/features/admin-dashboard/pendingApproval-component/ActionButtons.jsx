import React from "react";
import { Box, Button, Typography } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { T, typography } from "../theme"; // تأكد من المسار

export default function ActionButtons({ onApprove, onReject, onViewDetails }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 120 }}>
            {/* زر الموافقة - مطابق لتصميم Accept */}
            <Button
                variant="contained"
                disableElevation
                size="small"
                onClick={onApprove}
                //startIcon={<TaskAltIcon sx={{ fontSize: 14 }} />}
                sx={{
                    bgcolor: T.goldLabel,
                    color: T.btnText,
                    borderRadius: "8px",
                    fontSize: "0.72rem",
                    py: 0.8,
                    "&:hover": { bgcolor: T.goldHover }
                }}
            >
                APPROVE
            </Button>

            {/* زر الرفض - مطابق لتصميم Reject */}
            <Button
                variant="outlined"
                size="small"
                onClick={onReject}
               // startIcon={<HighlightOffOutlinedIcon sx={{ fontSize: 14 }} />}
                sx={{
                    borderColor: T.inputBorder,
                    color: T.textPrimary,
                    borderRadius: "8px",
                    fontSize: "0.72rem",
                    py: 0.8,
                    "&:hover": { borderColor: T.goldLabel, bgcolor: T.rowHover }
                }}
            >
                REJECT
            </Button>

            {/* رابط التفاصيل */}
            <Typography
                onClick={onViewDetails}
                sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    mt: 0.5,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: T.textMuted,
                    "&:hover": { color: T.gold }
                }}
            >
                VIEW DETAILS
            </Typography>
        </Box>
    );
}