import React from "react";
import {
    Box, Typography, TextField, InputAdornment,
    Divider, Button, Paper,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon   from "@mui/icons-material/TuneOutlined";
import SortOutlinedIcon   from "@mui/icons-material/SortOutlined";

import Sidebar from "./components/Sidebar";
import TopBar  from "./components/TopBar";
import { T, typography, searchFieldSx } from "./theme";

/**
 * DirectoryLayout
 *
 * Shared wrapper for Company Directory, User Management, Freelancer Directory.
 * Renders: Sidebar + TopBar + page heading + search bar + optional col headers
 * + a scrollable list area + optional footer.
 *
 * Props:
 *   activeNav       – string passed to Sidebar
 *   onNavClick      – (label) => void passed to Sidebar
 *   topBarTitle     – string shown in TopBar
 *
 *   sectionLabel    – small uppercase label above page title (optional)
 *   pageTitle       – large heading text
 *   pageSubtitle    – muted subtitle under heading (optional)
 *
 *   searchValue     – controlled search string
 *   onSearchChange  – (e) => void
 *   searchPlaceholder – string (optional)
 *
 *   showFilterSort  – boolean — show Filter / Sort buttons (default false)
 *   resultCount     – number — if set, shows "Displaying N …" line
 *   resultLabel     – string — label after count, e.g. "Certified Partners"
 *
 *   colHeaders      – array of { label, sx? } — column header row (optional)
 *
 *   children        – the list rows
 *   footer          – optional React node below the list (e.g. pagination, dots)
 *
 *   onCreateEvent   – () => void passed to Sidebar
 */
export default function DirectoryLayout({
                                            // nav
                                            activeNav,
                                            onNavClick,
                                            onCreateEvent,
                                            // topbar
                                            topBarTitle,
                                            topBarUser = { name: "Admin", role: "Superuser" },
                                            // heading
                                            sectionLabel,
                                            pageTitle,
                                            pageSubtitle,
                                            // search
                                            searchValue,
                                            onSearchChange,
                                            searchPlaceholder = "Search by name...",
                                            // filter/sort
                                            showFilterSort = false,
                                            resultCount,
                                            resultLabel = "Records",
                                            // columns
                                            colHeaders,
                                            // content
                                            children,
                                            footer,
                                        }) {
    return (
        <Box
            sx={{
                display:    "flex",
                minHeight:  "100vh",
                bgcolor:    T.pageBg,
                fontFamily: typography.fontFamily,
            }}
        >
            {/* ── Shared Sidebar ─────────────────────────────────────────────── */}
            <Sidebar
                activeItem={activeNav}
                onNavClick={onNavClick}
                onCreateEvent={onCreateEvent}
            />

            {/* ── Main ───────────────────────────────────────────────────────── */}
            <Box sx={{ flex: 1, ml: "240px", display: "flex", flexDirection: "column" }}>

                {/* ── Shared TopBar ───────────────────────────────────────────── */}
                <TopBar
                    title={topBarTitle}
                    user={topBarUser}
                    notifCount={0}
                    onNotifClick={() => {}}
                    onAvatarClick={() => {}}
                />

                {/* ── Page body ──────────────────────────────────────────────── */}
                <Box
                    component="main"
                    sx={{
                        mt:  "64px",
                        flex: 1,
                        px:  { xs: 3, md: 5 },
                        pt:  4,
                        pb:  6,
                        display:       "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Section label + Page title + subtitle */}
                    <Box sx={{ mb: 3, flexShrink: 0 }}>
                        {sectionLabel && (
                            <Typography sx={{ ...typography.sectionLabel, mb: 0.5 }}>
                                {sectionLabel}
                            </Typography>
                        )}
                        <Typography
                            variant="h3"
                            sx={{
                                ...typography.pageTitle,
                                color:    T.textPrimary,
                                fontSize: { xs: "1.8rem", md: "2.3rem" },
                                mb:       pageSubtitle ? 0.8 : 0,
                            }}
                        >
                            {pageTitle}
                        </Typography>
                        {pageSubtitle && (
                            <Typography sx={{ color: T.textMuted, fontSize: "0.88rem" }}>
                                {pageSubtitle}
                            </Typography>
                        )}
                    </Box>

                    {/* ── Search bar ─────────────────────────────────────────────── */}
                    <TextField
                        fullWidth
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={onSearchChange}
                        variant="outlined"
                        size="small"
                        sx={{ ...searchFieldSx, mb: 3, flexShrink: 0 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon sx={{ color: T.textMuted, fontSize: 17 }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* ── Count + Filter / Sort row (optional) ───────────────────── */}
                    {(resultCount !== undefined || showFilterSort) && (
                        <Box
                            sx={{
                                display:        "flex",
                                alignItems:     "center",
                                justifyContent: "space-between",
                                mb:             1.5,
                                flexShrink:     0,
                            }}
                        >
                            {resultCount !== undefined && (
                                <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "0.88rem" }}>
                                    Displaying {resultCount} {resultLabel}
                                </Typography>
                            )}
                            {showFilterSort && (
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    {[
                                        { label: "Filter", Icon: TuneOutlinedIcon },
                                        { label: "Sort",   Icon: SortOutlinedIcon  },
                                    ].map(({ label, Icon }) => (
                                        <Button
                                            key={label}
                                            startIcon={<Icon sx={{ fontSize: 15 }} />}
                                            sx={{
                                                color:         T.textMuted,
                                                fontSize:      "0.75rem",
                                                fontWeight:    700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                                p:             0,
                                                minWidth:      0,
                                                "&:hover":     { color: T.gold, bgcolor: "transparent" },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ── Column headers (optional) ──────────────────────────────── */}
                    {colHeaders?.length > 0 && (
                        <Box sx={{ display: "flex", px: 3, mb: 0.75, gap: 2.5, flexShrink: 0 }}>
                            {colHeaders.map(({ label, sx: colSx }) => (
                                <Typography key={label} sx={{ ...typography.colHeader, ...colSx }}>
                                    {label}
                                </Typography>
                            ))}
                        </Box>
                    )}

                    {/* Top divider */}
                    <Divider sx={{ borderColor: T.border, flexShrink: 0 }} />

                    {/* ── Scrollable list ─────────────────────────────────────────── */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex:         1,
                            bgcolor:      T.cardBg,
                            border:       "none",
                            borderRadius: 0,
                            overflowY:    "auto",
                            "&::-webkit-scrollbar":        { width: "6px" },
                            "&::-webkit-scrollbar-track":  { bgcolor: "transparent" },
                            "&::-webkit-scrollbar-thumb":  { bgcolor: T.border, borderRadius: "4px" },
                            "&:hover::-webkit-scrollbar-thumb": { bgcolor: T.gold + "99" },
                        }}
                    >
                        {children}
                    </Paper>

                    {/* Bottom divider */}
                    <Divider sx={{ borderColor: T.border, flexShrink: 0 }} />

                    {/* ── Footer (pagination / loading dots) ─────────────────────── */}
                    {footer && <Box sx={{ flexShrink: 0 }}>{footer}</Box>}
                </Box>
            </Box>
        </Box>
    );
}