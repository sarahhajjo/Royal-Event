import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 1. استيراد هوكات التوجيه
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

const DRAWER_WIDTH = 260;

// 👈 2. إضافة المسار (path) لكل زر ليعرف المتصفح لوين يروح
const topNavItems = [
    { label: "Dashboard",   icon: <DashboardIcon />, key: "dashboard",   path: "/freelancer-dashboard" },
    { label: "Add Service", icon: <AddBoxIcon />,    key: "add-service", path: "/add-service" }, // تأكدي أن هذا الرابط يطابق الرابط في App.jsx
    { label: "Orders",      icon: <OrdersIcon />,    key: "orders",      path: "/order-managment" },
    { label: "Catalog",     icon: <CatalogIcon />,   key: "catalog",     path: "/freelancer-offer" },
    { label: "My Offers",   icon: <OffersIcon />,    key: "offers",      path: "/catalog" },
];

const bottomNavItems = [
    { label: "Settings", icon: <SettingsIcon />, key: "settings", path: "/settings" },
    { label: "Help",     icon: <InfoIcon />,     key: "help",     path: "/help" },
];

const NavList = ({ items }) => {
    const navigate = useNavigate(); // 👈 هوك الانتقال
    const location = useLocation(); // 👈 هوك معرفة الرابط الحالي

    return (
        <List sx={{ px: 2 }}>
            {items.map(({ label, icon, key, path }) => {
                // 👈 3. التظليل يصير تلقائي إذا كان مسار الصفحة يطابق مسار الزر
                const isActive = location.pathname.includes(path);

                return (
                    <ListItemButton
                        key={key}
                        selected={isActive}
                        onClick={() => navigate(path)} // 👈 4. أمر الانتقال عند الكبس
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
    // لم تعودي بحاجة لتمرير activeNav أو onNavChange، السايدبار صار ذكي وبيعرف لحاله!


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