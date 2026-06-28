import React, { useState, useMemo } from "react";
import {
    Box, Typography, TextField, InputAdornment,
    Divider, Button,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";

// ── Shared layout components ──────────────────────────────────────────────────
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TabSwitcher from "./components/TabSwitcher";

// ── Page-specific component ───────────────────────────────────────────────────
import CompanyRow from "./components/CompanyRow";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProviders, updateProviderStatus } from './directorySlice';
// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    pageBg:      "#FAF7F0",
    border:      "#E8DFC8",
    gold:        "#8a6f28",
    goldLabel:   "#A89450",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
};

// ── Data ──
const ALL_COMPANIES = [
    { id: 1, name: "Aurelian Events", status: "Accepted", logoUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&q=80", rep: "Julian Thorne", email: "j.thorne@aurelian.com", phone: "+1 (212) 555-0198" },
    { id: 2, name: "Grand Ceremonies Ltd", status: "Accepted", logoUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&q=80", rep: "Marcus Vane", email: "m.vane@grandceremonies.com", phone: "+1 (212) 555-0102" },
    { id: 3, name: "Security Reserve", status: "Pending", logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&q=80", rep: "Sebastian Sterling", email: "s.sterling@securityreserve.com", phone: "+1 (212) 555-0812" },
    { id: 4, name: "Vanguard Logistics", status: "Rejected", logoLetter: "V", rep: "Alexander Knight", email: "a.knight@vanguard.com", phone: "+1 (212) 555-0921" },
];

export default function CompanyDirectoryPage({ onNavClick, activeNav = "Company Directory" }) {
    // استخدمنا state للبيانات لنتمكن من تغيير الحالة (Accept/Reject)
    const dispatch = useDispatch();

    // 2. جلب البيانات من الـ Redux
    const { companies, loading } = useSelector((state) => state.directory);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("Pending"); // يفضل البدء بـ Pending في لوحة الإدارة

    // 3. جلب البيانات عند تحميل الصفحة
    useEffect(() => {
        dispatch(fetchAllProviders());
    }, [dispatch]);

    // 4. تعديل الـ useMemo ليستخدم بيانات الـ Redux
    const filtered = useMemo(() => {
        // companies.pending / companies.accepted / companies.rejected
        // ملاحظة: الـ status في الـ TabSwitcher يجب أن يطابق المفاتيح (pending, accepted, rejected)
        const currentData = companies[status.toLowerCase()] || [];

        if (search.trim()) {
            const q = search.toLowerCase();
            return currentData.filter(
                (c) =>
                    c.name?.toLowerCase().includes(q) ||
                    c.rep?.toLowerCase().includes(q) ||
                    c.email?.toLowerCase().includes(q)
            );
        }
        return currentData;
    }, [search, status, companies]);

    // 5. تعديل دالة التحديث لتستخدم Redux Action
    const handleUpdateStatus = (id, newStatus) => {
        dispatch(updateProviderStatus({
            id,
            status: newStatus,
            reason: "Admin action"
        }));
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Sidebar activeItem={activeNav} onNavClick={onNavClick} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                <TopBar title="Company Directory" user={{ name: "Admin", role: "Superuser" }} />

                <Box component="main" sx={{ mt: "64px", flex: 1, px: { xs: 3, md: 5 }, pt: 4, pb: 4, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>

                    <Box sx={{ mb: 2, flexShrink: 0 }}>
                        <Typography sx={{ color: T.goldLabel, fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, mb: 0.5 }}>
                            Management Suite
                        </Typography>
                        <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1 }}>
                            Company Directory
                        </Typography>
                    </Box>

                    <TabSwitcher
                        tabs={["Accepted", "Pending", "Rejected"]}
                        activeTab={status}
                        onTabChange={setStatus}
                    />

                    <Box sx={{ mb: 4, flexShrink: 0 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by combany or representative name "
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                        />
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1.5,
                        flexShrink: 0
                    }}>
                        <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.88rem" }}>
                            Displaying {filtered.length} Certified Partner{filtered.length !== 1 ? "s" : ""}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            {[{ label: "Filter", icon: <TuneOutlinedIcon sx={{ fontSize: 15 }} /> },
                                { label: "Sort", icon: <SortOutlinedIcon sx={{ fontSize: 15 }} /> }].map(({ label, icon }) => (
                                <Button
                                    key={label}
                                    startIcon={icon}
                                    sx={{
                                        color: T.textMuted,
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        letterSpacing: 1.2,
                                        textTransform: "uppercase",
                                        p: 0,
                                        minWidth: 0,
                                        "&:hover": { color: T.gold, bgcolor: "transparent" }
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* الخط الفاصل */}

                    {/* الخط الفاصل */}
                    <Divider sx={{ borderColor: T.border, mb: 1, flexShrink: 0 }} />

                    {loading ? (
                        <Box sx={{ py: 8, textAlign: "center" }}>
                            <Typography sx={{ color: T.textMuted }}>Loading providers...</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                            {filtered.length === 0 ? (
                                <Box sx={{ py: 8, textAlign: "center" }}>
                                    <Typography sx={{ color: T.textMuted }}>No companies found in this category.</Typography>
                                </Box>
                            ) : (
                                filtered.map((c, index) => (
                                    <CompanyRow
                                        key={c.id}
                                        company={c}
                                        showDivider={index < filtered.length - 1}
                                        onUpdateStatus={handleUpdateStatus}
                                    />
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}