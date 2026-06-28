import React, { useState, useMemo, useEffect } from "react";
import {
    Box, Typography, TextField, InputAdornment,
    Divider, Button,
} from "@mui/material";
import SearchOutlinedIcon  from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon    from "@mui/icons-material/TuneOutlined";
import SortOutlinedIcon    from "@mui/icons-material/SortOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar      from "./components/Sidebar";
import TopBar       from "./components/TopBar";
import TabSwitcher  from "./components/TabSwitcher";
import FreelancerRow from "./components/FreelancerRow";

import {
    fetchAllFreelancers,
    updateFreelancerStatus,
} from "./directorySlice";

import { T } from "./Theme";

export default function FreelancerDirectoryPage({ onNavClick, activeNav = "Freelancers" }) {
    const dispatch = useDispatch();
    const { freelancers, freelancerLoading } = useSelector((state) => state.directory);
    const navigate = useNavigate();
    const [search, setSearch]   = useState("");
    const [tab,    setTab]      = useState("Pending");

    // جلب البيانات عند التحميل
    useEffect(() => {
        dispatch(fetchAllFreelancers());
    }, [dispatch]);

    // فلترة + بحث
    const filtered = useMemo(() => {
        // tab → "Pending" | "Accepted" | "Rejected"  →  مفتاح Redux: pending / accepted / rejected
        const key = tab.toLowerCase();
        const data = freelancers[key] || [];
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((f) =>
            f.brand_name?.toLowerCase().includes(q) ||
            f.user?.first_name?.toLowerCase().includes(q) ||
            f.user?.last_name?.toLowerCase().includes(q) ||
            f.user?.email?.toLowerCase().includes(q)
        );
    }, [search, tab, freelancers]);

    // ✅ onUpdateStatus يقبل reason كـ param ثالث (اختياري للـ companies)
    const handleUpdateStatus = (id, status, reason = "") => {
        dispatch(updateFreelancerStatus({ id, status, reason }));
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: T.pageBg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <Sidebar activeItem={activeNav} onNavClick={onNavClick} />

            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>
                <TopBar title="Freelancer Directory" user={{ name: "Admin", role: "Superuser" }} />

                <Box
                    component="main"
                    sx={{
                        mt: "64px", flex: 1,
                        px: { xs: 3, md: 5 }, pt: 4, pb: 4,
                        display: "flex", flexDirection: "column",
                        height: "calc(100vh - 64px)",
                    }}
                >
                    {/* ── Header ── */}
                    <Box sx={{ mb: 2, flexShrink: 0 }}>
                        <Typography sx={{ color: T.goldLabel, fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, mb: 0.5 }}>
                            Management Suite
                        </Typography>
                        <Typography variant="h3" sx={{ color: T.textPrimary, fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1 }}>
                            Freelancer Directory
                        </Typography>
                    </Box>

                    {/* ── Tabs ── */}
                    <TabSwitcher
                        tabs={["Accepted", "Pending", "Rejected"]}
                        activeTab={tab}
                        onTabChange={setTab}
                    />

                    {/* ── Search ── */}
                    <Box sx={{ mb: 4, flexShrink: 0 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant="outlined"
                            size="small"
                            // تأكد أن InputProps تبدأ بـ I كبيرة وتكتب هكذا تماماً
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "transparent",
                                    borderRadius: "6px",
                                    fontSize: "0.83rem",
                                    color: T.textPrimary,
                                    "& fieldset": { borderColor: "#C8BA90" },
                                    "&:hover fieldset": { borderColor: T.gold + "99" },
                                    "&.Mui-focused fieldset": { borderColor: T.gold },
                                },
                                "& input::placeholder": { color: T.textMuted, opacity: 1, fontSize: "0.8rem" },
                            }}
                        />
                    </Box>

                    {/* ── Count + Filter/Sort ── */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, flexShrink: 0 }}>
                        <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.88rem" }}>
                            Displaying {filtered.length} Freelancer{filtered.length !== 1 ? "s" : ""}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {[
                                { label: "Filter", icon: <TuneOutlinedIcon sx={{ fontSize: 15 }} /> },
                                { label: "Sort",   icon: <SortOutlinedIcon  sx={{ fontSize: 15 }} /> },
                            ].map(({ label, icon }) => (
                                <Button key={label} startIcon={icon}
                                        sx={{ color: T.textMuted, fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", p: 0, minWidth: 0, "&:hover": { color: T.gold, bgcolor: "transparent" } }}>
                                    {label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: T.border, mb: 0, flexShrink: 0 }} />

                    {/* ── List ── */}
                    {freelancerLoading ? (
                        <Box sx={{ py: 8, textAlign: "center" }}>
                            <Typography sx={{ color: T.textMuted }}>Loading freelancers...</Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            flex: 1, overflowY: "auto", pr: 1,
                            "&::-webkit-scrollbar": { width: "6px" },
                            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                            "&::-webkit-scrollbar-thumb": { bgcolor: T.border, borderRadius: "4px" },
                        }}>
                            {filtered.length === 0 ? (
                                <Box sx={{ py: 8, textAlign: "center" }}>
                                    <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>
                                        No freelancers found in this category.
                                    </Typography>
                                </Box>
                            ) : (
                                filtered.map((f, index) => (
                                    <FreelancerRow
                                        key={f.id}
                                        freelancer={f}
                                        showDivider={index < filtered.length - 1}

                                        onInfo={(id) => console.log("Info:", id)}
                                        onUpdateStatus={handleUpdateStatus}
                                        onClick={(id) => navigate(`/admin-dashboard/freelancers/${id}`)}
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