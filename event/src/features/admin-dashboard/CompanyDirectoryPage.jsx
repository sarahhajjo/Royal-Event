import React, { useState, useMemo } from "react";
import {
    Box, Typography, InputAdornment, TextField, Paper,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import CompanyRow from "./components/CompanyRow";

// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    pageBg:    "#FAF7F0",
    cardBg:    "#FFFFFF",
    border:    "#E8DFC8",
    inputBg:   "#F5EFE0",
    gold:      "#8a6f28",
    textPrimary:"#1C1712",
    textMuted: "#7A6F5E",
};

// ── Demo data ─────────────────────────────────────────────────────────────────
const COMPANIES = [
    { id: 1, name: "Aurelian Events",      logoUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&q=80", rep: "Julian Thorne",     email: "j.thorne@aurelian.com",      phone: "+1 (212) 555-0198" },
    { id: 2, name: "Grand Ceremonies Ltd", logoUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&q=80", rep: "Marcus Vane",       email: "m.vane@grandceremonies.com", phone: "+1 (212) 555-0102" },
    { id: 3, name: "Elite Catering Co.",   logoLetter: "E",                                                                   rep: "Elena Rossi",       email: "e.rossi@elitecatering.co",   phone: "+1 (212) 555-0344" },
    { id: 4, name: "Security Reserve",     logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=80", rep: "Sebastian Sterling", email: "s.sterling@securityreserve.com", phone: "+1 (212) 555-0812" },
    { id: 5, name: "Vanguard Logistics",   logoLetter: "V",                                                                   rep: "Alexander Knight",  email: "a.knight@vanguard.com",      phone: "+1 (212) 555-0921" },
    { id: 6, name: "Petal & Stem",         logoUrl: "https://images.unsplash.com/photo-1487530811015-780eeecb5b87?w=80&q=80", rep: "Isabella Flow",     email: "i.flow@petalstem.co",        phone: "+1 (212) 555-0771" },
    { id: 7, name: "Azure Sound Studios",  logoLetter: "A",                                                                   rep: "Daniel Cross",      email: "d.cross@azuresound.com",     phone: "+1 (212) 555-0433" },
];

export default function CompanyDirectoryPage() {
    const [activeNav, setActiveNav] = useState("Company Directory");
    const [search, setSearch]       = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return COMPANIES;
        const q = search.toLowerCase();
        return COMPANIES.filter(
            (c) => c.name.toLowerCase().includes(q) || c.rep.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif"  }}>
            <Sidebar activeItem={activeNav} onNavClick={setActiveNav} onCreateEvent={() => {}} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                <TopBar title="Elite Admin" user={{ name: "Admin", role: "Superuser" }} />

                <Box component="main" sx={{ mt: "64px", flex: 1, p: { xs: 3, md: 5 }, maxWidth: 1200 }}>
                    {/* Heading */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ color: "#A89450", fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, mb: 0.5 }}>
                            Management Suite
                        </Typography>
                        <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.1, mb: 1 }}>
                            Company Directory
                        </Typography>
                        <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>
                            Manage corporate entities and their authorized representatives.
                        </Typography>
                    </Box>

                    {/* Search */}
                    <TextField
                        fullWidth
                        placeholder="SEARCH BY COMPANY OR REPRESENTATIVE NAME"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon sx={{ color: T.textMuted, fontSize: 18 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 4,
                            "& .MuiOutlinedInput-root": {
                                bgcolor: T.inputBg,
                                borderRadius: "8px",
                                fontSize: "0.83rem",
                                color: T.textPrimary,
                                py: 0.4,
                                "& fieldset": { borderColor: T.border },
                                "&:hover fieldset": { borderColor: T.gold + "88" },
                                "&.Mui-focused fieldset": { borderColor: T.gold },
                            },
                            "& input::placeholder": { color: T.textMuted, opacity: 1, fontSize: "0.72rem", letterSpacing: 1.2 },
                        }}
                    />

                    {/* List */}
                    <Paper elevation={0} sx={{ bgcolor: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "12px", overflow: "hidden" }}>
                        {filtered.length === 0 ? (
                            <Box sx={{ py: 8, textAlign: "center" }}>
                                <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>No companies match your search.</Typography>
                            </Box>
                        ) : (
                            filtered.map((company, index) => (
                                <CompanyRow
                                    key={company.id}
                                    company={company}
                                    showDivider={index < filtered.length - 1}
                                    onInfo={(id) => console.log("Info:", id)}
                                />
                            ))
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
