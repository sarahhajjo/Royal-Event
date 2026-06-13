import React from "react";
import {
    Box, Typography, List, ListItemButton,
    ListItemIcon, ListItemText, Button, Divider,
} from "@mui/material";
import DashboardOutlinedIcon      from "@mui/icons-material/DashboardOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PeopleAltOutlinedIcon      from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlinedIcon       from "@mui/icons-material/BusinessOutlined";
import SettingsOutlinedIcon       from "@mui/icons-material/SettingsOutlined";
import WorkOutlineOutlinedIcon    from "@mui/icons-material/WorkOutlineOutlined";
import AddIcon                    from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

// ── Fixed light-mode tokens ───────────────────────────────────────────────────
const T = {
    sidebarBg:   "#F5EFE0",
    border:      "#E0D5BC",
    gold:        "#8a6f28",
    activeBg:    "#EAE0C8",
    textPrimary: "#1C1712",
    textMuted:   "#7A6F5E",
    btnText:     "#FFFFFF",
};

const NAV_ITEMS = [
    { label: "Overview",          path: "/admin-dashboard/overview",   icon: <DashboardOutlinedIcon fontSize="small" /> },
    { label: "Pending Approvals", path: "/admin-dashboard/approvals",  icon: <PendingActionsOutlinedIcon fontSize="small" /> },
    { label: "User Management",   path: "/admin-dashboard/users",      icon: <PeopleAltOutlinedIcon fontSize="small" /> },
    { label: "Freelancers",       path: "/admin-dashboard/freelancers", icon: <WorkOutlineOutlinedIcon fontSize="small" /> },
    { label: "Company Directory", path: "/admin-dashboard",            icon: <BusinessOutlinedIcon fontSize="small" /> },
    { label: "System Settings",   path: "/admin-dashboard/settings",   icon: <SettingsOutlinedIcon fontSize="small" /> },
];

/**
 * Sidebar — shared across all pages, fixed light-mode colors
 *
 * Props:
 * activeItem    – label of the currently active nav item
 * onCreateEvent – () => void
 */
export default function Sidebar({ activeItem = "Overview", onCreateEvent }) {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 240,
                flexShrink: 0,
                height: "100vh",
                bgcolor: T.sidebarBg,
                borderRight: `1px solid ${T.border}`,
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 100,
            }}
        >
            {/* Brand */}
            <Box sx={{ px: 3, pt: 3.5, pb: 2.5 }}>
                <Typography
                    sx={{
                        color: T.gold,
                        fontWeight: 900,
                        fontSize: "0.72rem",
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        mb: 0.5,
                    }}
                >
                    ELITE
                </Typography>
                <Typography sx={{ color: T.textPrimary, fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>
                    Executive Portal
                </Typography>
                <Typography sx={{ color: T.textMuted, fontSize: "0.72rem", mt: 0.3 }}>
                    Elite Event Management
                </Typography>
            </Box>

            <Divider sx={{ borderColor: T.border }} />

            {/* Nav items */}
            <List disablePadding sx={{ flex: 1, pt: 1.5 }}>
                {/* التعديل هنا: أضفنا استخراج الـ path من المصفوفة */}
                {NAV_ITEMS.map(({ label, path, icon }) => {
                    const isActive = activeItem === label;
                    return (
                        <ListItemButton
                            key={label}
                            // التعديل هنا: استخدمنا navigate(path) بدل onNavClick
                            onClick={() => navigate(path)}
                            sx={{
                                mx: 1.5,
                                mb: 0.5,
                                px: 1.5,
                                py: 1,
                                borderRadius: "8px",
                                bgcolor: isActive ? T.activeBg : "transparent",
                                borderLeft: isActive ? `3px solid ${T.gold}` : "3px solid transparent",
                                "&:hover": { bgcolor: T.activeBg },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 34, color: isActive ? T.gold : T.textMuted }}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{
                                    fontSize: "0.83rem",
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? T.gold : T.textMuted,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Create Event CTA */}
            <Box sx={{ p: 2.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateEvent}
                    sx={{
                        bgcolor: T.gold,
                        color: T.btnText,
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        py: 1.5,
                        borderRadius: "6px",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#6e5820", boxShadow: "none" },
                    }}
                >
                    Create Event
                </Button>
            </Box>
        </Box>
    );
}