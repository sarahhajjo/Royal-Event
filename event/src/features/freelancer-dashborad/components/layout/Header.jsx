import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

import { ColorModeContext } from "../../../../main";

const Header = ({ title = "Elite Admin" }) => {
    const { mode, toggleColorMode } = useContext(ColorModeContext);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
                zIndex: (t) => t.zIndex.drawer - 1,
            }}
        >
            <Toolbar sx={{ minHeight: "70px !important", px: 4, justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "1.1rem", fontFamily: "'Cinzel', serif", color: "text.primary", fontWeight: 700 }}>
                    {title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <IconButton size="small" onClick={toggleColorMode} sx={{ color: "text.secondary" }}>
                        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <NotificationsIcon />
                    </IconButton>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 2, borderLeft: "1px solid", borderColor: "divider" }}>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}>
                                Admin
                            </Typography>
                            <Typography sx={{ color: "text.secondary", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                                SUPERUSER
                            </Typography>
                        </Box>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "#8C6D32", color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
                            A
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;