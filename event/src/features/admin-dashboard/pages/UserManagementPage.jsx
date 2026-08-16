import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, TextField,
    InputAdornment, Paper, Divider
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useDispatch, useSelector } from "react-redux";

// تأكدي من مسار الاستيراد

import Sidebar from "../components/Sidebar.jsx";
import TopBar  from "../components/TopBar.jsx";
import UserRow from "../components/UserRow.jsx";
import {fetchAdminUsers} from "../directorySlice.js";

const T = {
    pageBg:      "#FAF7F0",
    cardBg:      "#FDFAF4",
    border:      "#E8DFC8",
    gold:        "#8a6f28",
    goldLabel:   "#A89870",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
};

export default function UserManagementPage({ onNavClick, activeNav = "User Management" }) {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { users, usersLoading } = useSelector((state) => state.directory);

    useEffect(() => {
        dispatch(fetchAdminUsers());
    }, [dispatch]);

    const filtered = useMemo(() => {
        if (!users || users.length === 0) return [];

        const regularUsers = users.filter(u =>
            u.provider_profile === null &&
            u.email !== "admin@aura.com"
        ).map(u => ({
            ...u,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown User",
            title: "Customer",
        }));

        if (!search.trim()) return regularUsers;

        const q = search.toLowerCase();
        return regularUsers.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.phone && u.phone.includes(q))
        );
    }, [users, search]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Sidebar activeItem={activeNav} onNavClick={onNavClick} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                <TopBar
                    title="User Management"
                    user={{ name: "Admin", role: "Superuser" }}
                    notifCount={0}
                />

                {/* 🚀 تم تعديل الـ pt لتكون منطقية بدل المارجن السالب */}
                <Box component="main" sx={{ mt: "64px", flex: 1, px: { xs: 4, md: 8 }, pt: 6, pb: 8, maxWidth: 1100 }}>

                    {/* Search Section */}
                    <Box sx={{ width: { xs: "100%", sm: "60%", md: "45%" }, mb: 5 }}>

                        {/* 🚀 حذفنا الأرقام السالبة من هنا لكي لا تغطي على حقل البحث */}
                        <Box sx={{ mb: 4 }}>
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
                            // 🚀 إعطاء الحقل position relative ليظل في المقدمة وقابل للضغط
                            sx={{
                                position: 'relative',
                                zIndex: 10,
                                "& .MuiInput-root": {
                                    color: T.textPrimary, fontSize: "0.8rem", letterSpacing: 1.5, pb: 0.5,
                                    "&:before": { borderBottomColor: "#D6CCB6" },
                                    "&:hover:not(.Mui-disabled):before": { borderBottomColor: T.gold },
                                    "&:after": { borderBottomColor: T.gold },
                                },
                                "& input::placeholder": { color: T.textPrimary, opacity: 0.9, fontSize: "0.75rem", letterSpacing: 1.5, fontWeight: 600 },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon sx={{ color: T.textMuted, fontSize: 17, mb: 0.3 }} />
                                    </InputAdornment>
                                ),
                                disableUnderline: false,
                            }}
                        />
                    </Box>

                    {/* 🚀 حذفنا ml: '-5%' من كل العناوين والخطوط والـ Paper لترجع لمكانها الطبيعي */}
                    <Box sx={{ display: "flex", px: 3, mb: 1.5, gap: 2.5 }}>
                        <Typography sx={{ width: 54, flexShrink: 0, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Portrait</Typography>
                        <Typography sx={{ flex: 1, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Identity</Typography>
                        <Typography sx={{ width: 250, color: T.textMuted, fontSize: "0.65rem", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Correspondence</Typography>
                        <Box sx={{ width: 30, ml: 1, flexShrink: 0 }} />
                    </Box>
                    <Divider sx={{ borderColor: T.border, mx: 3 }} />

                    {/* List */}
                    <Paper elevation={0} sx={{ bgcolor: "transparent", border: "none", borderRadius: 0 }}>
                        {usersLoading ? (
                            <Box sx={{ py: 8, textAlign: "center" }}>
                                <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>Loading users...</Typography>
                            </Box>
                        ) : filtered.length === 0 ? (
                            <Box sx={{ py: 8, textAlign: "center" }}>
                                <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>No users match your search.</Typography>
                            </Box>
                        ) : (
                            filtered.map((user, index) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    showDivider={index < filtered.length - 1}
                                    onInfo={(id) => navigate(`/admin-dashboard/user/${id}`)}
                                />
                            ))
                        )}
                    </Paper>

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