import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Button } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { T, typography } from "../Theme.jsx";

const TABS = ["PRODUCTS", "HALLS FOR RENT", "READY ARRANGEMENTS"];

const RejectedCard = ({ listing }) => (
    <Box sx={{ display: "flex", gap: 0, border: `1px solid ${T.border}`,
        borderRadius: "10px", overflow: "hidden", bgcolor: T.cardBg }}>

        {/* Image */}
        <Box sx={{ width: 160, minHeight: 170, flexShrink: 0, position: "relative", bgcolor: "#1a1a1a" }}>
            {listing?.imageUrl
                ? <img src={listing.imageUrl} alt={listing.name}
                       style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute",
                           top: 0, left: 0, filter: "brightness(0.7)" }} />
                : <Box sx={{ width: "100%", height: "100%", bgcolor: "#2a2a2a" }} />}
            {/* REJECTED badge */}
            <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#D32F2F",
                px: 1, py: 0.3, borderRadius: "4px" }}>
                <Typography sx={{ fontSize: "0.58rem", fontWeight: 700, color: "#fff",
                    letterSpacing: 1, textTransform: "uppercase" }}>REJECTED</Typography>
            </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
                <Typography sx={{ ...typography.colHeader, color: T.textMuted, mb: 0.8 }}>
                    {listing?.category || "VENUE"}
                </Typography>
                <Typography sx={{ ...typography.rowName, fontSize: "1rem", color: T.textPrimary, mb: 1.5 }}>
                    {listing?.name || "—"}
                </Typography>

                {/* Rejection reason box */}
                {listing?.rejectionReason && (
                    <Box sx={{ borderLeft: `3px solid #E57373`, bgcolor: "#FFF5F5",
                        borderRadius: "0 6px 6px 0", px: 1.8, py: 1.2 }}>
                        <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#D32F2F",
                            letterSpacing: 1, textTransform: "uppercase", mb: 0.5 }}>
                            REASON FOR REJECTION
                        </Typography>
                        <Typography sx={{ fontSize: "0.82rem", color: "#7A6F5E", lineHeight: 1.6 }}>
                            {listing.rejectionReason}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                <Button variant="contained" disableElevation size="small"
                        sx={{ bgcolor: T.goldLabel, color: T.btnText, fontSize: "0.7rem", fontWeight: 700,
                            letterSpacing: 1, px: 3, py: 0.8, borderRadius: "8px", "&:hover": { bgcolor: T.gold } }}>
                    ACCEPT
                </Button>
                <Button variant="outlined" size="small"
                        sx={{ borderColor: T.inputBorder, color: T.textPrimary, fontSize: "0.7rem", fontWeight: 600,
                            letterSpacing: 1, px: 3, py: 0.8, borderRadius: "8px",
                            "&:hover": { borderColor: T.gold, color: T.gold } }}>
                    REJECT
                </Button>
            </Box>
        </Box>
    </Box>
);

const RejectedListings = ({ listings = [] }) => {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <CancelOutlinedIcon sx={{ color: "#D32F2F", fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Rejected Listings
                </Typography>
            </Box>

            <Box sx={{ borderBottom: `1.5px solid ${T.border}`, mb: 3 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                    minHeight: 36,
                    "& .MuiTabs-indicator": { backgroundColor: T.gold, height: "2px" },
                    "& .MuiTab-root": { ...typography.colHeader, color: T.textMuted, minHeight: 36,
                        px: 0, mr: 4, "&.Mui-selected": { color: T.gold } },
                }}>
                    {TABS.map(t => <Tab key={t} label={t} disableRipple />)}
                </Tabs>
            </Box>

            {listings.length === 0
                ? <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography sx={{ color: T.textMuted, fontSize: "0.85rem" }}>No rejected listings.</Typography>
                </Box>
                : <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {listings.map((l, i) => <RejectedCard key={l.id ?? i} listing={l} />)}
                </Box>}
        </Box>
    );
};

export default RejectedListings;