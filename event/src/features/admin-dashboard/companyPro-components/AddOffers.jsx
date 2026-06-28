import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider, Button } from "@mui/material";
// حذفت استيراد المكتبة تماماً
import { T, typography } from "../Theme.jsx";

const TABS = ["ACTIVE OFFERS", "EXPIRED OFFERS"];

// أيقونات بديلة بسيطة (Unicode)
const Icons = {
    Work: () => <Typography sx={{ fontSize: 20 }}>💼</Typography>,
    People: () => <Typography sx={{ fontSize: 13 }}>👥</Typography>,
    Calendar: () => <Typography sx={{ fontSize: 13 }}>📅</Typography>,
};

const OfferRow = ({ offer }) => (
    <Box sx={{ py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
            <Box>
                <Typography sx={{ ...typography.colHeader, color: T.goldLabel, mb: 0.5 }}>
                    {offer?.type || "FULL-TIME"}
                </Typography>
                <Typography sx={{ ...typography.rowName, fontSize: "1.05rem", color: T.textPrimary }}>
                    {offer?.title || "—"}
                </Typography>
            </Box>
            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: T.textPrimary }}>
                    {offer?.salary || "—"}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: T.textMuted, mt: 0.2 }}>
                    {offer?.location || "—"}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Icons.People />
                <Typography sx={{ fontSize: "0.78rem", color: T.textMuted }}>
                    {offer?.applicants ?? 0} Applicants
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Icons.Calendar />
                <Typography sx={{ fontSize: "0.78rem", color: T.textMuted }}>
                    Posted {offer?.postedAgo || "—"}
                </Typography>
            </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button variant="contained" disableElevation size="small"
                    sx={{ bgcolor: T.gold, color: T.btnText, fontSize: "0.7rem", fontWeight: 700,
                        letterSpacing: 1, px: 3, py: 0.9, borderRadius: "8px", "&:hover": { bgcolor: T.goldHover } }}>
                VIEW APPLICANTS
            </Button>
            <Button variant="outlined" size="small"
                    sx={{ borderColor: T.inputBorder, color: T.textPrimary, fontSize: "0.7rem", fontWeight: 600,
                        letterSpacing: 1, px: 3, py: 0.9, borderRadius: "8px",
                        "&:hover": { borderColor: T.gold, color: T.gold } }}>
                EDIT OFFER
            </Button>
        </Box>
    </Box>
);

const AddOffers = ({ activeOffers = [], expiredOffers = [] }) => {
    const [tab, setTab] = useState(0);
    const offers = tab === 0 ? activeOffers : expiredOffers;

    return (
        <Box sx={{ border: `1.5px solid ${T.border}`, borderRadius: "14px", p: 4, backgroundColor: T.cardBg }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Icons.Work />
                <Typography sx={{ ...typography.sectionLabel, color: T.textPrimary, letterSpacing: 2.5 }}>
                    Job Offers
                </Typography>
            </Box>

            <Box sx={{ borderBottom: `1.5px solid ${T.border}`, mb: 0 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                    minHeight: 36,
                    "& .MuiTabs-indicator": { backgroundColor: T.gold, height: "2px" },
                    "& .MuiTab-root": { ...typography.colHeader, color: T.textMuted, minHeight: 36,
                        px: 0, mr: 4, "&.Mui-selected": { color: T.gold } },
                }}>
                    {TABS.map(t => <Tab key={t} label={t} disableRipple />)}
                </Tabs>
            </Box>

            {offers.length === 0
                ? <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography sx={{ color: T.textMuted, fontSize: "0.85rem" }}>No offers found.</Typography>
                </Box>
                : offers.map((offer, idx) => (
                    <React.Fragment key={offer.id ?? idx}>
                        <OfferRow offer={offer} />
                        {idx < offers.length - 1 && <Divider sx={{ borderColor: T.border }} />}
                    </React.Fragment>
                ))}
        </Box>
    );
};

export default AddOffers;