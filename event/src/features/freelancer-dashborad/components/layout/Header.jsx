import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, useTheme } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import { useNavigate } from "react-router-dom";

import { ColorModeContext } from "../../../../main";

const Header = ({ title = "Dashboard", user = {} }) => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const { name = "Ghazal kawas", role = "Service Provider", avatar = "" } = user;
    const navigate = useNavigate();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                // 👑 تعديل اللون ليكون أوف-وايت مريح يتطابق مع السايد بار في اللايت مود
                bgcolor: theme.palette.mode === 'dark' ? "rgba(15, 15, 20, 0.45) !important" : "rgba(250, 248, 245, 0.65) !important",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid",
                borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                transition: "background-color 0.3s ease",
            }}
        >
            <Toolbar sx={{ minHeight: "70px !important", px: 4, justifyContent: "space-between" }}>
                {/* العنوان */}
                <Typography sx={{ fontSize: "1.1rem", fontFamily: "'Cinzel', serif", color: theme.palette.text.primary, fontWeight: 700, letterSpacing: '0.05em' }}>
                    {title}
                </Typography>

                {/* الأيقونات ومعلومات المستخدم */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* زر التبديل بين الثيمات */}
                    <IconButton size="small" onClick={toggleColorMode} sx={{ color: theme.palette.text.secondary, "&:hover": { color: "primary.main" } }}>
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {/* زر الإشعارات */}
                    <IconButton size="small" sx={{ color: theme.palette.text.secondary, "&:hover": { color: "primary.main" } }}>
                        <NotificationsIcon />
                    </IconButton>

                    {/* معلومات المستخدم */}
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
                                {name}
                            </Typography>
                            <Typography sx={{ color: "primary.main", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                                {role}
                            </Typography>
                        </Box>
                        <Avatar src={avatar} sx={{ width: 38, height: 38, border: "1px solid", borderColor: "primary.main" }} />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;