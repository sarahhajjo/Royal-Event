import React from "react";
import { useNavigate } from "react-router-dom"; // 1. أضف هذا السطر
import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { T, typography, infoButtonSx, avatarBaseSx, rowWrapperSx } from "../Theme";

export default function UserRow({ user, showDivider = true, onInfo }) {
    const { id, name, avatarUrl, avatarLetter, title, email, phone } = user;
    const navigate = useNavigate(); // 2. عرف الـ hook

    return (
        <>
            {/* 3. أضف onClick هنا للـ Box الرئيسي */}
            <Box
                sx={{ ...rowWrapperSx, cursor: 'pointer', '&:hover': { bgcolor: '#f5f2eb' } }}
                onClick={() => navigate(`/admin-dashboard/user/${id}`)}
            >
                {/* Portrait */}
                <Avatar
                    src={avatarUrl}
                    alt={name}
                    variant="rounded"
                    sx={{
                        ...avatarBaseSx,
                        width:  54,
                        height: 54,
                        filter: avatarUrl ? T.avatarFilter : "none",
                    }}
                >
                    {!avatarUrl && (avatarLetter ?? name?.[0])}
                </Avatar>

                {/* Identity */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ ...typography.rowName, color: T.textPrimary }}>
                        {name}
                    </Typography>
                    <Typography sx={{ ...typography.rowSub }}>
                        {title}
                    </Typography>
                </Box>

                {/* Correspondence */}
                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography sx={{ ...typography.rowContact }}>{email}</Typography>
                    {phone && <Typography sx={{ ...typography.rowContact }}>{phone}</Typography>}
                </Box>

                {/* Info */}
                <IconButton size="small" onClick={(e) => {
                    e.stopPropagation(); // يمنع تفعيل الـ onClick الخاص بالصف عند الضغط على أيقونة المعلومات
                    onInfo?.(id);
                }} sx={infoButtonSx}>
                    <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                </IconButton>
            </Box>

            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </>
    );
}