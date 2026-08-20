import React, { useContext, useEffect, useState } from "react";
import {
    AppBar, Toolbar, Typography, IconButton, Box, Avatar, useTheme,
    Snackbar, Alert, Slide, Badge // 👑 تم استيراد Badge للنقطة الحمراء
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import { useNavigate } from "react-router-dom";

import { ColorModeContext } from "../../../../main";
import NotificationsPopover from "./NotificationsPopover";
import { onMessageListener, requestForToken } from "../../../../services/firebase.js";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const Header = ({ title = "Dashboard" }) => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState({
        name: " ",
        role: "FREELANCER",
        avatar: ""
    });

    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    // 👑 حالة جديدة لمعرفة إذا كان هناك إشعار جديد لم يُقرأ بعد (لتشغيل النقطة الحمراء)
    const [hasNewNotification, setHasNewNotification] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        title: "",
        body: ""
    });

    const handleOpenNotifications = (event) => {
        setNotificationAnchorEl(event.currentTarget);
        // 👑 عند فتح القائمة، نخفي النقطة الحمراء لأن المستخدم شاهد الإشعارات
        setHasNewNotification(false);
    };

    const handleCloseNotifications = () => {
        setNotificationAnchorEl(null);
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast({ ...toast, open: false });
    };

    useEffect(() => {
        try {
            const loginData = localStorage.getItem("user");

            if (loginData) {
                const parsedUser = JSON.parse(loginData);
                setCurrentUser({
                    name: parsedUser.name || parsedUser.first_name || "",
                    role: parsedUser.role || parsedUser.user_type || "FREELANCER",
                    avatar: parsedUser.avatar || parsedUser.profile_image || ""
                });

                requestForToken();

                // 🚀 الاستماع اللحظي (Real-time) للإشعارات القادمة من الباك إند
                const listenForNotifications = () => {
                    onMessageListener()
                        .then((payload) => {
                            console.log("🔔 Real-time Notification Received:", payload);

                            // 1. إظهار النافذة المنبثقة الذهبية
                            setToast({
                                open: true,
                                title: payload.notification?.title || "New Notification",
                                body: payload.notification?.body || "You have a new update."
                            });

                            // 2. تفعيل النقطة الحمراء على أيقونة الجرس فوراً!
                            setHasNewNotification(true);

                            if (Notification.permission === 'granted') {
                                new Notification(payload.notification?.title || "New Notification", {
                                    body: payload.notification?.body || "",
                                    icon: '/logo.png'
                                });
                            }

                            listenForNotifications();
                        })
                        .catch((err) => console.log('Notification listener failed: ', err));
                };

                listenForNotifications();
            }
        } catch (error) {
            console.error("Error parsing login data:", error);
        }
    }, []);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.45) !important" : "rgba(250, 248, 245, 0.65) !important",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderBottom: "1px solid",
                    borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                    transition: "background-color 0.3s ease",
                }}
            >
                <Toolbar sx={{ minHeight: "70px !important", px: 4, justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "1.1rem", fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontWeight: 700, letterSpacing: '0.05em' }}>
                        {title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton size="small" onClick={toggleColorMode} sx={{ color: theme.palette.text.secondary, "&:hover": { color: "primary.main" } }}>
                            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {/* 👑 أيقونة الجرس مربوطة بالنقطة الحمراء اللحظية */}
                        <IconButton
                            size="small"
                            onClick={handleOpenNotifications}
                            sx={{ color: theme.palette.text.secondary, "&:hover": { color: "primary.main" } }}
                        >
                            <Badge
                                color="error"
                                variant="dot"
                                invisible={!hasNewNotification}
                                sx={{ '& .MuiBadge-badge': { backgroundColor: '#e74c3c' } }} // لون أحمر واضح
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <NotificationsPopover
                            id="notifications-popover"
                            open={Boolean(notificationAnchorEl)}
                            anchorEl={notificationAnchorEl}
                            onClose={handleCloseNotifications}
                        />

                        <Box
                            onClick={() => navigate('/my-profile')}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                ml: 1,
                                cursor: "pointer",
                                transition: "opacity 0.2s ease",
                                "&:hover": { opacity: 0.8 }
                            }}
                        >
                            <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Cinzel', serif" }} noWrap>
                                    {currentUser.name}
                                </Typography>
                                <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                                    {currentUser.role}
                                </Typography>
                            </Box>
                            <Avatar src={currentUser.avatar} sx={{ width: 38, height: 38, border: "1px solid", borderColor: "primary.main" }} />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
                sx={{ mt: 7, zIndex: 9999 }}
            >
                <Alert
                    onClose={handleCloseToast}
                    icon={<NotificationsIcon sx={{ color: '#b38c45' }} />}
                    sx={{
                        width: '100%',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(28, 23, 18, 0.95)' : '#fff',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        border: '1px solid #b38c45',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Cinzel', serif", color: '#b38c45' }}>
                        {toast.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', mt: 0.5, color: theme.palette.text.secondary }}>
                        {toast.body}
                    </Typography>
                </Alert>
            </Snackbar>
        </>
    );
};

export default Header;