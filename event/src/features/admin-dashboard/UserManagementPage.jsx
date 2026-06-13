import React, { useState, useMemo } from "react";
import {
    Box, Typography, TextField,
    InputAdornment, Paper, Divider
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// ── Shared layout components ──────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";   // adjust path to your project structure
import TopBar  from "./components/TopBar";

// ── Page-specific component ───────────────────────────────────────────────────
import UserRow from "./components/UserRow";

// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    pageBg:      "#FAF7F0",
    cardBg:      "#FDFAF4",
    border:      "#E8DFC8",
    gold:        "#8a6f28",
    goldLabel:   "#A89870",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
};

// ── Demo data (swap with useSelector later) ───────────────────────────────────
const USERS = [
    { id: 1, name: "Julian Thorne",      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80", title: "Chief Operations",      email: "j.thorne@aurelian.com",   phone: "+1 (212) 555-0198" },
    { id: 2, name: "Marcus Vane",        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80", title: "Founding Partner",      email: "m.vane@aurelian.com",     phone: "+1 (212) 555-0102" },
    { id: 3, name: "Elena Rossi",        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80", title: "Asset Strategist",      email: "e.rossi@aurelian.com",    phone: "+1 (212) 555-0344" },
    { id: 4, name: "Sebastian Sterling", avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&q=80", title: "Risk Compliance",       email: "s.sterling@aurelian.com", phone: "+1 (212) 555-0812" },
    { id: 5, name: "Vivienne Lau",       avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80", title: "Director of Relations", email: "v.lau@aurelian.com",      phone: "+1 (212) 555-0990" },
];

export default function UserManagementPage({ onNavClick, activeNav = "User Management" }) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return USERS;
        const q = search.toLowerCase();
        return USERS.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.title.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            {/* Shared Sidebar */}
            <Sidebar
                activeItem={activeNav}
                onNavClick={onNavClick}
                onCreateEvent={() => console.log("Create Event")}
            />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>

                {/* Shared TopBar - تم تفريغ العنوان ليطابق الصورة التي لا تحتوي عنوان علوي */}
                <TopBar
                    title="User Management" // أضفنا العنوان هنا
                    user={{ name: "Admin", role: "Superuser" }}
                    notifCount={0}
                    onNotifClick={() => {}}
                    onAvatarClick={() => {}}
                />

                {/* تمت زيادة المسافة العلوية pt: 14 ليطابق الفراغ الكبير في الصورة */}
                <Box component="main" sx={{ mt: "64px", flex: 1, px: { xs: 4, md: 8 }, pt: { xs: 8, md: 14 }, pb: 8, maxWidth: 1100 }}>

                    {/* Search - تم تصغير العرض ليطابق الخط النصفي في الصورة */}
                    <Box sx={{ width: { xs: "100%", sm: "60%", md: "45%" }, mb: 5 }}>
                        {/* Page heading */}
                        <Box sx={{ mb: 4 , mt:'-19%' ,ml:'-5%'}}>
                            <Typography sx={{ color: T.goldLabel, fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, mb: 0.5 }}>
                                Management Suite
                            </Typography>
                            <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1 }}>
                                User Management
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            placeholder="SEARCH BY NAME"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon sx={{ color: T.textMuted, fontSize: 17, mb: 0.3 }} />
                                    </InputAdornment>
                                ),
                                disableUnderline: false,
                            }}
                            sx={{
                                "& .MuiInput-root": {
                                    color: T.textPrimary, fontSize: "0.8rem", letterSpacing: 1.5, pb: 0.5,
                                    "&:before": { borderBottomColor: "#D6CCB6" }, // لون الخط مقارب للصورة
                                    "&:hover:not(.Mui-disabled):before": { borderBottomColor: T.gold },
                                    "&:after": { borderBottomColor: T.gold },
                                },
                                "& input::placeholder": { color: T.textPrimary, opacity: 0.9, fontSize: "0.75rem", letterSpacing: 1.5, fontWeight: 600 },
                            }}
                        />
                    </Box>

                    {/* Column headers - تم ضبط المحاذاة لليسار لقسم المراسلات */}
                    <Box sx={{ display: "flex", px: 3, mb: 1.5, gap: 2.5 ,ml:'-5%' }}>
                        <Typography sx={{ width: 54, flexShrink: 0, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Portrait</Typography>
                        <Typography sx={{ flex: 1, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Identity</Typography>
                        <Typography sx={{ width: 250, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Correspondence</Typography>
                        <Box sx={{ width: 30, ml: 1, flexShrink: 0 }} /> {/* مساحة وهمية لأيقونة التعجب */}
                    </Box>
                    <Divider sx={{ borderColor: T.border, mx: 3 ,ml:'-2.5%'}} />

                    {/* List */}
                    <Paper elevation={0} sx={{ bgcolor: "transparent", border: "none", borderRadius: 0, overflow: "hidden" ,ml:'-5%' }}>
                        {filtered.length === 0 ? (
                            <Box sx={{ py: 8, textAlign: "center" }}>
                                <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>No users match your search.</Typography>
                            </Box>
                        ) : (
                            filtered.map((user, index) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    showDivider={index < filtered.length - 1}
                                    onInfo={(id) => console.log("User info:", id)}
                                />
                            ))
                        )}
                    </Paper>

                    {/* Loading dots */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mt: 8, opacity: 0.6 }}>
                        {[0, 1, 2].map((i) => <Box key={i} sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: T.goldLabel }} />)}
                        <Typography sx={{ color: T.textMuted, fontSize: "0.65rem", letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600, ml: 0.5 }}>
                            Ascertaining More Records
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}