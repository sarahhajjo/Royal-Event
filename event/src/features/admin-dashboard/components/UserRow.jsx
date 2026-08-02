import React from "react";
import { Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const T = {
    border:      "#E8DFC8",
    gold:        "#8a6f28",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
    avatarBg:    "#F2EFE8",
};

export default function UserRow({ user, showDivider, onInfo }) {
    const contactInfo = user.email ? user.email : (user.phone ? user.phone : "No Contact Info");
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <Box>
            {/* 🚀 جعلنا الحاوية كاملة قابلة للضغط وأضفنا تأثير Hover */}
            <Box
                onClick={() => onInfo(user.id)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 3,
                    py: 2.5,
                    gap: 2.5,
                    cursor: "pointer", // شكل اليد
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        backgroundColor: "rgba(138, 111, 40, 0.04)" // لون ذهبي خفيف جداً عند التمرير
                    }
                }}
            >
                <Box sx={{ width: 54, flexShrink: 0 }}>
                    <Avatar
                        src={user.avatarUrl}
                        sx={{ width: 42, height: 42, bgcolor: T.avatarBg, color: T.gold, fontSize: "1rem", fontWeight: 600 }}
                    >
                        {initial}
                    </Avatar>
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography sx={{ color: T.textPrimary, fontSize: "0.95rem", fontWeight: 600 }}>
                        {user.name}
                    </Typography>
                    <Typography sx={{ color: T.textMuted, fontSize: "0.75rem", fontWeight: 500 }}>
                        {user.title || "Customer"}
                    </Typography>
                </Box>

                <Box sx={{ width: 250, display: "flex", alignItems: "center" }}>
                    <Typography sx={{ color: T.textMuted, fontSize: "0.85rem", fontWeight: 500 }}>
                        {contactInfo}
                    </Typography>
                </Box>

                <Box sx={{ width: 30, ml: 1, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                    {/* الزر هنا سيقوم بتفعيل نفس الدالة أيضاً */}
                    <IconButton size="small" sx={{ color: T.gold }}>
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>

            </Box>

            {showDivider && <Divider sx={{ borderColor: T.border, mx: 3 }} />}
        </Box>
    );
}