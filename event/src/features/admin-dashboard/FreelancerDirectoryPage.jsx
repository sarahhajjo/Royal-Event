import React, { useState, useMemo } from "react";
import {
    Box, Typography, TextField, InputAdornment,
    Divider, Button,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon   from "@mui/icons-material/TuneOutlined";
import SortOutlinedIcon   from "@mui/icons-material/SortOutlined";

// ── Shared layout components ──────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";   // adjust path to your project structure
import TopBar  from "./components/TopBar";

// ── Page-specific component ───────────────────────────────────────────────────
import FreelancerRow from "./components/FreelancerRow";

// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    pageBg:      "#FAF7F0",
    border:      "#E8DFC8",
    gold:        "#8a6f28",
    goldLabel:   "#A89450",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
};

// ── Demo data (swap with useSelector later) ───────────────────────────────────
const ALL_FREELANCERS = [
    { id: 1,  name: "Alexander Sterling", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80", contact: "a.sterling@aurelian-partners.com", expertise: "Asset Management" },
    { id: 2,  name: "Helena Vane",        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80", contact: "+44 20 7946 0128",                 expertise: "Strategic Compliance" },
    { id: 3,  name: "Marcus Thorne",      avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&q=80", contact: "m.thorne@thames-ledger.com",       expertise: "Tax Architecture" },
    { id: 4,  name: "Sophia Laurent",     avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80", contact: "s.laurent@heritage-ops.com",       expertise: "Crisis Communications" },
    { id: 5,  name: "Julian Pembroke",    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80", contact: "pembroke.j@aurelian-reserve.com",  expertise: "Risk Mitigation" },
    { id: 6,  name: "Isabelle Cross",     avatarUrl: "https://images.unsplash.com/photo-1487530811015-780eeecb5b87?w=120&q=80", contact: "i.cross@crossventures.com",        expertise: "Wealth Structuring" },
    { id: 7,  name: "Damien Ashworth",    avatarLetter: "D",                                                                    contact: "d.ashworth@meridian.co",           expertise: "Corporate Governance" },
    { id: 8,  name: "Reina Valcourt",     avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80", contact: "r.valcourt@prestige-ib.com",       expertise: "Private Equity" },
    { id: 9,  name: "Charles Montfort",   avatarLetter: "C",                                                                    contact: "c.montfort@montfort-adv.com",      expertise: "Due Diligence" },
    { id: 10, name: "Nadia Osei",         avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80", contact: "n.osei@osei-capital.com",          expertise: "Regulatory Affairs" },
    { id: 11, name: "Felix Brandow",      avatarLetter: "F",                                                                    contact: "f.brandow@brandow-co.com",         expertise: "Investment Strategy" },
    { id: 12, name: "Miriam Steele",      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",    contact: "m.steele@steele-consult.com",       expertise: "Mergers & Acquisitions" },
];

export default function FreelancerDirectoryPage({ onNavClick, activeNav = "Freelancers" }) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return ALL_FREELANCERS;
        const q = search.toLowerCase();
        return ALL_FREELANCERS.filter(
            (f) =>
                f.name.toLowerCase().includes(q) ||
                f.expertise.toLowerCase().includes(q) ||
                f.contact?.toLowerCase().includes(q)
        );
    }, [search]);

    const handleSearch = (e) => { setSearch(e.target.value); };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            {/* Shared Sidebar */}
            <Sidebar
                activeItem={activeNav}
                onNavClick={onNavClick}
                onCreateEvent={() => console.log("Create Event")}
            />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>

                {/* Shared TopBar */}
                <TopBar
                    title="Freelancer Directory"
                    user={{ name: "Admin", role: "Superuser" }}
                    notifCount={0}
                    onNotifClick={() => {}}
                    onAvatarClick={() => {}}
                />

                <Box component="main" sx={{ mt: "64px", flex: 1, px: { xs: 3, md: 5 }, pt: 4, pb: 4, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>

                    {/* Page heading */}
                    <Box sx={{ mb: 3, flexShrink: 0 }}>
                        <Typography sx={{ color: T.goldLabel, fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, mb: 0.5 }}>
                            Management Suite
                        </Typography>
                        <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1 }}>
                            Freelancer Directory
                        </Typography>
                    </Box>

                    {/* Inline search */}
                    <Box sx={{ mb: 4, flexShrink: 0 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by name, expertise, or contact..."
                            value={search}
                            onChange={handleSearch}
                            variant="outlined"
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "transparent", borderRadius: "6px", fontSize: "0.83rem", color: T.textPrimary,
                                    "& fieldset": { borderColor: "#C8BA90" },
                                    "&:hover fieldset": { borderColor: T.gold + "99" },
                                    "&.Mui-focused fieldset": { borderColor: T.gold },
                                },
                                "& input::placeholder": { color: T.textMuted, opacity: 1, fontSize: "0.8rem" },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon sx={{ color: T.textMuted, fontSize: 17 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Count + Filter/Sort */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, flexShrink: 0 }}>
                        <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.88rem" }}>
                            Displaying {filtered.length} Certified Partner{filtered.length !== 1 ? "s" : ""}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {[{ label: "Filter", icon: <TuneOutlinedIcon sx={{ fontSize: 15 }} /> }, { label: "Sort", icon: <SortOutlinedIcon sx={{ fontSize: 15 }} /> }].map(({ label, icon }) => (
                                <Button key={label} startIcon={icon}
                                        sx={{ color: T.textMuted, fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", p: 0, minWidth: 0, "&:hover": { color: T.gold, bgcolor: "transparent" } }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: T.border, mb: 0, flexShrink: 0 }} />

                    {/* Scrollable List Container */}
                    <Box sx={{
                        flex: 1,
                        overflowY: "auto",
                        pr: 1, // padding for the scrollbar
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                        "&::-webkit-scrollbar-thumb": { bgcolor: T.border, borderRadius: "4px" },
                        "&:hover::-webkit-scrollbar-thumb": { bgcolor: T.gold + "99" },
                    }}>
                        {filtered.length === 0 ? (
                            <Box sx={{ py: 8, textAlign: "center" }}>
                                <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>No freelancers match your search.</Typography>
                            </Box>
                        ) : (
                            filtered.map((f, index) => (
                                <FreelancerRow
                                    key={f.id}
                                    freelancer={f}
                                    showDivider={index < filtered.length - 1}
                                    onInfo={(id) => console.log("Freelancer info:", id)}
                                />
                            ))
                        )}
                    </Box>

                    <Divider sx={{ borderColor: T.border, mt: 0, flexShrink: 0 }} />

                </Box>
            </Box>
        </Box>
    );
}