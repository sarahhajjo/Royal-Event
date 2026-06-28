import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { T, typography } from "../Theme";

const ProfileSidebar = ({ user }) => {
    return (
        <Box
            sx={{
                border: `1.5px solid ${T.border}`,
                borderRadius: "14px",
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                backgroundColor: T.sidebarBg,
            }}
        >
            {/* ── Avatar box ── */}
            <Box
                sx={{
                    width: 140,
                    height: 160,
                    border: `2px dashed ${T.borderLight}`,
                    borderRadius: "10px",
                    backgroundColor: T.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {user?.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt="profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: T.avatarFilter }}
                    />
                ) : (
                    <Typography
                        sx={{
                            ...typography.sectionLabel,
                            textAlign: "center",
                            lineHeight: 1.9,
                            color: T.textMuted,
                            fontSize: "0.62rem",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {"1-firstname\n2-lastname\n3-birthday\n4-email OR phone\n5-contact no.\n6-password\n7-confirm password\n8-province"}
                    </Typography>
                )}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: T.gold,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CameraAltOutlinedIcon sx={{ color: T.btnText, fontSize: 15 }} />
                </Box>
            </Box>

            {/* ── Name + Account ID ── */}
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ ...typography.rowName, fontSize: "1.25rem", color: T.textPrimary }}>
                    {user?.firstName} {user?.lastName}
                </Typography>
                <Typography sx={{ ...typography.rowSub, letterSpacing: 1.2, mt: 0.5 }}>
                    ACCOUNT ID: #{user?.accountId}
                </Typography>
            </Box>

            {/* ── Active badge ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    border: `1px solid ${T.border}`,
                    borderRadius: "20px",
                    px: 2,
                    py: 0.6,
                    backgroundColor: T.pageBg,
                }}
            >
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#4CAF50" }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textMuted, letterSpacing: 1.5 }}>
                    ACTIVE
                </Typography>
            </Box>

            <Divider sx={{ width: "100%", borderColor: T.border }} />

            {/* ── Member Since ── */}
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <Typography sx={{ ...typography.sectionLabel, color: T.textMuted }}>
                    MEMBER SINCE
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: T.textPrimary }}>
                    {user?.memberSince}
                </Typography>
            </Box>
        </Box>
    );
};

export default ProfileSidebar;