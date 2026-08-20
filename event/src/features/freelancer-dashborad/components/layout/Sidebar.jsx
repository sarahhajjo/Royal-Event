import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, useTheme
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/GridView";
import AddBoxIcon    from "@mui/icons-material/AddBoxOutlined";
import OrdersIcon    from "@mui/icons-material/ShoppingCart";
import CatalogIcon   from "@mui/icons-material/TableChart";
import SettingsIcon  from "@mui/icons-material/Settings";
import InfoIcon      from "@mui/icons-material/InfoOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

const DRAWER_WIDTH = 260;

const topNavItems = [
    { label: "Dashboard",   icon: <DashboardIcon />, key: "dashboard",   path: "/freelancer-dashboard" },
    { label: "Add Service", icon: <AddBoxIcon />,    key: "add-service", path: "/add-service" },
    { label: "Orders",      icon: <OrdersIcon />,    key: "orders",      path: "/order-managment" },
    { label: "Catalog",     icon: <CatalogIcon />,   key: "catalog",     path: "/freelancer-offer" },
    { label: "My Jobs",     icon: <AssignmentOutlinedIcon />, key: "my-jobs",   path: "/my-jobs" },
    { label: "Job Offers",  icon: <BusinessCenterOutlinedIcon />, key: "job-offers", path: "/jobs" },
    { label: "My Calendar", icon: <AssignmentOutlinedIcon />, key: "calendar", path: "/freelancer-calendar" },
];

const bottomNavItems = [
    { label: "Settings", icon: <SettingsIcon />, key: "settings", path: "/settings" },
    { label: "Help",     icon: <InfoIcon />,     key: "help",     path: "/help" },
];

const NavList = ({ items }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    return (
        <List sx={{ px: 2 }}>
            {items.map(({ label, icon, key, path }) => {
                const isActive = location.pathname.includes(path);

                return (
                    <ListItemButton
                        key={key}
                        selected={isActive}
                        onClick={() => navigate(path)}
                        sx={{
                            py: 1.3, px: 2.5, mb: 0.6, borderRadius: 2, gap: 2,
                            transition: "all 0.2s",
                            bgcolor: isActive
                                ? (theme.palette.mode === 'dark' ? "rgba(212,175,55,0.15) !important" : "rgba(212,175,55,0.15) !important")
                                : "transparent",
                            border: isActive ? "1px solid rgba(212,175,55,0.4)" : "1px solid transparent",
                            "&:hover": {
                                bgcolor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, color: isActive ? "#D4AF37" : theme.palette.text.secondary, "& svg": { fontSize: "1.2rem" } }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={label}
                            primaryTypographyProps={{
                                fontSize: "0.82rem",
                                fontFamily: "'Raleway', sans-serif",
                                color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                                fontWeight: isActive ? 700 : 500,
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );
};

const Sidebar = () => {
    const theme = useTheme();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.5) !important" : "rgba(250, 248, 245, 0.65) !important",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRight: "1px solid",
                    borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                    color: theme.palette.text.primary,
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Box sx={{ p: 3.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    component="img"
                    src="/images/logo.png"
                    alt="Royal Events Logo"
                    sx={{
                        width: 48,
                        height: 48,
                        objectFit: 'cover', // 👈 تضمن أن الصورة تملأ الدائرة
                        borderRadius: '50%', // 👈 هنا السر لجعلها دائرية 100%
                        boxShadow: theme.palette.mode === 'dark' ? '0px 2px 8px rgba(0,0,0,0.5)' : '0px 2px 6px rgba(140,106,31,0.2)' // 👈 ظل خفيف ليعطيها بروز جميل
                    }}
                />
                <Typography sx={{ fontSize: "1.2rem", fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontWeight: 700, letterSpacing: '0.05em' }}>
                    Royal Events
                </Typography>
            </Box>

            <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)", mx: 3, mb: 1 }} />

            <Box sx={{ mt: 1, flex: 1, overflowY: 'auto' }}>
                <NavList items={topNavItems} />
            </Box>

            <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)", mx: 3, my: 1 }} />

            <Box sx={{ my: 1 }}>
                <NavList items={bottomNavItems} />
            </Box>
        </Drawer>
    );
};

export default Sidebar;