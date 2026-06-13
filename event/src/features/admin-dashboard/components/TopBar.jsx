import React from "react";
import {
    Box, Typography, IconButton,
    Avatar, Badge, Divider,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    headerBg:    "#FDFAF4",
    border:      "#E0D5BC",
    gold:        "#8a6f28",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
    avatarColor: "#FFFFFF",
};

/**
 * TopBar — shared across all pages, fixed light-mode colors
 *
 * Props:
 *   title         – page title string shown on the left (gold)
 *   user          – { name: string, role: string, avatarUrl?: string }
 *   notifCount    – number of unread notifications (0 = no badge)
 *   onNotifClick  – () => void
 *   onAvatarClick – () => void
 */
export default function TopBar({
                                   title = "Elite Admin",
                                   user = { name: "Admin", role: "SUPERUSER" },
                                   notifCount = 0,
                                   onNotifClick,
                                   onAvatarClick,
                               }) {
    return (
        <Box
            component="header"
            sx={{
                position: "fixed",
                top: 0,
                left: 240,
                right: 0,
                height: 64,
                bgcolor: T.headerBg,
                borderBottom: `1px solid ${T.border}`,
                zIndex: 99,
                display: "flex",
                alignItems: "center",
                px: 4,
                gap: 2,
            }}
        >
            {/* Page title */}
            <Typography
                sx={{
                    color: T.gold,
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    flex: 1,
                    letterSpacing: 0.3,
                }}
            >
                {title}
            </Typography>

            {/* Right side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Notification bell */}
                <IconButton
                    onClick={onNotifClick}
                    size="small"
                    sx={{
                        color: T.textMuted,
                        "&:hover": { color: T.gold },
                    }}
                >
                    <Badge
                        badgeContent={notifCount > 0 ? notifCount : null}
                        color="error"
                        sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem", height: 16, minWidth: 16 } }}
                    >
                        <NotificationsNoneOutlinedIcon fontSize="small" />
                    </Badge>
                </IconButton>

                <Divider orientation="vertical" flexItem sx={{ borderColor: T.border, mx: 0.5 }} />

                {/* User info + avatar */}
                <Box
                    onClick={onAvatarClick}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        cursor: "pointer",
                        "&:hover .topbar-avatar": { borderColor: T.gold },
                    }}
                >
                    <Box sx={{ textAlign: "right" }}>
                        <Typography
                            sx={{
                                color: T.textPrimary,
                                fontWeight: 700,
                                fontSize: "0.83rem",
                                lineHeight: 1.2,
                            }}
                        >
                            {user.name}
                        </Typography>
                        <Typography
                            sx={{
                                color: T.textMuted,
                                fontSize: "0.65rem",
                                letterSpacing: 1.2,
                                textTransform: "uppercase",
                            }}
                        >
                            {user.role}
                        </Typography>
                    </Box>

                    <Avatar
                        className="topbar-avatar"
                        src={user.avatarUrl}
                        alt={user.name}
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: T.gold,
                            color: T.avatarColor,
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            border: "2px solid transparent",
                            transition: "border-color 0.2s",
                            filter: user.avatarUrl ? "sepia(15%) contrast(1.05)" : "none",
                        }}
                    >
                        {!user.avatarUrl && user.name?.[0]}
                    </Avatar>
                </Box>
            </Box>
        </Box>
    );
}
