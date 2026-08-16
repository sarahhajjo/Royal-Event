import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box, Drawer, List, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/GridView";
import AddBoxIcon    from "@mui/icons-material/AddBoxOutlined";
import OrdersIcon    from "@mui/icons-material/ShoppingCart";
import CatalogIcon   from "@mui/icons-material/TableChart";
import SettingsIcon  from "@mui/icons-material/Settings";
import InfoIcon      from "@mui/icons-material/InfoOutlined";

// 👑 1. استيراد أيقونات احترافية جديدة للوظائف
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined"; // أيقونة كل الوظائف

const DRAWER_WIDTH = 260;

// 👑 2. تحديث قائمة الروابط وإضافة الحقول المطلوبة
const topNavItems = [
    { label: "Dashboard",   icon: <DashboardIcon />, key: "dashboard",   path: "/freelancer-dashboard" },
    { label: "Add Service", icon: <AddBoxIcon />,    key: "add-service", path: "/add-service" },
    { label: "Orders",      icon: <OrdersIcon />,    key: "orders",      path: "/order-managment" },
    { label: "Catalog",     icon: <CatalogIcon />,   key: "catalog",     path: "/freelancer-offer" },
    { label: "My Jobs",     icon: <AssignmentOutlinedIcon />, key: "my-jobs",   path: "/my-jobs" }, // 👈 تم التعديل
    { label: "Job Offers",  icon: <BusinessCenterOutlinedIcon />, key: "job-offers", path: "/jobs" }, // 👈 الحقل الجديد
];

const bottomNavItems = [
    { label: "Settings", icon: <SettingsIcon />, key: "settings", path: "/settings" },
    { label: "Help",     icon: <InfoIcon />,     key: "help",     path: "/help" },
];

const NavList = ({ items }) => {
    const navigate = useNavigate();
    const location = useLocation();

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
};

const Sidebar = () => {
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
                <NavList items={topNavItems} />
            </Box>

            <Divider sx={{ borderColor: "divider", mx: 3, my: 1 }} />

            <Box sx={{ my: 1 }}>
                <NavList items={bottomNavItems} />
            </Box>

        </Drawer>
    );
};

export default Sidebar;