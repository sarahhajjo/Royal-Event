import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider, Button } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { T, typography } from "../Theme.jsx";

const TABS = ["PRODUCTS", "HALLS FOR RENT", "READY ARRANGEMENTS"];

const ListingCard = ({ listing }) => (
    <Box sx={{ display: "flex", gap: 0, border: `1px solid ${T.border}`,
        borderRadius: "10px", overflow: "hidden", bgcolor: T.cardBg }}>

        {/* Image */}
        <Box sx={{ width: 160, minHeight: 160, flexShrink: 0, position: "relative", bgcolor: T.avatarBg }}>
            {listing?.imageUrl
                ? <img src={listing.imageUrl} alt={listing.name}
                       style={{ width: "100%", height: "100%", objectFit: "cover", filter: T.avatarFilter,
                           position: "absolute", top: 0, left: 0 }} />
                : <Box sx={{ width: "100%", height: "100%", bgcolor: "#2a2a2a" }} />}
            {/* FEATURED badge */}
            {listing?.featured && (
                <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: "#1C1712",
                    px: 1, py: 0.3, borderRadius: "4px" }}>
                    <Typography sx={{ fontSize: "0.58rem", fontWeight: 700, color: "#fff",
                        letterSpacing: 1, textTransform: "uppercase" }}>FEATURED</Typography>
                </Box>
            )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Box>
                {/* Category label + Active badge */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography sx={{ ...typography.colHeader, color: T.textMuted }}>{listing?.category || "INTERIOR"}</Typography>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5,
                        bgcolor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "6px", px: 1, py: 0.3 }}>
                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#388E3C",
                            letterSpacing: 0.8, textTransform: "uppercase" }}>Active</Typography>
                    </Box>
                </Box>
                <Typography sx={{ ...typography.rowName, fontSize: "1rem", color: T.textPrimary, mb: 0.5 }}>
                    {listing?.name || "—"}
                </Typography>
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

const AcceptedListings = ({ listings = [] }) => {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <VerifiedIcon sx={{ color: T.gold, fontSize: 20 }} />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Accepted Listings
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
                    <Typography sx={{ color: T.textMuted, fontSize: "0.85rem" }}>No accepted listings.</Typography>
                </Box>
                : <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {listings.map((l, i) => <ListingCard key={l.id ?? i} listing={l} />)}
                </Box>}
        </Box>
    );
};

export default AcceptedListings;