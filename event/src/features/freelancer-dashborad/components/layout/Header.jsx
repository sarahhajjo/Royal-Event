import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

import { ColorModeContext } from "../../../../main";

const Header = ({ title = "Dashboard", user = {} }) => {
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const { name = "Ghazal kawas", role = "Service Provider", avatar = "" } = user;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
                transition: "background-color 0.3s ease",
            }}
        >
            <Toolbar sx={{ minHeight: "70px !important", px: 4, justifyContent: "space-between" }}>
                {/* العنوان */}
                <Typography sx={{ fontSize: "1.1rem", fontFamily: "'Cinzel', serif", color: "text.primary", fontWeight: 700 }}>
                    {title}
                </Typography>

                {/* الأيقونات ومعلومات المستخدم */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* زر التبديل */}
                    <IconButton size="small" onClick={toggleColorMode} sx={{ color: "text.secondary" }}>
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {/* زر الإشعارات */}
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <NotificationsIcon />
                    </IconButton>

                    {/* معلومات المستخدم (مدمجة بانسيابية) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
                        <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Cinzel', serif" }} noWrap>
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