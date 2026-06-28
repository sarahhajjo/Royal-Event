import React from "react";
import {
    Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Avatar, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/GridView";
import AddBoxIcon    from "@mui/icons-material/AddBoxOutlined";
import OrdersIcon    from "@mui/icons-material/ShoppingCart";
import CatalogIcon   from "@mui/icons-material/TableChart";
import OffersIcon    from "@mui/icons-material/LocalOffer";
import SettingsIcon  from "@mui/icons-material/Settings";
import InfoIcon      from "@mui/icons-material/InfoOutlined";

const DRAWER_WIDTH = 260; // 👈 تم تعريض السايدبار ليطابق الصورة

const topNavItems = [
    { label: "Dashboard",   icon: <DashboardIcon />, key: "dashboard" },
    { label: "Add Product", icon: <AddBoxIcon />,    key: "add_product" },
    { label: "Orders",      icon: <OrdersIcon />,    key: "orders" },
    { label: "Catalog",     icon: <CatalogIcon />,   key: "catalog" },
    { label: "My Offers",   icon: <OffersIcon />,    key: "offers" },
];

const bottomNavItems = [
    { label: "Settings", icon: <SettingsIcon />, key: "settings" },
    { label: "Help",     icon: <InfoIcon />,     key: "help" },
];

const NavList = ({ items, activeNav, onNavChange }) => (
    <List sx={{ px: 2 }}>
        {items.map(({ label, icon, key }) => {
            const isActive = activeNav === key;
            return (
                <ListItemButton
                    key={key}
                    selected={isActive}
                    onClick={() => onNavChange?.(key)}
                    sx={{
                        py: 1.3, px: 2.5, mb: 0.6, borderRadius: 2, gap: 2,
                        transition: "all 0.2s",
                        bgcolor: isActive ? "rgba(201,168,76,0.12) !important" : "transparent",
                        border: isActive ? "1px solid rgba(201,168,76,0.3)" : "1px solid transparent",
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 0, color: isActive ? "primary.main" : "text.secondary", "& svg": { fontSize: "1.2rem" } }}>
                        {icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                            fontSize: "0.82rem",
                            fontFamily: "'Raleway', sans-serif",
                            color: isActive ? "text.primary" : "text.secondary",
                            fontWeight: isActive ? 700 : 500,
                        }}
                    />
                </ListItemButton>
            );
        })}
    </List>
);

const Sidebar = ({ activeNav = "dashboard", onNavChange, user = {} }) => {
    const { name = "Marcus Thorne", role = "Expert Stylist", avatar = "" } = user;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    bgcolor: "background.paper",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Box sx={{ p: 3.5 }}>
                <Typography sx={{ fontSize: "1.2rem", fontFamily: "'Cinzel', serif", color: "text.primary", fontWeight: 700 }}>
                    Royal Events
                </Typography>
            </Box>

            <Divider sx={{ borderColor: "divider", mx: 3, mb: 1 }} />

            <Box sx={{ mt: 1, flex: 1 }}>
                <NavList items={topNavItems} activeNav={activeNav} onNavChange={onNavChange} />
            </Box>

            <Divider sx={{ borderColor: "divider", mx: 3, my: 1 }} />

            <Box sx={{ my: 1 }}>
                <NavList items={bottomNavItems} activeNav={activeNav} onNavChange={onNavChange} />
            </Box>

            <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.8, borderTop: "1px solid", borderColor: "divider" }}>
                <Avatar src={avatar} sx={{ width: 38, height: 38, border: "1px solid", borderColor: "primary.dark" }} />
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Cinzel', serif" }} noWrap>
                        {name}
                    </Typography>
                    <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                        {role}
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;