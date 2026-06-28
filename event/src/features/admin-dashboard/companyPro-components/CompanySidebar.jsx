import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon    from "@mui/icons-material/LocationOnOutlined";
import { T, typography } from "../theme";

const CompanySidebar = ({ data }) => {
    const isActive    = data?.moderation_status === "approved";
    const isFlagged   = data?.moderation_status === "flagged";
    const joinDate    = data?.created_at
        ? new Date(data.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "—";

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", overflow: "hidden", backgroundColor: T.sidebarBg }}>

            {/* ── Cover image ── */}
            <Box sx={{ width: "100%", height: 140, backgroundColor: T.avatarBg, overflow: "hidden" }}>
                {data?.cover_url
                    ? <img src={data.cover_url} alt="cover"
                           style={{ width: "100%", height: "100%", objectFit: "cover", filter: T.avatarFilter }} />
                    : <Box sx={{ width: "100%", height: "100%", bgcolor: T.avatarBg,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ ...typography.sectionLabel, fontSize: "0.58rem", color: T.textMuted,
                            textAlign: "center", lineHeight: 2 }}>COMPANY PROFILE</Typography>
                    </Box>}
            </Box>

            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.8 }}>

                {/* ── Brand name + type ── */}
                <Box>
                    <Typography sx={{ ...typography.rowName, fontSize: "1.05rem", color: T.textPrimary }}>
                        {data?.brand_name || "—"}
                    </Typography>
                    <Typography sx={{ ...typography.rowSub, mt: 0.4 }}>
                        {data?.provider_type === "company" ? "COMPANY" : data?.provider_type?.toUpperCase() || "—"}
                    </Typography>
                </Box>

                {/* ── Badges ── */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {/* Verification badge */}
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6,
                        border: `1px solid ${T.goldLabel}`, borderRadius: "20px", px: 1.4, py: 0.4, bgcolor: "#FFF8E7" }}>
                        <Typography sx={{ ...typography.sectionLabel, fontSize: "0.6rem", color: T.goldLabel }}>
                            {data?.is_verified ? "VERIFIED" : "UNVERIFIED"}
                        </Typography>
                    </Box>
                    {/* Moderation status */}
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6,
                        border: `1px solid ${T.border}`, borderRadius: "20px", px: 1.4, py: 0.4, bgcolor: T.pageBg }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%",
                            backgroundColor: isActive ? "#4CAF50" : isFlagged ? "#E8B84B" : "#9E9E9E" }} />
                        <Typography sx={{ ...typography.sectionLabel, fontSize: "0.6rem", color: T.textMuted }}>
                            {data?.moderation_status?.toUpperCase() || "PENDING"}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: T.border }} />

                {/* ── Join Date ── */}
                <Box>
                    <Typography sx={{ ...typography.colHeader, mb: 0.5 }}>JOIN DATE</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 12, color: T.textMuted }} />
                        <Typography sx={{ fontSize: "0.85rem", color: T.textPrimary }}>{joinDate}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: T.border }} />

                {/* ── Location ── */}
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                        <LocationOnOutlinedIcon sx={{ color: T.gold, fontSize: 16 }} />
                        <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2 }}>
                            Location
                        </Typography>
                    </Box>
                    <Typography sx={{ ...typography.colHeader, mb: 0.5 }}>CITY</Typography>
                    <Typography sx={{ fontSize: "0.88rem", color: T.textPrimary, mb: 1.5 }}>
                        {data?.user?.city_id ? `City ID: ${data.user.city_id}` : "—"}
                    </Typography>
                    {/* Map placeholder */}
                    <Box sx={{ width: "100%", height: 100, borderRadius: "8px", overflow: "hidden",
                        border: `1px solid ${T.border}`,
                        background: "linear-gradient(135deg, #E8DFC8 0%, #D4C9A8 50%, #C9BA90 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LocationOnOutlinedIcon sx={{ color: T.goldLabel, fontSize: 28, opacity: 0.6 }} />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default CompanySidebar;