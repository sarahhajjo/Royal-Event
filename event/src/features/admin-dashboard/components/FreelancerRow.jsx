import React, { useState } from "react";
import {
    Box, Avatar, Typography, IconButton,
    Divider, Button, Collapse, TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { T, typography, infoButtonSx, avatarBaseSx } from "../Theme";

export default function FreelancerRow({ freelancer, showDivider = true, onInfo, onUpdateStatus, onClick }) {
    // 1. استخراج آمن للبيانات
    const { id, user, brand_name, moderation_status } = freelancer;

    // استخراج الاسم و الصورة (تأكد أن مسار الصورة موجود في الـ API)
    const rep = user ? `${user.first_name} ${user.last_name}` : "N/A";
    const avatarUrl = user?.avatar_url || null; // معالجة خطأ avatarUrl is not defined

    const currentStatus = moderation_status === 'approved' ? 'Accepted'
        : moderation_status === 'rejected' ? 'Rejected'
            : 'Pending';

    const [showRejectField, setShowRejectField] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState(false);

    const handleRejectClick = (e) => { e.stopPropagation(); setShowRejectField(true); };
    const handleCancelReject = (e) => { e.stopPropagation(); setShowRejectField(false); setReason(""); };

    const handleConfirmReject = (e) => {
        e.stopPropagation();
        if (!reason.trim()) { setReasonError(true); return; }
        onUpdateStatus(id, "rejected", reason.trim());
        setShowRejectField(false);
    };

    return (
        <>
            <Box
                onClick={() => onClick?.(id)}
                sx={{
                    display: "flex", flexDirection: "column", width: "100%",
                    cursor: "pointer", transition: "background 0.15s",
                    "&:hover": { bgcolor: T.rowHover || "#F3EDE0" },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2, px: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                        {/* استخدام avatarUrl المعرف أعلاه */}
                        <Avatar src={avatarUrl} variant="rounded" sx={{ ...avatarBaseSx, width: 45, height: 45 }}>
                            {!avatarUrl && rep.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.97rem", color: T.textPrimary }}>{rep}</Typography>
                            <Typography sx={{ fontSize: "0.8rem", color: T.textMuted }}>
                                {user?.email || "No email"} • {user?.phone || "No phone"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: "center", px: 2 }}>
                        <Typography sx={{ ...typography.colHeader, mb: 0.3 }}>Brand Name</Typography>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: T.textPrimary }}>
                            {brand_name || "N/A"}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", flex: 1 }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={() => onInfo?.(id)} sx={infoButtonSx}>
                            <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                        </IconButton>

                        {/* أزرار بدون تداخل (بدون nested button) */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {currentStatus === "Pending" && !showRejectField && (
                                <>
                                    <Button variant="contained" disableElevation size="small"
                                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(id, "approved"); }}
                                            sx={{ bgcolor: T.goldLabel, color: T.btnText, borderRadius: "8px", fontSize: "0.72rem" }}>
                                        ACCEPT
                                    </Button>
                                    <Button variant="outlined" size="small" onClick={handleRejectClick}
                                            sx={{ borderColor: T.inputBorder, color: T.textPrimary, borderRadius: "8px", fontSize: "0.72rem" }}>
                                        REJECT
                                    </Button>
                                </>
                            )}
                            {currentStatus === "Pending" && showRejectField && (
                                <Button variant="text" size="small" onClick={handleCancelReject} startIcon={<CloseOutlinedIcon />}>CANCEL</Button>
                            )}
                            {(currentStatus === "Accepted" || currentStatus === "Rejected") && (
                                <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", color: currentStatus === "Accepted" ? "#388E3C" : "#D32F2F" }}>
                                    {currentStatus.toUpperCase()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </>
    );
}