import React, { useState } from "react";
import {
    Box, Avatar, Typography, IconButton, Divider, Button,
    Collapse, TextField
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { T, typography, infoButtonSx, avatarBaseSx } from "../Theme";
import { useNavigate } from "react-router-dom";
export default function CompanyRow({ company, showDivider = true, onInfo, onUpdateStatus }) {
    const { id, brand_name, moderation_status, user } = company;
    const name = brand_name;
    const rep = user ? `${user.first_name} ${user.last_name}` : "N/A";
    const email = user ? user.email : "No email";
    const phone = user ? user.phone : "No phone";
    const navigate = useNavigate();
    const status = moderation_status === 'approved' ? 'Accepted' :
        moderation_status === 'rejected' ? 'Rejected' : 'Pending';

    // ── منطق الرفض ──
    const [showRejectField, setShowRejectField] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState(false);

    const handleConfirmReject = () => {
        if (!reason.trim()) {
            setReasonError(true);
            return;
        }
        onUpdateStatus(id, "rejected", reason.trim()); // إرسال السبب للـ Backend
        setShowRejectField(false);
    };

    return (
        <>
            <Box
                // 💡 تمرير الـ id الفعلي للشركة ديناميكياً بدلاً من النص الثابت (:id)
                onClick={() => navigate(`/admin-dashboard/company/${id}`)}
                sx={{
                    cursor: "pointer",  display: "flex", flexDirection: "column", width: "100%",
                    transition: "background 0.15s",
                    "&:hover": { bgcolor: T.rowHover || "#F3EDE0" }
                }}>

                {/* ── الجزء العلوي (البيانات والأزرار) ── */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2, px: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                        <Avatar variant="rounded" sx={{ ...avatarBaseSx, width: 45, height: 45 }}>
                            {name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.97rem" }}>{rep}</Typography>
                            <Typography sx={{ ...typography.rowContact }}>{email}</Typography>
                            <Typography sx={{ ...typography.rowContact }}>{phone}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlignment: "center", px: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.97rem" }}>{name?.toUpperCase()}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", flex: 1 }}>
                        {/* 💡 منع انتشار الحدث (e.stopPropagation) عند النقر على أيقونة المعلومات */}
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onInfo?.(id); }} sx={infoButtonSx}>
                            <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                        </IconButton>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {status === "Pending" && !showRejectField && (
                                <>
                                    {/* 💡 منع انتشار الحدث لكي لا يفتح بروفايل الشركة عند الضغط على أزرار القبول/الرفض */}
                                    <Button variant="contained" disableElevation size="small"
                                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(id, "approved"); }}
                                            sx={{ bgcolor: T.goldLabel, color: T.btnText, fontSize: "0.72rem", px: 3, py: 0.8, borderRadius: "8px", "&:hover": { bgcolor: T.gold } }}>
                                        ACCEPT
                                    </Button>
                                    <Button variant="outlined" size="small"
                                            onClick={(e) => { e.stopPropagation(); setShowRejectField(true); }}
                                            sx={{ borderColor: T.inputBorder, color: T.textPrimary, fontSize: "0.72rem", px: 3, py: 0.8, borderRadius: "8px" }}>
                                        REJECT
                                    </Button>
                                </>
                            )}

                            {status === "Pending" && showRejectField && (
                                <Button variant="text" size="small" onClick={(e) => { e.stopPropagation(); setShowRejectField(false); }} startIcon={<CloseOutlinedIcon />} sx={{ color: T.textMuted }}>
                                    CANCEL
                                </Button>
                            )}

                            {status === "Rejected" && <Typography sx={{ color: "#D32F2F", fontWeight: 700, fontSize: "0.75rem" }}>Rejected</Typography>}
                            {status === "Accepted" && <Typography sx={{ color: "#388E3C", fontWeight: 700, fontSize: "0.75rem" }}>Accepted</Typography>}
                        </Box>
                    </Box>
                </Box>

                {/* ── حقل سبب الرفض ── */}
                <Collapse in={showRejectField} timeout={200} sx={{ width: "100%" }}>
                    <Box sx={{ px: 3, pb: 2.5, pt: 0.5 }} onClick={(e) => e.stopPropagation()}>
                        <Typography sx={{ ...typography.colHeader, mb: 1, color: "#D32F2F" }}>
                            REJECTION REASON *
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                            <TextField
                                fullWidth
                                multiline
                                size="small"
                                placeholder="Please provide a reason for rejection..."
                                value={reason}
                                onChange={(e) => { setReason(e.target.value); setReasonError(false); }}
                                error={reasonError}
                                helperText={reasonError ? "Reason is required before rejecting." : ""}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "transparent",
                                        borderRadius: "6px",
                                        fontSize: "0.83rem",
                                        color: T.textPrimary,
                                        "& fieldset": { borderColor: reasonError ? "#D32F2F" : "#C8BA90" },
                                        "&:hover fieldset": { borderColor: T.gold + "99" },
                                        "&.Mui-focused fieldset": { borderColor: reasonError ? "#D32F2F" : T.gold },
                                    },
                                    "& textarea::placeholder": { color: T.textMuted, opacity: 1, fontSize: "0.8rem" },
                                }}
                            />
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={handleConfirmReject}
                                endIcon={<SendOutlinedIcon sx={{ fontSize: 15 }} />}
                                sx={{
                                    bgcolor: "#D32F2F",
                                    color: "#fff",
                                    fontSize: "0.72rem",
                                    px: 2.5,
                                    py: 1.1,
                                    borderRadius: "6px",
                                    whiteSpace: "nowrap",
                                    "&:hover": { bgcolor: "#b71c1c" },
                                }}
                            >
                                CONFIRM
                            </Button>
                        </Box>
                    </Box>
                </Collapse>
            </Box>
            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </>
    );
}